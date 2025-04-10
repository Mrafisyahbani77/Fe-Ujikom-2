import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Button,
  Box,
  Divider,
  Container,
  Avatar,
  Stack,
} from '@mui/material';
import { Link } from 'react-router-dom';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useFetchOrder } from 'src/utils/order';
import ProductReviewNewForm from '../product/product-review-new-form';
import { useBoolean } from 'src/hooks/use-boolean';
import { HOST_API } from 'src/config-global';

export default function HomeOrder() {
  const { data, isLoading, error } = useFetchOrder();
  const review = useBoolean();
  console.log(data);

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

  return (
    <Container maxWidth="md" sx={{ my: 10 }}>
      <CustomBreadcrumbs
        heading="Riwayat Order"
        links={[{ name: 'Beranda', href: '/' }, { name: 'Riwayat Order' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {data?.map((order) => {
        const items = order.items || [];
        const formattedDate = new Date(order.created_at).toLocaleDateString('id-ID');

        return (
          <Card key={order.id} sx={{ mb: 3 }}>
            <CardContent>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {/* {order.store_name || 'Nama Toko'} */}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Chip
                    label={order.status === 'completed' ? 'SELESAI' : order.status.toUpperCase()}
                    color={order.status === 'completed' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Product List */}
              {items.map((item) => (
                <Grid container spacing={2} alignItems="center" key={item.id} sx={{ mb: 2 }}>
                  <Grid item>
                    <Avatar
                      variant="square"
                      src={
                        item.product.images?.[0]?.image
                          ? `${HOST_API}${item.product.images[0].image}`
                          : ''
                      }
                      sx={{ width: 64, height: 64 }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle2" noWrap>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {/* {item.description || 'Deskripsi produk'} */}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      x{item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" fontWeight="bold">
                      Rp {parseInt(item.product.price).toLocaleString('id-ID')}
                    </Typography>
                  </Grid>
                  <ProductReviewNewForm
                    userId={order.users_id}
                    data={item.products_id}
                    open={review.value}
                    onClose={review.onFalse}
                  />
                </Grid>
              ))}

              <Divider sx={{ my: 2 }} />

              {/* Footer */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">
                  Total Pesanan:
                  <Box component="span" fontWeight="bold" ml={1}>
                    Rp {parseInt(order.total_price).toLocaleString('id-ID')}
                  </Box>
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                <Button component={Link} to={`/riwayat-order/${order.id}`} variant="outlined">
                  Lihat detail
                </Button>
                <Button variant="outlined" size="small" onClick={review.onTrue} color="error">
                  Nilai
                </Button>
                <Button variant="outlined" size="small">
                  Beli Lagi
                </Button>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
}
