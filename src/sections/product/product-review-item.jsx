import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// utils
import { fDate } from 'src/utils/format-time';
// components
import Iconify from 'src/components/iconify';
import Lightbox from 'src/components/lightbox';
import useLightBox from 'src/components/lightbox/use-light-box';

// ----------------------------------------------------------------------

export default function ProductReviewItem({ review }) {
  const { rating, created_at, user, media } = review;

  const slides =
    media?.map((item) => {
      if (item.type === 'video') {
        return {
          type: 'video',
          width: 1280,
          height: 720,
          poster: item.url,
          sources: [
            {
              src: item.url,
              type: 'video/mp4',
            },
          ],
        };
      }

      return {
        src: item.url,
      };
    }) || [];

  const lightbox = useLightBox(slides);

  const renderInfo = (
    <Avatar
      src={user.photo_profile}
      sx={{
        width: { xs: 40, md: 40 },
        height: { xs: 40, md: 40 },
      }}
    />
  );

  const renderMediaThumbnails = (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        mt: 1.5,
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      {media?.map((item, index) => {
        if (item.type === 'video') {
          return (
            <Box
              key={`${item.url}-${index}`}
              sx={{
                position: 'relative',
                width: 80,
                height: 80,
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => lightbox.onOpen(index)}
            >
              <Box
                component="video"
                src={item.url}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.3)',
                }}
              >
                <Iconify icon="eva:play-fill" sx={{ color: 'white', width: 30, height: 30 }} />
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.6)',
                    px: 0.5,
                    borderRadius: 0.5,
                  }}
                >
                  0:26
                </Typography>
              </Box>
            </Box>
          );
        }

        return (
          <Box
            component="img"
            key={`${item.url}-${index}`}
            src={item.url}
            onClick={() => lightbox.onOpen(index)}
            sx={{
              width: 80,
              height: 80,
              borderRadius: 1,
              objectFit: 'cover',
              cursor: 'pointer',
            }}
          />
        );
      })}
    </Stack>
  );

  const renderContent = (
    <Stack sx={{ flex: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          {renderInfo}
          <Box>
            <Typography variant="subtitle2" noWrap>
              {user.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {fDate(created_at)}
            </Typography>
            <Typography variant="subtitle2" noWrap>
              <Rating size="small" value={rating} precision={0.5} readOnly />
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Typography variant="body2" sx={{ mt: 1.5 }}>
        {review.review}
      </Typography>

      {!!media?.length && renderMediaThumbnails}

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Stack direction="row" alignItems="center" sx={{ typography: 'caption' }}>
          <Iconify icon="solar:like-outline" width={16} sx={{ mr: 0.5 }} />
          123
        </Stack>

        <Stack direction="row" alignItems="center" sx={{ typography: 'caption' }}>
          <Iconify icon="solar:dislike-outline" width={16} sx={{ mr: 0.5 }} />
          34
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <>
      <Stack
        spacing={2}
        sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}
      >
        {renderContent}
      </Stack>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        onGetCurrentIndex={(index) => lightbox.setSelected(index)}
      />
    </>
  );
}

ProductReviewItem.propTypes = {
  review: PropTypes.object,
};
