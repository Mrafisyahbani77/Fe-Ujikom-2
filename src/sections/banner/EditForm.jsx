import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
  FormControlLabel,
  Switch,
  FormHelperText,
} from '@mui/material';
// hooks
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { useMutationUpdate } from 'src/utils/banner';

export default function EditForm({ currentProduct }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [preview, setPreview] = useState(currentProduct?.image_url || '');
  const [image, setImage] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false); // Track if image was deliberately removed
  const fileInputRef = useRef(null);

  // Schema validasi Yup
  const validationSchema = Yup.object().shape({
    // title: Yup.string().required('Judul wajib diisi'),
    // link: Yup.string().url('Masukkan URL yang valid').nullable(),
    // priority: Yup.number().integer().min(1, 'Prioritas minimal 1').nullable(),
    // is_active: Yup.boolean(),
  });

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: currentProduct?.title || '',
      link: currentProduct?.link || '',
      priority: currentProduct?.priority || '',
      is_active: currentProduct?.is_active || false,
    },
  });

  const title = watch('title');
  const link = watch('link');
  const priority = watch('priority');
  const isActive = watch('is_active');

  useEffect(() => {
    if (currentProduct) {
      setValue('title', currentProduct.title);
      setValue('link', currentProduct.link);
      setValue('priority', currentProduct.priority);
      setValue('is_active', currentProduct.is_active);
      setPreview(currentProduct.image_url);
      setImageRemoved(false); // Reset the removed flag when product changes
    }
  }, [currentProduct, setValue]);

  // Menangani perubahan file gambar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const { width, height } = img;

        // Misal kamu mau validasi minimal 1920x600
        if (width >= 1920 && height >= 600) {
          setImage(file);
          setPreview(img.src);
          setImageRemoved(false); // Reset the removed flag when new image is added
        } else {
          enqueueSnackbar(
            `Ukuran gambar terlalu kecil! Minimal 1920x600 px. (Sekarang ${width}x${height}px)`,
            { variant: 'error' }
          );
          // Reset input
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };

      img.onerror = () => {
        enqueueSnackbar('Gagal membaca gambar', { variant: 'error' });
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
    }
  };

  // Menghapus gambar yang dipilih
  const handleRemoveImage = () => {
    setImage(null);
    setPreview('');
    setImageRemoved(true); // Mark that image was deliberately removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const mutation = useMutationUpdate(
    {
      onSuccess: () => {
        enqueueSnackbar('Banner berhasil diperbarui', { variant: 'success' });
        router.push('/dashboard/banner/list');
      },
      onError: (error) => {
        enqueueSnackbar(error.message || 'Terjadi kesalahan', { variant: 'error' });
      },
    },
    currentProduct?.id
  );

  const onSubmit = (data) => {
    // Check if title is empty
    if (!data.title) {
      enqueueSnackbar('Judul harus diisi', { variant: 'warning' });
      return;
    }

    // Check if image was removed and no new image was uploaded
    if (imageRemoved && !image) {
      enqueueSnackbar('Gambar harus diisi', { variant: 'warning' });
      return;
    }

    // With this logic:
    // - If imageRemoved=false and no new image: use existing image
    // - If imageRemoved=true and no new image: show error (above check)
    // - If new image (image !== null): use new image

    try {
      const formData = new FormData();
      formData.append('title', data.title);

      // Only append image if a new one was selected
      if (image) {
        formData.append('image', image);
      } else if (imageRemoved) {
        // Should never reach here due to earlier validation, but just in case
        enqueueSnackbar('Gambar harus diisi', { variant: 'warning' });
        return;
      }
      // If no new image and not removed, the existing image stays as is

      if (data.link) formData.append('link', data.link);
      if (data.priority) formData.append('priority', data.priority);
      formData.append('is_active', data.is_active ? '1' : '0');

      mutation.mutate(formData);
    } catch (error) {
      console.error('Mutation error:', error);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 5 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Edit Banner
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Judul Banner"
            variant="outlined"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'block', marginBottom: 16 }}
            />
            {imageRemoved && !image && <FormHelperText error>Gambar wajib diisi</FormHelperText>}
          </Box>

          {preview && (
            <Box sx={{ mb: 3 }}>
              <img
                src={preview}
                alt="Preview"
                style={{ width: '100%', height: 'auto', marginBottom: 16 }}
              />
              <Button onClick={handleRemoveImage} variant="outlined" color="secondary" fullWidth>
                Hapus Gambar
              </Button>
            </Box>
          )}

          {/* <TextField
            fullWidth
            label="Link (Opsional)"
            variant="outlined"
            {...register('link')}
            error={!!errors.link}
            helperText={errors.link?.message}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Prioritas (Opsional)"
            variant="outlined"
            type="number"
            {...register('priority')}
            error={!!errors.priority}
            helperText={errors.priority?.message}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setValue('is_active', e.target.checked)}
                color="primary"
              />
            }
            label="Aktif"
            sx={{ mb: 2 }}
          /> */}

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Simpan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

EditForm.propTypes = {
  currentProduct: PropTypes.object,
};
