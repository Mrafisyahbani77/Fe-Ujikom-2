import { useState } from 'react';
import { Button, TextField, Card, CardContent, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMutationCreate } from 'src/utils/category';
import { useRouter } from 'src/routes/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { paths } from 'src/routes/paths';

export default function CreateForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutationCreate({
    onSuccess: () => {
      enqueueSnackbar('Kategori berhasil dibuat', { variant: 'success' });

      setName('');
      setImage(null);

      router.push(paths.dashboard.category.list);
      queryClient.invalidateQueries({ queryKey: ['fetch.category'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';

      if (errorMessage.includes('Kategori dengan nama tersebut sudah ada')) {
        enqueueSnackbar('Kategori dengan nama tersebut sudah ada!', { variant: 'warning' });
      } else {
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image) {
      enqueueSnackbar('Nama dan gambar harus diisi', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image_url', image);

    mutation.mutate(formData);
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 5 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Buat Kategori
        </Typography>
        <form onSubmit={handleSubmit}>
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
            onChange={(e) => setImage(e.target.files[0])}
            style={{ display: 'block', marginBottom: 16 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Simpan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
