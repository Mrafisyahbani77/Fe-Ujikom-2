import { useState } from 'react';
import { Button, TextField, Card, CardContent, Typography, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMutationCreate } from 'src/utils/discount';
import { useRouter } from 'src/routes/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { paths } from 'src/routes/paths';
import { NumericFormat } from 'react-number-format';

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

  const handleDiscountValueChange = (values) => {
    const { value } = values;
    setForm((prev) => ({
      ...prev,
      discount_value: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Buat Diskon
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField
            name="code"
            label="Kode Diskon"
            value={form.code}
            onChange={handleChange}
            required
          />
          <TextField
            name="description"
            label="Deskripsi"
            value={form.description}
            onChange={handleChange}
            required
          />
          <TextField
            name="discount_type"
            label="Tipe Diskon"
            value={form.discount_type}
            onChange={handleChange}
            select
            required
          >
            <MenuItem value="percentage">Persentase (%)</MenuItem>
            <MenuItem value="fixed">Tetap (Rp)</MenuItem>
          </TextField>

          {/* INI Bagian Diskon Value */}
          <NumericFormat
            value={form.discount_value}
            onValueChange={(values) => {
              const { floatValue } = values;
              setForm((prev) => ({
                ...prev,
                discount_value: floatValue || '',
              }));
            }}
            thousandSeparator="."
            decimalSeparator=","
            prefix={form.discount_type === 'fixed' ? 'Rp ' : ''}
            suffix={form.discount_type === 'percentage' ? ' %' : ''}
            allowNegative={false}
            isNumericString
            customInput={TextField}
            label="Nilai Diskon"
            fullWidth
            margin="normal"
          />

          {/* Input lainnya */}
          <NumericFormat
            value={form.min_order_amount}
            onValueChange={(values) => {
              const { floatValue } = values;
              setForm((prev) => ({
                ...prev,
                min_order_amount: floatValue || '',
              }));
            }}
            thousandSeparator="."
            decimalSeparator=","
            prefix="Rp "
            allowNegative={false}
            isNumericString
            customInput={TextField}
            name="min_order_amount"
            label="Minimal Pembelian (Rp)"
            fullWidth
            margin="normal"
          />

          <NumericFormat
            value={form.max_discount_amount}
            onValueChange={(values) => {
              const { floatValue } = values;
              setForm((prev) => ({
                ...prev,
                max_discount_amount: floatValue || '',
              }));
            }}
            thousandSeparator="."
            decimalSeparator=","
            prefix="Rp "
            allowNegative={false}
            isNumericString
            customInput={TextField}
            name="max_discount_amount"
            label="Maksimal Diskon (Rp)"
            fullWidth
            margin="normal"
          />

          <TextField
            name="start_date"
            label="Tanggal Mulai"
            type="date"
            value={form.start_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="end_date"
            label="Tanggal Selesai"
            type="date"
            value={form.end_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="usage_limit"
            label="Batas Penggunaan"
            type="number"
            value={form.usage_limit}
            onChange={handleChange}
          />

          <Button type="submit" variant="contained" color="primary">
            Simpan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
