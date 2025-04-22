import { useRef, useState } from 'react';
import { Button, TextField, Card, CardContent, Typography, Box } from '@mui/material';
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
  const [preview, setPreview] = useState(null);
  const router = useRouter();
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const mutation = useMutationCreate({
    onSuccess: () => {
      enqueueSnackbar('Banner berhasil dibuat', { variant: 'success' });

      setTitle('');
      setImage(null);
      setLink('');
      setPriority('');
      setIsActive(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
      router.push(paths.dashboard.banner.list);
      queryClient.invalidateQueries({ queryKey: ['fetch.banner'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

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

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !image) {
      enqueueSnackbar('Title dan image harus diisi', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);
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
            ref={fileInputRef}
            onChange={handleFileChange}
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
          {/* <TextField
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
          /> */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Simpan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
