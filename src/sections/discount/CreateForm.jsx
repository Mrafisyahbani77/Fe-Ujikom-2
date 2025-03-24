import { useState } from 'react';
import { Button, TextField, Card, CardContent, Typography, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMutationCreate } from 'src/utils/discount';
import { useRouter } from 'src/routes/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { paths } from 'src/routes/paths';

export default function CreateDiscountForm() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_amount: 0,
    max_discount_amount: '',
    start_date: '',
    end_date: '',
    usage_limit: 0,
  });

  const mutation = useMutationCreate({
    onSuccess: () => {
      enqueueSnackbar('Diskon berhasil dibuat', { variant: 'success' });
      setForm({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_amount: 0,
        max_discount_amount: '',
        start_date: '',
        end_date: '',
        usage_limit: 0,
      });
      router.push(paths.dashboard.discount.list);
      queryClient.invalidateQueries({ queryKey: ['fetch.discount'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.code || !form.discount_value || !form.start_date || !form.end_date) {
      enqueueSnackbar('Pastikan semua data yang wajib diisi sudah terisi', { variant: 'warning' });
      return;
    }
    mutation.mutate(form);
  };

  return (
    <Card sx={{ maxWidth: 500, margin: 'auto', mt: 5, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Buat Diskon
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Kode Diskon"
            name="code"
            variant="outlined"
            value={form.code}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Deskripsi"
            name="description"
            variant="outlined"
            value={form.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Tipe Diskon"
            name="discount_type"
            variant="outlined"
            value={form.discount_type}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="percentage">Persentase</MenuItem>
            <MenuItem value="fixed">Tetap</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Nilai Diskon"
            name="discount_value"
            type="number"
            variant="outlined"
            value={form.discount_value}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Minimal Order (Opsional)"
            name="min_order_amount"
            type="number"
            variant="outlined"
            value={form.min_order_amount}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Maksimal Diskon (Opsional)"
            name="max_discount_amount"
            type="number"
            variant="outlined"
            value={form.max_discount_amount}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Tanggal Mulai"
            name="start_date"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={form.start_date}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Tanggal Selesai"
            name="end_date"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={form.end_date}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Batas Penggunaan (Opsional)"
            name="usage_limit"
            type="number"
            variant="outlined"
            value={form.usage_limit}
            onChange={handleChange}
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
