import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  Stack,
  Link,
} from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useFetchWhislist } from 'src/utils/whishlist';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

export default function HomeWishlist() {
  const { data, isLoading } = useFetchWhislist();
  const wishlist = data?.data || [];

  return (
    <Container maxWidth="lg" sx={{ my: 6 }}>
      <CustomBreadcrumbs
        heading="Wishlist"
        links={[{ name: 'Beranda', href: '/' }, { name: 'Wishlist' }]}
        sx={{ mb: 3 }}
      />

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {wishlist.length > 0 ? (
            wishlist.map((item, index) => {
              const product = item.product;
              const id = product.id;
              const linkTo = paths.product.details(id);

              const imageUrl =
                product?.images?.[0]?.image_url ||
                'https://via.placeholder.com/300x200?text=No+Image';

              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      transition: '0.3s',
                      '&:hover': { boxShadow: 6 },
                    }}
                  >
                    <Image
                      ratio="1/1"
                      height="220"
                      src={imageUrl}
                      alt={product.name}
                      sx={{ objectFit: 'cover', borderRadius: 1.5 }}
                    />
                    <CardContent>
                      <Stack spacing={2.5} sx={{ p: 0 }}>
                        {/* Nama Produk + Rating */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Link
                            component={RouterLink}
                            href={linkTo}
                            color="inherit"
                            variant="subtitle2"
                            noWrap
                          >
                            {product.name}
                          </Link>

                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Iconify icon="mdi:star" width={18} height={18} color="#FFC107" />
                            <Typography variant="caption" color="text.secondary">
                              {product.average_rating || 0}
                            </Typography>
                          </Stack>
                        </Stack>

                        {/* Harga + Terjual */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="text.primary"
                            noWrap
                          >
                            Rp {parseInt(product.price).toLocaleString('id-ID')}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            Terjual {product.sold || 0}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Box width="100%" textAlign="center" mt={5}>
              <Typography variant="h6" color="text.secondary">
                Wishlist kamu masih kosong.
              </Typography>
            </Box>
          )}
        </Grid>
      )}
    </Container>
  );
}
