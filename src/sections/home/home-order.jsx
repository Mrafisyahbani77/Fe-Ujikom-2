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
} from '@mui/material';
import { Link } from 'react-router-dom';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useFetchOrder } from 'src/utils/order';

export default function HomeOrder() {
  const { data, isLoading, error } = useFetchOrder();

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
    <Container maxWidth="md" sx={{ my: 10 }} padding={2}>
      <CustomBreadcrumbs
        heading="Riwayat order"
        links={[
          {
            name: 'Beranda',
            href: '/',
          },
          { name: 'Riwayat order' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {data?.map((order) => {
        const items = JSON.parse(order.items); // items masih JSON string
        const formattedDate = new Date(order.created_at).toLocaleString();

        return (
          <Card key={order.id} sx={{ mb: 3 }}>
            <CardContent>
              {/* Header: Status */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  {formattedDate}
                </Typography>
                <Chip label={order.status.toUpperCase()} color="warning" size="small" />
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Produk */}
              {items.map((item, idx) => (
                <Box key={idx} display="flex" alignItems="center" mb={2}>
                  {/* Thumbnail produk dummy */}
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      backgroundColor: '#f0f0f0',
                      borderRadius: 1,
                      mr: 2,
                    }}
                  />

                  <Box flexGrow={1}>
                    <Typography variant="body1" noWrap>
                      {item.product_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              {/* Total & Aksi */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Total Harga:
                </Typography>
                <Typography variant="h6" color="primary">
                  Rp {parseInt(order.total_price).toLocaleString('id-ID')}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Link to={`/riwayat-order/${order.id}`}>
                  <Button variant="outlined" size="small">
                    Lihat Detail
                  </Button>
                </Link>
                {order.status === 'pending' && (
                  <Button variant="contained" size="small" color="primary">
                    Bayar Sekarang
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
}
