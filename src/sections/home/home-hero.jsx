import { styled, useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useResponsive } from 'src/hooks/use-responsive';
import { MotionContainer } from 'src/components/animate';
import Button from '@mui/material/Button';
import Image from 'src/components/image';
import Carousel, { useCarousel } from 'src/components/carousel';
import { _ecommerceNewProducts } from 'src/_mock';
import { useFetchBanner } from 'src/utils/banner';

const StyledRoot = styled('div')(() => ({
  width: '100vw',
  minHeight: '100vh',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}));

const StyledOverlay = styled('div')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7))`,
  zIndex: 0,
}));

export default function HomeHero() {
  // const { data, isLoading, isError } = useFetchBanner();
  // console.log(data)
  return (
    <StyledRoot>
      <BackgroundCarousel list={_ecommerceNewProducts} />

      <StyledOverlay />

      <Container
        component={MotionContainer}
        sx={{ zIndex: 1, textAlign: 'center', color: 'white' }}
      >
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Welcome to Our Store
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: '600px', mx: 'auto', opacity: 0.8 }}>
          Temukan produk terbaik dengan kualitas terbaik hanya di toko kami.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 3 }}>
          Shop Now
        </Button>
      </Container>
    </StyledRoot>
  );
}

function BackgroundCarousel({ list }) {
  const carousel = useCarousel({
    speed: 1000,
    autoplay: true,
    loop: true,
  });

  return (
    <Box sx={{ position: 'absolute', width: '100vw', height: '100vh', zIndex: -1 }}>
      <Carousel {...carousel.carouselSettings}>
        {list.map((item) => (
          <CarouselItem key={item.id} item={item} />
        ))}
      </Carousel>
    </Box>
  );
}

function CarouselItem({ item }) {
  return (
    <Box sx={{ width: '100vw', height: '100vh' }}>
      <Image
        alt={item.name}
        src={item.coverUrl}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>
  );
}
