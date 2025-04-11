import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fDate } from 'src/utils/format-time';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ProductReviewItem({ review }) {
  const {
    name,
    rating,
    comment,
    postedAt,
    avatarUrl,
    attachments,
    isPurchased,
    images,
    created_at,
    user_name,
    user,
  } = review;
  console.log(review);

  const renderInfo = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2, // jarak avatar dan content
        mb: 3, // margin bawah antar review
        pl: { xs: 2, md: 3 }, // ⬅️ tambah padding left (pl = paddingLeft)
      }}
    >
      <Avatar
        src={user.photo_profile}
        sx={{
          width: { xs: 42, md: 45 },
          height: { xs: 42, md: 45 },
        }}
      />
    </Box>
  );

  const renderContent = (
    <Stack spacing={1} flexGrow={1}>
      <ListItemText
        primary={user.name}
        secondary={fDate(created_at)}
        primaryTypographyProps={{
          noWrap: true,
          typography: 'subtitle2',
          mb: 0.5,
        }}
        secondaryTypographyProps={{
          noWrap: true,
          typography: 'caption',
          component: 'span',
        }}
      />
      <Rating size="small" value={rating} precision={0.1} readOnly />

      {isPurchased && (
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            color: 'success.main',
            typography: 'caption',
          }}
        >
          <Iconify icon="ic:round-verified" width={16} sx={{ mr: 0.5 }} />
          Verified purchase
        </Stack>
      )}

      <Typography variant="body2">{review.review}</Typography>

      {!!images?.length && (
        <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ pt: 1 }}>
          {images.map((attachment) => (
            <Box
              component="img"
              key={attachment}
              alt={attachment}
              src={attachment}
              sx={{ width: 64, height: 64, borderRadius: 1.5 }}
            />
          ))}
        </Stack>
      )}

      <Stack direction="row" spacing={2} sx={{ pt: 1.5 }}>
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
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start', // supaya rata atas
        gap: 2, // kecilin jarak, bisa 1.5 atau 2
        mt: 5,
      }}
    >
      {renderInfo}
      {renderContent}
    </Box>
  );
}

ProductReviewItem.propTypes = {
  review: PropTypes.object,
};
