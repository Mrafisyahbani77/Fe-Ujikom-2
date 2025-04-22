import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// _mock
import { _socials } from 'src/_mock';
// components
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { useFetchCategory } from 'src/utils/category';

// ----------------------------------------------------------------------

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Menggunakan hooks langsung tanpa useEffect
  const { data: categoryData } = useFetchCategory();

  // Mengambil hanya beberapa kategori (maksimal 5)
  const categories = categoryData?.slice(0, 5) || [];

  const whatsappNumber = '85697091846';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Divider
        sx={{
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 6px -1px rgba(25, 118, 210, 0.2)',
          borderBottom: 'none',
        }}
      />

      <Container
        sx={{
          pt: 10,
          pb: 5,
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        <Logo />

        <Grid container spacing={4} justifyContent="center">
          <Grid xs={12} md={5}>
            <Typography
              variant=""
              sx={{
                maxWidth: { xs: '100%', md: '90%' },
                mx: 'auto',
                textAlign: 'center',
              }}
            >
              Temukan koleksi sepatu premium kami yang dirancang untuk gaya dan kenyamanan. Kami
              menawarkan sepatu sempurna untuk setiap kesempatan dan gaya hidup.
            </Typography>

            {/* <Stack
              direction="row"
              justifyContent="center"
              sx={{
                mt: 3,
                mb: { xs: 3, md: 3 },
              }}
            >
              {_socials.map((social) => (
                <IconButton
                  key={social.name}
                  sx={{
                    mx: 0.5,
                    '&:hover': {
                      bgcolor: alpha(social.color, 0.08),
                    },
                  }}
                >
                  <Iconify color={social.color} icon={social.icon} />
                </IconButton>
              ))}
            </Stack> */}
          </Grid>

          <Grid xs={12} md={3}>
            <Stack spacing={2} alignItems="center" sx={{ mb: { xs: 4, md: 0 } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Kategori Produk
              </Typography>

              <Stack spacing={1} alignItems="center">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    component={RouterLink}
                    to={`/category/${category.slug}`}
                    color="inherit"
                    variant="body2"
                    sx={{
                      textAlign: 'center',
                      transition: 'all 0.2s',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 'fontWeightMedium',
                      },
                    }}
                  >
                    {category.name}
                  </Link>
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Grid xs={12} md={4}>
            <Stack spacing={2} alignItems="center">
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Hubungi Kami
              </Typography>

              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                  '&:hover': {
                    textDecoration: 'none',
                    opacity: 0.8,
                  },
                }}
              >
                <Iconify icon="ic:baseline-whatsapp" width={24} height={24} sx={{ mr: 1 }} />
                <Typography variant="body2">+62 856-9709-1846</Typography>
              </Link>

              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  maxWidth: '80%',
                }}
              >
                Jalan Bukit Asri, Ciomas
                <br />
                Bogor, Jawa Barat
                <br />
                Indonesia
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 5 }} />

        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          © Barangin {new Date().getFullYear()}. Hak Cipta Dilindungi
        </Typography>
      </Container>
    </Box>
  );
}
