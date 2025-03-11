import { useState } from 'react';
import { Button, TextField, Card, CardContent, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMutationCreate } from 'src/utils/banner';
import { useRouter } from 'src/routes/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { paths } from 'src/routes/paths';

export default function CreateForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [link, setLink] = useState('');
  const [priority, setPriority] = useState('');
  const [isActive, setIsActive] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutationCreate({
    onSuccess: () => {
      enqueueSnackbar('Banner berhasil dibuat', { variant: 'success' });

      setTitle('');
      setImage(null);
      setLink('');
      setPriority('');
      setIsActive(true);

      router.push(paths.dashboard.banner.list);
      queryClient.invalidateQueries({ queryKey: ['fetch.banner'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !image) {
      enqueueSnackbar('Title dan image harus diisi', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image_url', image);
    if (link) formData.append('link', link);
    if (priority) formData.append('priority', priority);
    formData.append('is_active', isActive);

    mutation.mutate(formData);
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 5 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Buat Banner
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title Banner"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ display: 'block', marginBottom: 16 }}
          />
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
            label="Priority (Opsional)"
            variant="outlined"
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
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
