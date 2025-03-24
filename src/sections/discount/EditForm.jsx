import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
// hooks
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
// utils
import { useMutationUpdate } from 'src/utils/discount';

export default function EditForm({ currentDiscount }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    code: Yup.string().required('Kode wajib diisi'),
    description: Yup.string().required('Deskripsi wajib diisi'),
    discount_type: Yup.string().required('Tipe diskon wajib diisi'),
    discount_value: Yup.number().required('Nilai diskon wajib diisi').min(0, 'Tidak boleh negatif'),
    min_order_amount: Yup.number()
      .required('Minimal pesanan wajib diisi')
      .min(0, 'Tidak boleh negatif'),
    max_discount_amount: Yup.number()
      .required('Maksimal diskon wajib diisi')
      .min(0, 'Tidak boleh negatif'),
    start_date: Yup.date().required('Tanggal mulai wajib diisi'),
    end_date: Yup.date().required('Tanggal berakhir wajib diisi'),
    usage_limit: Yup.number()
      .required('Batas penggunaan wajib diisi')
      .min(0, 'Tidak boleh negatif'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      code: '',
      description: '',
      discount_type: '',
      discount_value: '',
      min_order_amount: '',
      max_discount_amount: '',
      start_date: '',
      end_date: '',
      usage_limit: '',
    },
  });

  // Mengisi form dengan data yang ada
  useEffect(() => {
    if (currentDiscount) {
      Object.keys(currentDiscount).forEach((key) => {
        setValue(key, currentDiscount[key]);
      });
    }
  }, [currentDiscount, setValue]);

  const mutation = useMutationUpdate({
    onSuccess: () => {
      enqueueSnackbar('Diskon berhasil diperbarui', { variant: 'success' });
      router.push('/dashboard/discount/list');
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Terjadi kesalahan', { variant: 'error' });
    },
  });

  const onSubmit = (data) => {
    if (!currentDiscount?.id) {
      enqueueSnackbar('ID diskon tidak ditemukan!', { variant: 'error' });
      return;
    }
    mutation.mutate({ id: currentDiscount.id, data });
  };

  return (
    <Card sx={{ maxWidth: 500, margin: 'auto', mt: 5 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Edit Diskon
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Kode"
            variant="outlined"
            {...register('code')}
            error={!!errors.code}
            helperText={errors.code?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Deskripsi"
            variant="outlined"
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Tipe Diskon"
            variant="outlined"
            {...register('discount_type')}
            error={!!errors.discount_type}
            helperText={errors.discount_type?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Nilai Diskon"
            variant="outlined"
            type="number"
            {...register('discount_value')}
            error={!!errors.discount_value}
            helperText={errors.discount_value?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Minimal Pesanan"
            variant="outlined"
            type="number"
            {...register('min_order_amount')}
            error={!!errors.min_order_amount}
            helperText={errors.min_order_amount?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Maksimal Diskon"
            variant="outlined"
            type="number"
            {...register('max_discount_amount')}
            error={!!errors.max_discount_amount}
            helperText={errors.max_discount_amount?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Tanggal Mulai"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register('start_date')}
            error={!!errors.start_date}
            helperText={errors.start_date?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Tanggal Berakhir"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register('end_date')}
            error={!!errors.end_date}
            helperText={errors.end_date?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Batas Penggunaan"
            variant="outlined"
            type="number"
            {...register('usage_limit')}
            error={!!errors.usage_limit}
            helperText={errors.usage_limit?.message}
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
  currentDiscount: PropTypes.object,
};
