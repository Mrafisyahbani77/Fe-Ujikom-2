import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
} from '@mui/material';
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
    reset,
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
      is_public: false,
    },
    mode: 'onBlur',
  });

  const discountType = watch('discount_type');
  const discountValue = watch('discount_value');
  const isPublic = watch('is_public');

  useEffect(() => {
    if (currentDiscount) {
      // Make sure to fill all form fields with current values
      reset({
        code: currentDiscount.code || '',
        description: currentDiscount.description || '',
        discount_type: currentDiscount.discount_type || '', // This was the problem
        discount_value: Number(currentDiscount.discount_value) || 0,
        min_order_amount: Number(currentDiscount.min_order_amount) || 0,
        max_discount_amount: Number(currentDiscount.max_discount_amount) || 0,
        usage_limit: currentDiscount.usage_limit || 0,
        start_date: currentDiscount.start_date ? currentDiscount.start_date.substring(0, 10) : '',
        end_date: currentDiscount.end_date ? currentDiscount.end_date.substring(0, 10) : '',
        is_public: currentDiscount.is_public !== undefined ? currentDiscount.is_public : false,
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

  // Check if max_discount_amount warning should be shown
  const showMaxDiscountWarning = discountType === 'percentage' && discountValue > 30;

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
            value={discountType} // Explicitly set the value from watch
          >
            <MenuItem value="percentage">Percentage (%)</MenuItem>
            <MenuItem value="fixed">Fixed (Rp)</MenuItem>
          </TextField>

          <NumericFormat
            customInput={TextField}
            label="Nilai Diskon"
            fullWidth
            margin="normal"
            value={watch('discount_value')}
            onValueChange={(values) => {
              const { floatValue } = values;
              setValue('discount_value', floatValue || 0, { shouldValidate: true });
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
            label="Minimal Pesanan"
            fullWidth
            margin="normal"
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
            margin="normal"
            value={watch('max_discount_amount')}
            onValueChange={(values) => {
              const { floatValue } = values;
              setValue('max_discount_amount', floatValue || 0, { shouldValidate: true });
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
            label="Start Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register('start_date')}
            error={!!errors.start_date}
            helperText={errors.start_date?.message}
          />

          <TextField
            label="End Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
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
