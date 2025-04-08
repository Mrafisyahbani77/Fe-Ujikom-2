import { useScroll } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
// components
import ScrollProgress from 'src/components/scroll-progress';
//
import HomeHero from '../home-hero';
import HomeMinimal from '../home-minimal';
import HomeAdvertisement from '../home-advertisement';
import { ProductShopView } from 'src/sections/product/view';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const StyledPolygon = styled('div')(({ anchor = 'top', theme }) => ({
  left: 0,
  zIndex: 9,
  height: 80,
  width: '100%',
  position: 'absolute',
  clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
  backgroundColor: theme.palette.background.default,
  display: 'block',
  lineHeight: 0,
  ...(anchor === 'top' && {
    top: -1,
    transform: 'scale(-1, -1)',
  }),
  ...(anchor === 'bottom' && {
    bottom: -1,
    backgroundColor: theme.palette.grey[900],
  }),
}));

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('showLoginSuccess', 'true');

      // Hapus token dari URL agar lebih bersih
      navigate('/', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    // Cek apakah perlu menampilkan notifikasi login berhasil
    if (localStorage.getItem('showLoginSuccess')) {
      enqueueSnackbar('Login Berhasil!', { variant: 'success' });

      // Hapus flag agar tidak muncul lagi di refresh berikutnya
      localStorage.removeItem('showLoginSuccess');
    }
  }, [enqueueSnackbar]);

  return (
    <>
      {/* <ScrollProgress scrollYProgress={scrollYProgress} /> */}
      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
          mt: 20,
          mb:2,
        }}
      >
        <HomeHero />
      </Box>

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'grey.50',
          // mt: 20,
        }}
      >
        <HomeMinimal />
        <ProductShopView />
        {/* <HomeAdvertisement /> */}
      </Box>
      {/* <Box sx={{ mt: 10 }}>
        <ProductListPage />
      </Box> */}
    </>
  );
}
