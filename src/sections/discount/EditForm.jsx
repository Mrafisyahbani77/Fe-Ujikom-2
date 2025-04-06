import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardContent, MenuItem, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { useMutationUpdate } from 'src/utils/discount';
import { NumericFormat } from 'react-number-format';
import { useQueryClient } from '@tanstack/react-query';

export default function EditForm({ currentDiscount }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

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
    usage_limit: Yup.number()
      .required('Batas penggunaan wajib diisi')
      .min(0, 'Tidak boleh negatif'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      code: '',
      description: '',
      discount_type: '', // <-- ini WAJIB
      discount_value: '',
      min_order_amount: '',
      max_discount_amount: '',
      start_date: '',
      end_date: '',
      usage_limit: '',
    },
  });

  const discountType = watch('discount_type');

  useEffect(() => {
    if (currentDiscount) {
      reset({
        code: currentDiscount.code || '',
        description: currentDiscount.description || '',
        discount_type: currentDiscount.discount_type || '',
        discount_value: Number(currentDiscount.discount_value) || 0,
        min_order_amount: Number(currentDiscount.min_order_amount) || 0,
        max_discount_amount: Number(currentDiscount.max_discount_amount) || 0,
        usage_limit: currentDiscount.usage_limit || 0,
        start_date: currentDiscount.start_date ? currentDiscount.start_date.substring(0, 10) : '',
        end_date: currentDiscount.end_date ? currentDiscount.end_date.substring(0, 10) : '',
      });
    }
  }, [currentDiscount, reset]);

  const { mutate: editDiscount, isLoading } = useMutationUpdate({
    onSuccess: () => {
      enqueueSnackbar('Diskon berhasil diperbarui', { variant: 'success' });
      router.push('/dashboard/discount/list');
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
    editDiscount({ id: currentDiscount.id, data: payload });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Edit Diskon
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Kode Diskon"
            fullWidth
            margin="normal"
            {...register('code')}
            error={!!errors.code}
            helperText={errors.code?.message}
          />

          <TextField
            label="Deskripsi"
            fullWidth
            margin="normal"
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <TextField
            label="Tipe Diskon"
            fullWidth
            select
            margin="normal"
            {...register('discount_type')}
            error={!!errors.discount_type}
            helperText={errors.discount_type?.message}
          >
            <MenuItem value="fixed">Fixed (Rp)</MenuItem>
            <MenuItem value="percentage">Percentage (%)</MenuItem>
          </TextField>

          <NumericFormat
            customInput={TextField}
            label="Nilai Diskon"
            fullWidth
            margin="normal"
            value={watch('discount_value')}
            onValueChange={(values) => {
              const { floatValue } = values;
              setValue('discount_value', floatValue || 0);
            }}
            thousandSeparator="."
            decimalSeparator=","
            prefix={discountType === 'fixed' ? 'Rp ' : ''}
            suffix={discountType === 'percentage' ? ' %' : ''}
            allowNegative={false}
            isNumericString
            error={!!errors.discount_value}
            helperText={errors.discount_value?.message}
          />

          {/* Min Order Amount */}
          <NumericFormat
            customInput={TextField}
            label="Minimal Pesanan"
            fullWidth
            margin="normal"
            value={watch('min_order_amount')}
            onValueChange={(values) => {
              const { floatValue } = values;
              setValue('min_order_amount', floatValue || 0);
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
            label="Maksimal Diskon"
            fullWidth
            margin="normal"
            value={watch('max_discount_amount')}
            onValueChange={(values) => {
              const { floatValue } = values;
              setValue('max_discount_amount', floatValue || 0);
            }}
            thousandSeparator="."
            decimalSeparator=","
            prefix="Rp "
            allowNegative={false}
            isNumericString
            error={!!errors.max_discount_amount}
            helperText={errors.max_discount_amount?.message}
          />

          <TextField
            label="Start Date"
            type="date"
            fullWidth
            margin="normal"
            {...register('start_date')}
            error={!!errors.start_date}
            helperText={errors.start_date?.message}
          />

          <TextField
            label="End Date"
            type="date"
            fullWidth
            margin="normal"
            {...register('end_date')}
            error={!!errors.end_date}
            helperText={errors.end_date?.message}
          />

          <TextField
            label="Batas Penggunaan"
            fullWidth
            margin="normal"
            type="number"
            {...register('usage_limit')}
            error={!!errors.usage_limit}
            helperText={errors.usage_limit?.message}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
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
