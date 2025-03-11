import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, { RHFUpload, RHFTextField } from 'src/components/hook-form';
import { useMutationUpdate } from 'src/utils/banner';

// ----------------------------------------------------------------------

export default function EditForm({ currentProduct }) {
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();


  // Schema validasi
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Nama kategori wajib diisi'),
    image_url: Yup.array()
      .min(1, 'Gambar wajib diunggah')
      .max(1, 'Hanya boleh mengunggah satu gambar'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentProduct?.id || '', // Tambahkan ini
      name: currentProduct?.name || '',
      image_url: currentProduct?.image_url ? [currentProduct.image_url] : [],
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  const mutation = useMutationUpdate(
    {
      onSuccess: () => {
        enqueueSnackbar('Kategori berhasil diperbarui', { variant: 'success' });
        router.push(paths.dashboard.category.list);
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      },
    },
    currentProduct?.id // Pastikan id dikirimkan di sini
  );

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      //   formData.append('id', currentProduct?.id);
      formData.append('name', data.name);

      // Hanya tambahkan gambar jika ada
      if (data.image_url?.length > 0) {
        formData.append('image', data.image_url[0]);
      }

      console.log('Submitting FormData:', formData); // Debugging

      mutation.mutate(formData);
    } catch (error) {
      console.error('Mutation error:', error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFile = acceptedFiles[0]; // Ambil hanya satu file
      if (newFile) {
        setValue('image_url', [newFile], { shouldValidate: true });
      }
    },
    [setValue]
  );

  // Remove single file
  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.image_url?.filter((file) => file !== inputFile);
      setValue('image_url', filtered);
    },
    [setValue, values.image_url]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        spacing={4}
        sx={{
          margin: 'auto',
          mt: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card sx={{ width: '100%', maxWidth: 600, textAlign: 'center' }}>
            {!mdUp && <CardHeader title="Details" sx={{ textAlign: 'center' }} />}

            <Stack spacing={3} sx={{ p: 3 }}>
              <RHFTextField name="name" label="Nama Kategori *" fullWidth />

              <Stack spacing={1.5} sx={{ width: '100%' }}>
                <Typography variant="subtitle1">Gambar</Typography>
                <RHFUpload
                  thumbnail
                  name="images"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemoveFile}
                />
              </Stack>
            </Stack>
            <LoadingButton
              sx={{ mb: 5 }}
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting || mutation.isLoading}
            >
              {!currentProduct ? 'Tambah Kategori' : 'Simpan Perubahan'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

EditForm.propTypes = {
  currentProduct: PropTypes.object,
};
