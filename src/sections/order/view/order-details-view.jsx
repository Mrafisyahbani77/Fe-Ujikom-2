import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
//
import OrderDetailsInfo from '../order-details-info';
import OrderDetailsItems from '../order-details-item';
import OrderDetailsToolbar from '../order-details-toolbar';
import OrderDetailsHistory from '../order-details-history';
import { useFetchOrderById } from 'src/utils/order';
import { Box, CircularProgress, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function OrderDetailsView({ id }) {
  const settings = useSettingsContext();

  const { data, isLoading, error } = useFetchOrderById(id);
  console.log(data)

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" marginTop={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return <Typography color="error">Gagal mengambil data: {error?.response?.data?.message}</Typography>;
  }
  const currentOrder = data;
  const [status, setStatus] = useState(currentOrder.status);

  const handleChangeStatus = useCallback((newValue) => {
    setStatus(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <OrderDetailsToolbar
        backLink={paths.dashboard.order.root}
        // orderNumber={currentOrder.orderNumber}
        createdAt={currentOrder.created_at}
        status={status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              items={currentOrder.items}
              // taxes={currentOrder.taxes}
              // shipping={currentOrder.shipping}
              // discount={currentOrder.discount}
              // subTotal={currentOrder.subTotal}
              // totalAmount={currentOrder.totalAmount}
            />

            <OrderDetailsHistory history={currentOrder.history} />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo
            customer={currentOrder.customer}
            delivery={currentOrder.delivery}
            payment={currentOrder.payment}
            shippingAddress={currentOrder.shippingAddress}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

OrderDetailsView.propTypes = {
  id: PropTypes.string,
};
