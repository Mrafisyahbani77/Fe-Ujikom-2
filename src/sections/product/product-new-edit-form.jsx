import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';
import { useMutationCreate, useMutationUpdate } from 'src/utils/product';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchCategory } from 'src/utils/category';

// ----------------------------------------------------------------------

export default function ProductNewEditForm({ currentProduct }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  // const [includeTaxes, setIncludeTaxes] = useState(false);
  // const [status, setStatus] = useState('publish'); // Default ke 'publish'
  const { data, productsLoading, productsEmpty } = useFetchCategory();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    images: Yup.array().min(1, 'Images is required'),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    categories_id: Yup.number().required('Category is required'), // Perbaikan: ID kategori biasanya angka
    price: Yup.number()
      .transform((value, originalValue) => {
        if (typeof originalValue === 'string') {
          const cleaned = originalValue.replace(/,/g, ''); // hapus koma
          return Number(cleaned);
        }
        return value;
      })
      .typeError('Price must be a number')
      .required('Price is required'),
    stock: Yup.number().min(0, 'Stock should not be negative'),
    description: Yup.string().required('Description is required'),
    // taxes: Yup.number().nullable(),
    // newLabel: Yup.object().shape({
    //   enabled: Yup.boolean(),
    //   content: Yup.string(),
    // }),
    // saleLabel: Yup.object().shape({
    //   enabled: Yup.boolean(),
    //   content: Yup.string(),
    // }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      images: currentProduct?.images || [],
      price: currentProduct?.price || 0,
      stock: currentProduct?.stock.quantity || 0,
      categories_id: currentProduct?.categories.id || '',
      color: currentProduct?.color || [],
      size: currentProduct?.size || [],
      status: currentProduct?.status || 'publish',
      // newLabel: currentProduct?.newLabel || { enabled: false, content: '' },
      // saleLabel: currentProduct?.saleLabel || { enabled: false, content: '' },
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
  const status = watch('status');

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  // useEffect(() => {
  //   if (includeTaxes) {
  //     setValue('taxes', 0);
  //   } else {
  //     setValue('taxes', currentProduct?.taxes || 0);
  //   }
  // }, [currentProduct?.taxes, includeTaxes, setValue]);

  // Create mutation hook
  const createMutation = useMutationCreate({
    onSuccess: () => {
      enqueueSnackbar('Produk berhasil dibuat!', { variant: 'success' });
      router.push(paths.dashboard.product.root);
      queryClient.invalidateQueries({ queryKey: ['fetch.products'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  // Update mutation hook
  const updateMutation = useMutationUpdate({
    onSuccess: () => {
      enqueueSnackbar('Produk berhasil di perbarui!', { variant: 'success' });
      router.push(paths.dashboard.product.root);
      queryClient.invalidateQueries({ queryKey: ['fetch.products'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('stock', data.stock.toString());
      formData.append('categories_id', data.categories_id.toString());

      if (data.size.length) {
        formData.append('size', JSON.stringify(data.size));
      }
      if (data.color.length) {
        formData.append('color', JSON.stringify(data.color));
      }

      formData.append('status', status);

      if (data.images.length) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      if (currentProduct?.id) {
        await updateMutation.mutateAsync({ id: currentProduct.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });

  function formatNumber(value) {
    if (!value) return value;
    const onlyNumbers = value.toString().replace(/[^\d]/g, ''); // Buang semua selain angka
    return onlyNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Tambahin koma setiap 3 digit
  }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  // const handleChangeIncludeTaxes = useCallback((event) => {
  //   setIncludeTaxes(event.target.checked);
  // }, []);

  const handleChangeStatus = useCallback((event) => {
    setValue(event.target.checked ? 'publish' : 'private');
  }, []);

  const renderForm = (
    <>
      <Grid xs={12} md={8}>
        <Card>
          {/* {!mdUp && <CardHeader title="Details" />} */}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Nama Produk" />

            {/* <RHFTextField name="subDescription" label="Sub Description" multiline rows={4} /> */}

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Deskripsi</Typography>
              <RHFEditor simple name="description" />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Gambar Produk</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
          </Stack>

          {/* {!mdUp && <CardHeader title="Properties" />} */}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              {/* <RHFTextField name="code" label="Product Code" />

              <RHFTextField name="sku" label="Product SKU" /> */}

              <RHFTextField
                name="stock"
                label="Stok"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              <RHFSelect name="categories_id" label="Kategori">
                <option value="" disabled>
                  Select category
                </option>
                {data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFMultiSelect
                checkbox
                name="color"
                label="Warna"
                options={PRODUCT_COLOR_NAME_OPTIONS}
              />

              <RHFMultiSelect checkbox name="size" label="Ukuran" options={PRODUCT_SIZE_OPTIONS} />
            </Box>

            {/* <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            /> */}

            {/* <Stack spacing={1}>
              <Typography variant="subtitle2">Gender</Typography>
              <RHFMultiCheckbox row name="gender" spacing={2} options={PRODUCT_GENDER_OPTIONS} />
            </Stack> */}

            <Divider sx={{ borderStyle: 'dashed' }} />

            {/* <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="saleLabel.content"
                label="Sale Label"
                fullWidth
                disabled={!values.saleLabel.enabled}
              />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="newLabel.content"
                label="New Label"
                fullWidth
                disabled={!values.newLabel.enabled}
              />
            </Stack> */}
          </Stack>

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="price"
              label="Harga"
              onChange={(e) => {
                const formattedValue = formatNumber(e.target.value);
                setValue('price', formattedValue); // setValue dari react-hook-form
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
              }}
            />

            {/* <RHFTextField
              name="priceSale"
              label="Sale Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            /> */}

            {/* <FormControlLabel
              control={<Switch checked={includeTaxes} onChange={handleChangeIncludeTaxes} />}
              label="Price includes taxes"
            />

            {!includeTaxes && (
              <RHFTextField
                name="taxes"
                label="Tax (%)"
                placeholder="0.00"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        %
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )} */}
          </Stack>
        </Card>
      </Grid>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Switch
              checked={status === 'publish'}
              onChange={(event) => {
                setValue('status', event.target.checked ? 'publish' : 'private');
              }}
            />
          }
          label={status === 'publish' ? 'Publish' : 'Private'}
        />

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentProduct ? 'Create Product' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid
        container
        spacing={4}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: '100vh', // Jika ingin di tengah layar
        }}
      >
        {renderForm}
      </Grid>
    </FormProvider>
  );
}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
