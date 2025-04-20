import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Divider,
  TextField,
  InputAdornment,
  Tooltip,
  Snackbar,
} from '@mui/material';
import Iconify from 'src/components/iconify'; // Using Iconify component
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useFetchAllDiscount } from 'src/utils/discount';
import { fCurrency, fPercent } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';
import { Link } from 'react-router-dom';

export default function HomePromo() {
  const { data, isLoading, isError } = useFetchAllDiscount();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPromos, setFilteredPromos] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    if (data) {
      setFilteredPromos(data);
    }
  }, [data]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (data) {
      const filtered = data.filter(
        (promo) =>
          promo.title?.toLowerCase().includes(value.toLowerCase()) ||
          promo.description?.toLowerCase().includes(value.toLowerCase()) ||
          promo.code?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPromos(filtered);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 3000);
      })
      .catch((err) => {
        console.error('Failed to copy code:', err);
      });
  };

  return (
    <Container maxWidth="lg" sx={{ my: 5 }}>
      <CustomBreadcrumbs
        heading="Daftar Promo"
        links={[{ name: 'Beranda', href: '/' }, { name: 'Promo' }]}
        sx={{ mb: 3 }}
      />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Penawaran dan Promo Spesial
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Temukan berbagai penawaran menarik dan diskon spesial untuk Anda
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Cari promo..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ mt: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" width={24} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider sx={{ mb: 4 }} />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ my: 2 }}>
          Terjadi kesalahan saat memuat data promo. Silakan coba lagi nanti.
        </Alert>
      )}

      {!isLoading && !isError && filteredPromos?.length === 0 && (
        <Alert severity="info" sx={{ my: 2 }}>
          Tidak ada promo yang tersedia saat ini.
        </Alert>
      )}

      <Grid container spacing={3}>
        {filteredPromos &&
          filteredPromos.map((promo, index) => (
            <Grid item xs={12} sm={6} md={4} key={promo.id || index}>
              <Card
                elevation={0}
                variant="outlined"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                {/* <CardMedia
                  component="img"
                  height="200"
                  image={promo.image || `https://source.unsplash.com/random/300x200?promo=${index}`}
                  alt={promo.title}
                /> */}

                <Box sx={{ position: 'relative', mt: 4, mx: 2 }}>
                  <Chip
                    label={
                      promo.discount_type === 'percentage'
                        ? `${promo.discount_value}% OFF`
                        : `${fCurrency(promo.discount_value)} OFF`
                    }
                    color="primary"
                    icon={<Iconify icon="mdi:percent" width={16} />}
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>

                <CardContent
                  component={Link}
                  to={`/promo/${promo.slug}`}
                  sx={{
                    flexGrow: 1,
                    textDecoration: 'none',
                    color: 'inherit', // Atau bisa pakai 'text.primary' sesuai tema
                    '&:hover': {
                      textDecoration: 'none',
                      color: 'primary.main', // Kalau mau ada efek hover, bisa diatur di sini
                    },
                  }}
                >
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {promo.title || `Promo Special ${index + 1}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {promo.description ||
                      'Nikmati penawaran spesial dengan diskon menarik untuk produk pilihan kami.'}
                  </Typography>

                  {promo.price && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        {fCurrency(promo.price)}
                      </Typography>
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                        {fCurrency(
                          promo.discountedPrice || promo.price * (1 - (promo.discount || 10) / 100)
                        )}
                      </Typography>
                    </Box>
                  )}

                  {/* Promo Code Section */}
                  {promo.code && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'background.neutral',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 1,
                        p: 1.5,
                        mb: 2,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleCopyCode(promo.code)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify
                          icon="mdi:ticket-percent-outline"
                          width={20}
                          sx={{ mr: 1, color: 'primary.main' }}
                        />
                        <Typography variant="subtitle2" fontFamily="monospace">
                          {promo.code}
                        </Typography>
                      </Box>
                      <Tooltip title={copiedCode === promo.code ? 'Disalin!' : 'Salin Kode'}>
                        <Box>
                          <Iconify
                            icon={copiedCode === promo.code ? 'mdi:check' : 'mdi:content-copy'}
                            width={20}
                            sx={{
                              color: copiedCode === promo.code ? 'success.main' : 'text.secondary',
                            }}
                          />
                        </Box>
                      </Tooltip>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Iconify
                      icon="mdi:clock-outline"
                      width={20}
                      sx={{ mr: 1, color: 'text.disabled' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Berakhir pada: {promo.endDate ? fDate(promo.endDate) : fDate(new Date())}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  {/* <Box>
                    <Tooltip title="Simpan">
                      <Button size="small" color="primary" sx={{ minWidth: 'auto', p: 0.5 }}>
                        <Iconify icon="mdi:heart-outline" width={20} />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Bagikan">
                      <Button size="small" color="primary" sx={{ minWidth: 'auto', p: 0.5, ml: 1 }}>
                        <Iconify icon="mdi:share-variant-outline" width={20} />
                      </Button>
                    </Tooltip>
                  </Box> */}
                  {/* <Button
                    variant="outlined"
                    color="primary"
                    href={promo.link || '#'}
                    startIcon={<Iconify icon="mdi:tag-outline" width={20} />}
                  >
                    Gunakan Promo
                  </Button> */}
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Snackbar notification for copied code */}
      <Snackbar
        open={copiedCode !== null}
        autoHideDuration={2000}
        onClose={() => setCopiedCode(null)}
        message="Kode promo berhasil disalin!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
}
