import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import Dialog from '@mui/material/Dialog';
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useMutationCreateReview } from 'src/utils/review';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function ProductReviewNewForm({ data, onClose, ...other }) {
  const [images, setImages] = useState([]);

  const ReviewSchema = Yup.object().shape({
    rating: Yup.number()
      .required('Rating is required')
      .min(1, 'Rating must be greater than or equal to 1'),
    review: Yup.string().required('Review is required'),
  });

  const defaultValues = {
    rating: 0,
    review: '',
  };

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutateAsync: createReview } = useMutationCreateReview({
    onSuccess: () => {
      enqueueSnackbar('Review created successfully', {
        variant: 'success',
      });
      queryClient.invalidateQueries(['public.review_id']);
      if (onClose) onClose();
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append('products_id', data); // ← ambil product id dari props
    formData.append('rating', values.rating);
    formData.append('review', values.review);

    images.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await createReview(formData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      enqueueSnackbar('Maksimal 10 gambar yang bisa diupload', { variant: 'warning' });
      return;
    }
    setImages(files);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Tambah Review</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Rating</Typography>
                  <Rating {...field} value={Number(field.value)} />
                  {errors.rating && <FormHelperText error>{errors.rating?.message}</FormHelperText>}
                </Stack>
              )}
            />

            <RHFTextField name="review" label="Review" multiline rows={4} />

            <Stack spacing={1}>
              <Typography variant="subtitle2">Upload Gambar</Typography>
              <input type="file" multiple accept="image/*" onChange={handleDrop} />
              {images.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  {images.length} gambar dipilih
                </Typography>
              )}
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Batal
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Submit
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

ProductReviewNewForm.propTypes = {
  data: PropTypes.object, // ← product data
  onClose: PropTypes.func,
};
