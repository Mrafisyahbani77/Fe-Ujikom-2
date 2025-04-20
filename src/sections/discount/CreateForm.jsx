import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Box,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMutationCreate } from 'src/utils/discount';
import { useRouter } from 'src/routes/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { paths } from 'src/routes/paths';
import { NumericFormat } from 'react-number-format';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

export default function CreateDiscountForm() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Validation schema
  const validationSchema = Yup.object().shape({
    code: Yup.string().required('Kode wajib diisi'),
    description: Yup.string().required('Deskripsi wajib diisi'),
    discount_type: Yup.string()
      .required('Tipe diskon wajib diisi')
      .oneOf(['percentage', 'fixed'], 'Tipe diskon harus percentage atau fixed'),
    discount_value: Yup.number()
      .required('Nilai diskon wajib diisi')
      .when('discount_type', {
        is: 'percentage',
        then: (schema) =>
          schema
            .min(0, 'Nilai diskon harus lebih dari 0')
            .max(100, 'Nilai diskon tidak boleh lebih dari 100%'),
        otherwise: (schema) => schema.min(0.01, 'Nilai diskon harus lebih dari 0'),
      }),
    min_order_amount: Yup.number()
      .required('Minimal pesanan wajib diisi')
      .min(0, 'Tidak boleh negatif'),
    max_discount_amount: Yup.number().when(['discount_type', 'discount_value'], {
      is: (discount_type, discount_value) => discount_type === 'percentage' && discount_value > 30,
      then: (schema) =>
        schema
          .required('Maksimal diskon wajib diisi untuk persentase di atas 30%')
          .min(0, 'Tidak boleh negatif'),
      otherwise: (schema) => schema.min(0, 'Tidak boleh negatif'),
    }),
    usage_limit: Yup.number()
      .required('Batas penggunaan wajib diisi')
      .min(0, 'Tidak boleh negatif'),
    start_date: Yup.date().required('Tanggal mulai wajib diisi'),
    end_date: Yup.date().required('Tanggal selesai wajib diisi'),
    is_public: Yup.boolean(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      min_order_amount: 0,
      max_discount_amount: '',
      start_date: '',
      end_date: '',
      usage_limit: 0,
      is_public: false,
    },
    mode: 'onBlur',
  });

  const discountType = watch('discount_type');
  const discountValue = watch('discount_value');
  const isPublic = watch('is_public');

  // Format date for submission to backend
  const formatDateTime = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
      .getDate()
      .toString()
      .padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  const mutation = useMutationCreate({
    onSuccess: () => {
      enqueueSnackbar('Diskon berhasil dibuat', { variant: 'success' });
      reset();
      router.push(paths.dashboard.discount.list);
      queryClient.invalidateQueries({ queryKey: ['fetch.discount'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      start_date: formatDateTime(data.start_date),
      end_date: formatDateTime(data.end_date),
    };
    mutation.mutate(payload);
  };

  // Check if max_discount_amount warning should be shown
  const showMaxDiscountWarning = discountType === 'percentage' && discountValue > 30;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Buat Diskon
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <TextField
            label="Kode Diskon"
            fullWidth
            {...register('code')}
            error={!!errors.code}
            helperText={errors.code?.message}
          />

          <TextField
            label="Deskripsi"
            fullWidth
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <TextField
            label="Tipe Diskon"
            fullWidth
            select
            {...register('discount_type')}
            error={!!errors.discount_type}
            helperText={errors.discount_type?.message}
            value={discountType} // Explicitly set the value from watch
          >
            <MenuItem value="percentage">Persentase (%)</MenuItem>
            <MenuItem value="fixed">Tetap (Rp)</MenuItem>
          </TextField>

          {/* Discount Value */}
          <NumericFormat
            customInput={TextField}
            label="Nilai Diskon"
            fullWidth
            value={watch('discount_value')}
            onValueChange={(values) => {
              const { floatValue } = values;
              setValue('discount_value', floatValue || '', { shouldValidate: true });
            }}
            thousandSeparator="."
            decimalSeparator=","
            prefix={discountType === 'fixed' ? 'Rp ' : ''}
            suffix={discountType === 'percentage' ? ' %' : ''}
            allowNegative={false}
            isNumericString
            error={!!errors.discount_value}
            helperText={
              errors.discount_value?.message ||
              (discountType === 'percentage' && 'Nilai dalam persentase (0-100%)') ||
              (discountType === 'fixed' && 'Nilai dalam Rupiah (minimal Rp 1)')
            }
          />

          {/* Min Order Amount */}
          <NumericFormat
            customInput={TextField}
            label="Minimal Pembelian"
            fullWidth
            value={watch('min_order_amount')}
            onValueChange={(values) => {
              const { floatValue } = values;
              setValue('min_order_amount', floatValue || 0, { shouldValidate: true });
            }}
            thousandSeparator="."
            decimalSeparator=","
            prefix="Rp "
            allowNegative={false}
            isNumericString
            error={!!errors.min_order_amount}
            helperText={errors.min_order_amount?.message}
          />

          {/* Max Discount Amount */}
          <NumericFormat
            customInput={TextField}
            label={`Maksimal Diskon ${showMaxDiscountWarning ? '(Wajib)' : ''}`}
            fullWidth
            value={watch('max_discount_amount')}
            onValueChange={(values) => {
              const { floatValue } = values;
              setValue('max_discount_amount', floatValue || '', { shouldValidate: true });
            }}
            thousandSeparator="."
            decimalSeparator=","
            prefix="Rp "
            allowNegative={false}
            isNumericString
            error={!!errors.max_discount_amount}
            helperText={
              errors.max_discount_amount?.message ||
              (showMaxDiscountWarning && 'Wajib diisi untuk diskon persentase di atas 30%')
            }
          />

          <TextField
            label="Tanggal Mulai"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register('start_date')}
            error={!!errors.start_date}
            helperText={errors.start_date?.message}
          />

          <TextField
            label="Tanggal Selesai"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register('end_date')}
            error={!!errors.end_date}
            helperText={errors.end_date?.message}
          />

          <TextField
            label="Batas Penggunaan"
            type="number"
            fullWidth
            {...register('usage_limit')}
            error={!!errors.usage_limit}
            helperText={errors.usage_limit?.message}
          />

          <FormControlLabel
            control={
              <Switch
                checked={isPublic}
                onChange={(e) => setValue('is_public', e.target.checked)}
                color="primary"
              />
            }
            label="Tampilkan untuk publik"
            sx={{ my: 2 }}
          />

          <Button type="submit" variant="contained" color="primary" disabled={mutation.isLoading}>
            Simpan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
