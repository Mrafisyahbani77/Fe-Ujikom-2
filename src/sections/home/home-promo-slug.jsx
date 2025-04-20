import { useState } from 'react';
import { useParams } from 'src/routes/hooks';
import { useFetchDiscountBySlug } from 'src/utils/discount';
import { useSnackbar } from 'src/components/snackbar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
  Button,
  Skeleton,
  Chip,
  Paper,
  Grid,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { fCurrency } from 'src/utils/format-number';

export default function HomePromoSlug() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useFetchDiscountBySlug(slug);
  const { enqueueSnackbar } = useSnackbar();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (data && data) {
      navigator.clipboard
        .writeText(data .code)
        .then(() => {
          setCopied(true);
          enqueueSnackbar('Kode promo berhasil disalin!', { variant: 'success' });
          setTimeout(() => setCopied(false), 3000);
        })
        .catch(() => {
          enqueueSnackbar('Gagal menyalin kode promo', { variant: 'error' });
        });
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
  };

  if (isLoading) {
    return (
      <Container>
        <CustomBreadcrumbs
          heading="Detail Promo"
          links={[{ name: 'Beranda', href: '/' }, { name: 'Promo' }]}
          sx={{ mb: 3 }}
        />
        <Card>
          <CardContent>
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
            <Skeleton variant="text" sx={{ mb: 1 }} />
            <Skeleton variant="text" sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="70%" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={120} />
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <Container>
        <CustomBreadcrumbs
          heading="Detail Promo"
          links={[{ name: 'Beranda', href: '/' }, { name: 'Promo' }]}
          sx={{ mb: 3 }}
        />
        <Alert severity="error" sx={{ mb: 3 }}>
          Promo tidak ditemukan atau terjadi kesalahan saat memuat data
        </Alert>
      </Container>
    );
  }

  const promo = data;
  const isExpired = new Date(promo.end_date) < new Date();
  const startDate = formatDate(promo.start_date);
  const endDate = formatDate(promo.end_date);

  return (
    <Container>
      <CustomBreadcrumbs
        heading="Detail Promo"
        links={[
          { name: 'Beranda', href: '/' },
          { name: 'Promo', href: '/promo' },
          { name: promo.code },
        ]}
        sx={{ mb: 3 }}
      />

      <Card sx={{ mb: 4, overflow: 'hidden' }}>
        <Box
          sx={{
            height: 12,
            bgcolor: isExpired ? 'error.main' : 'success.main',
          }}
        />

        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  label={isExpired ? 'Sudah Berakhir' : 'Sedang Berlangsung'}
                  color={isExpired ? 'error' : 'success'}
                  size="small"
                  sx={{ mr: 2 }}
                />
                {promo.status === 1 && !isExpired && (
                  <Chip label={promo.status_text} color="primary" size="small" />
                )}
              </Box>

              <Typography variant="h3" sx={{ mb: 2, color: 'primary.main' }}>
                {promo.discount_type === 'percentage'
                  ? `${promo.discount_value}% OFF`
                  : `${fCurrency(promo.discount_value)} OFF`}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Berlaku: {startDate} - {endDate}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Sisa kuota: {promo.usage_limit - promo.used_count} dari {promo.usage_limit}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Kode Promo
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      letterSpacing: 1,
                      fontFamily: 'monospace',
                      p: 1,
                    }}
                  >
                    {promo.code}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color={copied ? 'success' : 'primary'}
                  startIcon={<Iconify icon={copied ? 'mdi:check' : 'mdi:content-copy'} />}
                  onClick={handleCopyCode}
                  disabled={isExpired}
                  fullWidth
                >
                  {copied ? 'Tersalin' : 'Salin Kode'}
                </Button>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Syarat dan Ketentuan
          </Typography>

          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify
                icon="mdi:currency-usd"
                sx={{ color: 'primary.main', mr: 1, width: 20, height: 20 }}
              />
              <Typography variant="body2">
                Minimum pembelian {fCurrency(promo.min_order_amount)}
              </Typography>
            </Box>

            {promo.max_discount_amount && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify
                  icon="mdi:tag-outline"
                  sx={{ color: 'primary.main', mr: 1, width: 20, height: 20 }}
                />
                <Typography variant="body2">
                  Maksimum diskon {fCurrency(promo.max_discount_amount)}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Iconify
                icon="mdi:information-outline"
                sx={{ color: 'primary.main', mr: 1, width: 20, height: 20, mt: 0.5 }}
              />
              <Typography variant="body2">
                {promo.description || 'Tidak ada deskripsi tambahan.'}
              </Typography>
            </Box>
          </Stack>

          {isExpired && (
            <Alert severity="warning" sx={{ mt: 3 }}>
              Promo ini sudah berakhir pada {endDate}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
