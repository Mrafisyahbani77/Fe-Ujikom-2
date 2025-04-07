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
} from '@mui/material';
// hooks
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { useMutationUpdate } from 'src/utils/banner';

export default function EditForm({ currentProduct }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [title, setTitle] = useState(currentProduct?.title || '');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(currentProduct?.image_url || '');
  const [link, setLink] = useState(currentProduct?.link || '');
  const [priority, setPriority] = useState(currentProduct?.priority || '');
  const [isActive, setIsActive] = useState(currentProduct?.is_active || false);
  const fileInputRef = useRef(null);

  // Schema validasi Yup
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Judul wajib diisi'),
    image_url: Yup.mixed().nullable(),
    link: Yup.string().url('Masukkan URL yang valid').nullable(),
    priority: Yup.number().integer().min(1, 'Prioritas minimal 1').nullable(),
    is_active: Yup.boolean(),
  });

  const { handleSubmit, setValue } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (currentProduct) {
      setTitle(currentProduct.title);
      setPreview(currentProduct.image_url);
      setLink(currentProduct.link);
      setPriority(currentProduct.priority);
      setIsActive(currentProduct.is_active);
      setValue('title', currentProduct.title);
      setValue('link', currentProduct.link);
      setValue('priority', currentProduct.priority);
      setValue('is_active', currentProduct.is_active);
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
    currentProduct?.id // Menambahkan ID sebagai parameter kedua
  );

  const onSubmit = () => {
    // if (!title || !image) {
    //   enqueueSnackbar('Judul dan gambar harus diisi', { variant: 'warning' });
    //   return;
    // }

    try {
      const formData = new FormData();
      formData.append('title', title);
      if (image) formData.append('image', image);
      if (link) formData.append('link', link);
      if (priority) formData.append('priority', priority);
      formData.append('is_active', isActive ? '1' : '0');

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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'block', marginBottom: 16 }}
          />
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
          <TextField
            fullWidth
            label="Link (Opsional)"
            variant="outlined"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Prioritas (Opsional)"
            variant="outlined"
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                color="primary"
              />
            }
            label="Aktif"
            sx={{ mb: 2 }}
          />
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
