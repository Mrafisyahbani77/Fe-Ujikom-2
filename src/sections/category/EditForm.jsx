import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Button, Card, CardContent, TextField, Typography, Box } from '@mui/material';
// hooks
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
// utils
import { useMutationUpdate } from 'src/utils/category';

export default function EditForm({ currentProduct }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // State untuk nama kategori dan file gambar
  const [name, setName] = useState(currentProduct?.name || '');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(currentProduct?.image_url || '');
  const fileInputRef = useRef(null);

  // Schema validasi Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nama kategori wajib diisi'),
    image_url: Yup.mixed().nullable(),
  });

  const { handleSubmit, setValue } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (currentProduct) {
      setName(currentProduct.name);
      setPreview(currentProduct.image_url);
      setValue('name', currentProduct.name);
    }
  }, [currentProduct, setValue]);

  // Menangani perubahan file gambar
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
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

  const mutation = useMutationUpdate({
    onSuccess: () => {
      enqueueSnackbar('Kategori berhasil diperbarui', { variant: 'success' });
      router.push('/dashboard/category/list');
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Terjadi kesalahan', { variant: 'error' });
    },
    // id: currentProduct?.id, // Memastikan id tetap dalam konfigurasi
  });

  const onSubmit = () => {
    if (!currentProduct?.id) {
      console.error('ID kategori tidak ditemukan!');
      enqueueSnackbar('ID kategori tidak ditemukan!', { variant: 'error' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);

      if (image) {
        formData.append('image_url', image);
      }

      // Kirim ID saat memanggil `mutate()`
      mutation.mutate({ id: currentProduct.id, data: formData });
    } catch (error) {
      console.error('Mutation error:', error);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 5 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Edit Kategori
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Nama Kategori"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
