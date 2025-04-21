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
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
// iconify
import { Icon } from '@iconify/react';
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useMutationCreateReview } from 'src/utils/review';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/webm', 'video/ogg'];
const MAX_IMAGE_COUNT = 5;
const MAX_VIDEO_COUNT = 2;

export default function ProductReviewNewForm({ userId, data, onClose, ...other }) {
  const [mediaFiles, setMediaFiles] = useState({
    images: [],
    videos: [],
  });
  const [activeTab, setActiveTab] = useState('images');
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  console.log('data id ProductReviewNewForm', data);
  console.log('userid', userId);

  const ReviewSchema = Yup.object().shape({
    rating: Yup.number().required('Rating wajib diisi').min(1, 'Rating minimal 1 bintang'),
    review: Yup.string()
      .required('Review wajib diisi')
      .min(10, 'Review minimal 10 karakter')
      .max(500, 'Review maksimal 500 karakter'),
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
    formState: { isSubmitting, errors },
  } = methods;

  const { mutateAsync: createReview } = useMutationCreateReview({
    onSuccess: () => {
      enqueueSnackbar('Review berhasil ditambahkan', {
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
    formData.append('products_id', data);
    formData.append('rating', values.rating);
    formData.append('review', values.review);

    mediaFiles.images.forEach((file) => {
      formData.append('media', file);
    });

    mediaFiles.videos.forEach((file) => {
      formData.append('media', file);
    });

    try {
      await createReview(formData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = (type) => (e) => {
    const files = Array.from(e.target.files);
    const maxCount = type === 'images' ? MAX_IMAGE_COUNT : MAX_VIDEO_COUNT;
    const supportedFormats = type === 'images' ? SUPPORTED_IMAGE_FORMATS : SUPPORTED_VIDEO_FORMATS;

    // Validasi jumlah file
    if (files.length + mediaFiles[type].length > maxCount) {
      enqueueSnackbar(
        `Maksimal ${maxCount} ${type === 'images' ? 'gambar' : 'video'} yang bisa diupload`,
        { variant: 'warning' }
      );
      return;
    }

    // Validasi format dan ukuran
    const validFiles = files.filter((file) => {
      if (!supportedFormats.includes(file.type)) {
        enqueueSnackbar(
          `Format file tidak didukung: ${file.name}. Gunakan format ${supportedFormats
            .map((f) => f.split('/')[1])
            .join(', ')}`,
          { variant: 'error' }
        );
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        enqueueSnackbar(`File terlalu besar: ${file.name}. Maksimal 10MB`, { variant: 'error' });
        return false;
      }

      return true;
    });

    setMediaFiles((prev) => ({
      ...prev,
      [type]: [...prev[type], ...validFiles],
    }));
  };

  const removeFile = (type, index) => {
    setMediaFiles((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const renderFilePreview = (file, index, type) => {
    const isImage = type === 'images';

    return (
      <Box
        key={index}
        sx={{
          position: 'relative',
          width: isImage ? 100 : 150,
          height: isImage ? 100 : 100,
          m: 1,
          borderRadius: 1,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {isImage ? (
          <img
            src={URL.createObjectURL(file)}
            alt={`preview-${index}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              p: 1,
            }}
          >
            <Icon icon="material-symbols:video-file" width={40} height={40} color="#2196f3" />
            <Typography variant="caption" noWrap>
              {file.name}
            </Typography>
          </Box>
        )}

        <Box
          onClick={() => removeFile(type, index)}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            bgcolor: 'rgba(0,0,0,0.5)',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.7)',
            },
          }}
        >
          <Icon icon="eva:close-fill" width={16} height={16} color="#fff" />
        </Box>
      </Box>
    );
  };

  return (
    <Dialog fullWidth maxWidth="md" open {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h5" component="div">
            <Icon
              icon="mdi:comment-edit-outline"
              style={{ verticalAlign: 'middle', marginRight: 8 }}
            />
            Tambah Review Produk
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <Stack spacing={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      <Icon
                        icon="ic:baseline-star-rate"
                        style={{ verticalAlign: 'middle', marginRight: 4 }}
                      />
                      Rating Produk
                    </Typography>
                    <Rating
                      {...field}
                      value={Number(field.value)}
                      size="large"
                      sx={{ color: '#FFB400' }}
                    />
                    {errors.rating && (
                      <FormHelperText error sx={{ ml: 0 }}>
                        {errors.rating?.message}
                      </FormHelperText>
                    )}
                  </Stack>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                <Icon
                  icon="mdi:comment-text-outline"
                  style={{ verticalAlign: 'middle', marginRight: 4 }}
                />
                Komentar Anda
              </Typography>
              <RHFTextField
                name="review"
                placeholder="Bagikan pengalaman Anda dengan produk ini..."
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  <Icon
                    icon="mdi:file-upload-outline"
                    style={{ verticalAlign: 'middle', marginRight: 4 }}
                  />
                  Media Pendukung
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tambahkan foto atau video untuk mendukung review Anda
                </Typography>
              </Box>

              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Icon icon="mdi:image-outline" style={{ marginRight: 4 }} />
                      Foto ({mediaFiles.images.length}/{MAX_IMAGE_COUNT})
                    </Box>
                  }
                  value="images"
                />
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Icon icon="mdi:video-outline" style={{ marginRight: 4 }} />
                      Video ({mediaFiles.videos.length}/{MAX_VIDEO_COUNT})
                    </Box>
                  }
                  value="videos"
                />
              </Tabs>

              {activeTab === 'images' && (
                <Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
                    {mediaFiles.images.map((file, index) =>
                      renderFilePreview(file, index, 'images')
                    )}

                    {mediaFiles.images.length < MAX_IMAGE_COUNT && (
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px dashed',
                          borderColor: 'primary.main',
                          borderRadius: 1,
                          m: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                        component="label"
                      >
                        <input
                          type="file"
                          multiple
                          accept={SUPPORTED_IMAGE_FORMATS.join(',')}
                          onChange={handleFileUpload('images')}
                          style={{ display: 'none' }}
                        />
                        <Stack alignItems="center" spacing={0.5}>
                          <Icon
                            icon="ic:baseline-add-photo-alternate"
                            width={24}
                            height={24}
                            color="#2196f3"
                          />
                          <Typography variant="caption" color="text.secondary">
                            Tambah Foto
                          </Typography>
                        </Stack>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Format yang didukung: JPG, PNG, GIF (Maks. 10MB)
                  </Typography>
                </Box>
              )}

              {activeTab === 'videos' && (
                <Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
                    {mediaFiles.videos.map((file, index) =>
                      renderFilePreview(file, index, 'videos')
                    )}

                    {mediaFiles.videos.length < MAX_VIDEO_COUNT && (
                      <Box
                        sx={{
                          width: 150,
                          height: 100,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px dashed',
                          borderColor: 'primary.main',
                          borderRadius: 1,
                          m: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                        component="label"
                      >
                        <input
                          type="file"
                          multiple
                          accept={SUPPORTED_VIDEO_FORMATS.join(',')}
                          onChange={handleFileUpload('videos')}
                          style={{ display: 'none' }}
                        />
                        <Stack alignItems="center" spacing={0.5}>
                          <Icon icon="mdi:video-plus" width={24} height={24} color="#2196f3" />
                          <Typography variant="caption" color="text.secondary">
                            Tambah Video
                          </Typography>
                        </Stack>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Format yang didukung: MP4, WebM, OGG (Maks. 10MB)
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="outlined" onClick={onClose} startIcon={<Icon icon="mdi:close" />}>
            Batal
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            startIcon={<Icon icon="mdi:send" />}
            sx={{ ml: 1 }}
          >
            Kirim Review
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

ProductReviewNewForm.propTypes = {
  userId: PropTypes.any,
  data: PropTypes.any,
  onClose: PropTypes.func,
};
