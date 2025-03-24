import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { alpha } from '@mui/material/styles';
import { Box, Card, Container, Grid, Typography, Button, Chip, Stack } from '@mui/material';
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import { useFetchDiscountById } from 'src/utils/discount';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { LoadingScreen } from 'src/components/loading-screen';
import { fDate } from 'src/utils/format-time';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function DiscountDetailsView({ id }) {
  const { data: discount, isLoading, isError } = useFetchDiscountById(id);
  const settings = useSettingsContext();

  const renderSkeleton = <LoadingScreen />;

  const renderError = (
    <EmptyContent
      filled
      title={isError?.message || 'Something went wrong'}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.discount.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to Discounts
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderDiscount = discount && (
    <Card sx={{ p: 4, boxShadow: 4, borderRadius: 3, backgroundColor: 'background.paper' }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Chip label={discount.code} color="primary" sx={{ fontSize: '1rem', fontWeight: 'bold' }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {discount.description}
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Typography display="flex" variant="body1">
              <Iconify sx={{ mr: 1 }} icon="mdi:tag" /> <strong>Tipe Diskon:</strong>{' '}
              {discount.discount_type}
            </Typography>
            <Typography display="flex" variant="body1">
              <Iconify display="flex" sx={{ mr: 1 }} icon="mdi:percent" />{' '}
              <strong>Discount Value:</strong> {discount.discount_value}%
            </Typography>
            <Typography display="flex" variant="body1">
              <Iconify sx={{ mr: 1 }} icon="mdi:currency-usd" /> <strong>Min Order:</strong> $
              {discount.min_order_amount}
            </Typography>
            <Typography display="flex" variant="body1">
              <Iconify sx={{ mr: 1 }} icon="mdi:cash-multiple" /> <strong>Max Diskon:</strong> $
              {discount.max_discount_amount}
            </Typography>
            <Typography display="flex" variant="body1">
              <Iconify sx={{ mr: 1 }} icon="mdi:repeat" /> <strong>Batas Penggunaan:</strong>{' '}
              {discount.usage_limit}
            </Typography>
            <Typography display="flex" variant="body1">
              <Iconify sx={{ mr: 1 }} icon="mdi:check-circle" /> <strong>Digunakan:</strong>
              {discount.used_count}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Typography display="flex" variant="body1">
              <Iconify sx={{ mr: 1 }} icon="mdi:calendar-start" /> <strong>Massa Berlaku:</strong>
              {fDate(discount.start_date)} -{fDate(discount.end_date)}
            </Typography>

            <Typography variant="body1" sx={{ mt: 2 }}>
              <Iconify icon="mdi:status" /> <strong>Status:</strong>
              <Chip
                label={discount.status === 1 ? 'Active' : 'Inactive'}
                color={discount.status === 1 ? 'success' : 'error'}
                sx={{ ml: 1 }}
              />
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mt: 4 }}>
      <CustomBreadcrumbs
        heading="Detail Diskon"
        links={[
          { name: 'Daftar diskon', href: paths.dashboard.discount.list },
          { name: 'Detail diskon' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {isLoading && renderSkeleton}
      {isError && renderError}
      {discount && renderDiscount}
    </Container>
  );
}

DiscountDetailsView.propTypes = {
  id: PropTypes.string.isRequired,
};
