import React, { useCallback, useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
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
import Label from 'src/components/label';
import { useMutationCancel } from 'src/utils/order/useMutationCancel';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'src/routes/hooks';
import { useCheckoutContext } from '../checkout/context';
import { paths } from 'src/routes/paths';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua', color: 'default' },
  { value: 'pending', label: 'Belum Bayar', color: 'warning' },
  { value: 'paid', label: 'Dikemas', color: 'warning' },
  { value: 'shipped', label: 'Dikirim', color: 'info' },
  { value: 'delivered', label: 'Selesai', color: 'success' },
  { value: 'cancellation_requested', label: 'Dibatalkan', color: 'error' },
];

export default function HomeOrder() {
  const router = useRouter();
  const { data, isLoading, error } = useFetchOrder();
  const { onAddToCart } = useCheckoutContext();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const review = useBoolean();
  const [selectedReview, setSelectedReview] = useState(null);
  const [currentTab, setCurrentTab] = useState('all');
  const confirmCancel = useBoolean();
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleClickCancel = (orderId) => {
    setCancelOrderId(orderId);
    confirmCancel.onTrue();
  };

  const { mutate: Cancel } = useMutationCancel({
    onSuccess: () => {
      enqueueSnackbar('Order berhasil dibatalkan', { variant: 'success' });
      queryClient.invalidateQueries(['order']);
      queryClient.invalidateQueries(['order.id']);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const { mutate: Payment, isLoading: Load } = useMutationBuy({
    onSuccess: (res) => {
      enqueueSnackbar('Redirecting to payment...', { variant: 'success' });

      const redirectUrl = res?.redirect_url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        enqueueSnackbar('Redirect URL tidak ditemukan!', { variant: 'error' });
      }
      queryClient.invalidateQueries(['order']);
      queryClient.invalidateQueries(['order.id']);
    },
    onError: (error) => {
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

  const handleCancel = (orderId, reason) => {
    if (!orderId) {
      enqueueSnackbar('Order ID tidak ditemukan!', { variant: 'error' });
      return;
    }

    Cancel({ id: orderId, reason });
  };

  const handleBuyAgain = useCallback(
    (item) => {
      try {
        if (!item || !item.product) {
          enqueueSnackbar('Data produk tidak lengkap', { variant: 'error' });
          return;
        }

        const productData = {
          id: item.products_id, // Use products_id from item
          name: item.product.name,
          cover: item.product.images?.[0]?.image_url,
          price: item.product.discount_price || item.product.price,
          color: item?.color,
          size: item.size,
          quantity: item.quantity,
          subTotal: (item.product.discount_price || item.product.price) * item.quantity,
        };

        onAddToCart(productData);
        enqueueSnackbar('Produk berhasil ditambahkan ke keranjang', { variant: 'success' });
        router.push(paths.product.checkout);
      } catch (error) {
        console.error('Error in handleBuyAgain:', error);
        enqueueSnackbar('Gagal menambahkan ke keranjang', { variant: 'error' });
      }
    },
    [onAddToCart, router, enqueueSnackbar]
  );

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

  const STATUS_MAP = STATUS_OPTIONS.reduce((acc, item) => {
    acc[item.value] = { label: item.label, color: item.color };
    return acc;
  }, {});

  const validStatuses = STATUS_OPTIONS.map((s) => s.value);
  const filteredOrders =
    currentTab === 'all'
      ? data
      : data?.filter(
          (order) => validStatuses.includes(order.status) && order.status === currentTab
        );

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
        {STATUS_OPTIONS.map((tab) => {
          const count =
            tab.value === 'all'
              ? data.length
              : data.filter((order) => order.status === tab.value).length;

          const isActive = tab.value === currentTab;

          return (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={isActive ? 'filled' : 'soft'}
                  color={STATUS_MAP[tab.value]?.color || 'default'}
                >
                  {count}
                </Label>
              }
            />
          );
        })}
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
                        label={STATUS_MAP[order.status]?.label || order.status}
                        color={STATUS_MAP[order.status]?.color || 'default'}
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

                            {/* Batalkan Pesanan button - only show for pending orders */}
                            {order.status === 'pending' && (
                              <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<Iconify icon="eva:close-circle-fill" />}
                                onClick={() => handleClickCancel(order.id)}
                              >
                                Batalkan Pesanan
                              </Button>
                            )}

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
                                disabled={Load}
                              >
                                {Load ? 'Proses...' : 'Bayar Sekarang'}
                              </Button>
                            ) : order.status === 'delivered' ? (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleBuyAgain(item)}
                              >
                                Beli Lagi
                              </Button>
                            ) : (
                              <Button variant="contained" disabled>
                                {STATUS_MAP[order.status]?.label ||
                                  order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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

      <Dialog open={confirmCancel.value} onClose={confirmCancel.onFalse} fullWidth maxWidth="sm">
        <DialogTitle>Alasan Pembatalan</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Masukkan alasan pembatalan"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmCancel.onFalse} color="inherit">
            Batal
          </Button>
          <Button
            onClick={() => {
              if (!cancelReason.trim()) {
                enqueueSnackbar('Alasan pembatalan harus diisi', { variant: 'warning' });
                return;
              }
              handleCancel(cancelOrderId, cancelReason);
              confirmCancel.onFalse();
              setCancelReason('');
            }}
            color="error"
            variant="contained"
          >
            Konfirmasi
          </Button>
        </DialogActions>
      </Dialog>

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
