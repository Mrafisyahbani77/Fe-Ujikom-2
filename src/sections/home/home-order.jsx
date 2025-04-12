import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Divider,
  Container,
  Avatar,
  Stack,
  CircularProgress,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useFetchOrder } from 'src/utils/order';
import ProductReviewNewForm from '../product/product-review-new-form';
import { useBoolean } from 'src/hooks/use-boolean';
import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { useMutationBuy } from 'src/utils/payment';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'notistack';

// Define order status options for tabs
const STATUS_OPTIONS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function HomeOrder() {
  const { data, isLoading, error } = useFetchOrder();
  const { enqueueSnackbar } = useSnackbar();
  const review = useBoolean();
  const [selectedReview, setSelectedReview] = useState(null);
  const [currentTab, setCurrentTab] = useState('all');

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const { mutate: Payment, isLoading: Load } = useMutationBuy({
    onSuccess: (res) => {
      // console.log('Payment success', res);
      enqueueSnackbar('Redirecting to payment...', { variant: 'success' });

      const redirectUrl = res?.redirect_url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        enqueueSnackbar('Redirect URL tidak ditemukan!', { variant: 'error' });
      }
    },
    onError: (error) => {
      // console.log('Payment error', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const handlePayment = (orderId) => {
    if (!orderId) {
      enqueueSnackbar('Order ID tidak ditemukan!', { variant: 'error' });
      return;
    }
    console.log(orderId);

    Payment({ order_id: orderId });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" marginTop={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Gagal mengambil data: {error.message}</Typography>;
  }

  const filteredOrders =
    currentTab === 'all' ? data : data?.filter((order) => order.status === currentTab);

  return (
    <Container maxWidth="lg" sx={{ my: 10 }}>
      <CustomBreadcrumbs
        heading="Riwayat Order"
        links={[{ name: 'Beranda', href: '/' }, { name: 'Riwayat Order' }]}
        sx={{ mb: 3 }}
      />

      {/* Status Tabs */}
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{ mb: 5 }}
        scrollButtons="auto"
        variant="scrollable"
      >
        {STATUS_OPTIONS.map((tab) => (
          <Tab
            key={tab}
            value={tab}
            label={tab === 'all' ? 'Semua' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Tabs>

      <Grid container spacing={3}>
        {filteredOrders?.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h6">Tidak ada riwayat order</Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredOrders?.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h6">Order #{order.id}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {fDateTime(order.created_at)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        color={
                          order.status === 'delivered'
                            ? 'success'
                            : order.status === 'cancelled'
                            ? 'error'
                            : order.status === 'shipped'
                            ? 'info'
                            : 'warning'
                        }
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="subtitle2">
                        Total: {fCurrency(order.total_price)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Loop item di dalam order */}
                  {order.items.map((item, itemIndex) => (
                    <Box key={item.id} sx={{ mb: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={8}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              variant="square"
                              src={item?.product?.images?.[0]?.image_url}
                              sx={{ width: 64, height: 64 }}
                            />
                            <Box>
                              <Typography variant="subtitle1">{item.product?.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Size: {item.size} | Color: {item.color}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Jumlah: x{item.quantity}
                              </Typography>

                              {/* Price display with discount handling */}
                              <Box sx={{ mt: 1 }}>
                                {item.product?.discount_price ? (
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        textDecoration: 'line-through',
                                        color: 'text.secondary',
                                      }}
                                    >
                                      {fCurrency(item.product.price)}
                                    </Typography>
                                    <Typography variant="subtitle2" color="error">
                                      {fCurrency(item.product.discount_price)}
                                    </Typography>
                                  </Stack>
                                ) : (
                                  <Typography variant="subtitle2">
                                    {fCurrency(item.product?.price)}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1,
                              justifyContent: 'flex-end',
                              height: '100%',
                            }}
                          >
                            <Button
                              component={Link}
                              to={`/riwayat-order/${order.id}`}
                              variant="outlined"
                              fullWidth
                            >
                              Lihat Detail
                            </Button>

                            {order.status === 'delivered' ? (
                              <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => {
                                  setSelectedReview({
                                    userId: order.users_id,
                                    productId: item.products_id,
                                  });
                                  review.onTrue();
                                }}
                              >
                                Beri Nilai
                              </Button>
                            ) : (
                              <Button variant="outlined" color="primary" disabled fullWidth>
                                Beri Nilai (Menunggu Pengiriman)
                              </Button>
                            )}

                            {order.status === 'pending' ? (
                              <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<Iconify icon="eva:credit-card-fill" />}
                                onClick={() => handlePayment(order.id)}
                                disabled={isLoading} // disable saat loading
                              >
                                {isLoading ? 'Proses...' : 'Bayar Sekarang'}
                              </Button>
                            ) : order.status === 'delivered' ? (
                              <Button
                                variant="outlined"
                                color="primary"
                                component={Link}
                                to={`/product/${order.productId}`}
                              >
                                Beli Lagi
                              </Button>
                            ) : (
                              <Button variant="contained" disabled>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      </Grid>

                      {itemIndex < order.items.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  ))}

                  {/* Shipping information */}
                  {order.shipping && (
                    <Box sx={{ mt: 2, bgcolor: 'background.neutral', p: 2, borderRadius: 1 }}>
                      <Typography variant="subtitle2">Informasi Pengiriman:</Typography>
                      <Typography variant="body2">
                        Penerima: {order.shipping.recipient_name} ({order.shipping.phone_number})
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Alamat: {order.shipping.address}, {order.shipping.postal_code}
                        {order.shipping.notes && ` - ${order.shipping.notes}`}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Pop up Form Review */}
      {selectedReview && (
        <ProductReviewNewForm
          userId={selectedReview.userId}
          data={selectedReview.productId}
          open={review.value}
          onClose={() => {
            review.onFalse();
            setSelectedReview(null);
          }}
        />
      )}
    </Container>
  );
}
