import { m } from 'framer-motion';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// import EcommerceNewProducts from './EcommerceNewProducts'; // Import komponen
import { _ecommerceNewProducts } from 'src/_mock';
import EcommerceNewProducts from '../overview/e-commerce/ecommerce-new-products';
import { useRef, useState } from 'react';
import { useResponsive } from 'src/hooks/use-responsive';
import { bgBlur } from 'src/theme/css';
import { MotionContainer } from 'src/components/animate';

const StyledRoot = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100vh',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/assets/background/overlay_3.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const StyledTextGradient = styled(m.h1)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '3rem',
  textAlign: 'center',
  fontWeight: 'bold',
}));

const StyledPolygon = styled('div')(({ opacity = 1, anchor = 'left', theme }) => ({
  ...bgBlur({
    opacity,
    color: theme.palette.background.default,
  }),
  zIndex: 9,
  bottom: 0,
  height: 80,
  width: '50%',
  position: 'absolute',
  clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
  ...(anchor === 'left' && {
    left: 0,
    ...(theme.direction === 'rtl' && {
      transform: 'scale(-1, 1)',
    }),
  }),
  ...(anchor === 'right' && {
    right: 0,
    transform: 'scaleX(-1)',
    ...(theme.direction === 'rtl' && {
      transform: 'scaleX(1)',
    }),
  }),
}));

const productList = [
  { id: 1, coverUrl: '/assets/images/products/product_1.jpg', name: 'Sepatu Sport' },
  { id: 2, coverUrl: '/assets/images/products/product_2.jpg', name: 'Sepatu Casual' },
  { id: 3, coverUrl: '/assets/images/products/product_3.jpg', name: 'Sepatu Formal' },
];

export default function HomeHero() {
  const theme = useTheme();
  const [percent, setPercent] = useState(0);
  const opacity = 1 - percent / 100;
  const mdUp = useResponsive('up', 'md');
  const heroRef = useRef(null);
  const hide = percent > 120;

  const renderPolygons = (
    <>
      <StyledPolygon />
      <StyledPolygon anchor="right" opacity={0.48} />
      <StyledPolygon anchor="right" opacity={0.48} sx={{ height: 48, zIndex: 10 }} />
      <StyledPolygon anchor="right" sx={{ zIndex: 11, height: 24 }} />
    </>
  );

  return (
    <>
      <StyledRoot
        ref={heroRef}
        sx={{
          ...(hide && {
            opacity: 0,
          }),
        }}
      >
        <Container component={MotionContainer} sx={{ height: 1 }}>
          <StyledTextGradient>Barangin Ecommerce</StyledTextGradient>
          <Typography variant="h6" sx={{ textAlign: 'center', color: 'white' }}>
            Sepatu berkualitas dengan harga terbaik
          </Typography>
          <Box sx={{ mt: 4 }}>
            <EcommerceNewProducts list={_ecommerceNewProducts} />
          </Box>
        </Container>
      </StyledRoot>
      {mdUp && renderPolygons}

      <Box sx={{ height: { md: '100vh' } }} />
    </>
  );
}
