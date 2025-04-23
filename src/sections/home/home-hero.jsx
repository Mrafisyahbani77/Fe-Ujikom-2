import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { MotionContainer } from 'src/components/animate';
import Button from '@mui/material/Button';
import Image from 'src/components/image';
import Carousel, { useCarousel, CarouselArrows } from 'src/components/carousel';
import { useFetchBanner } from 'src/utils/banner/public/useFetchBanner';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HomeHero() {
  const { data, isLoading } = useFetchBanner();

  const carousel = useCarousel({
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 500,
    infinite: true,
    pauseOnHover: true,
    draggable: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    fade: true,
    arrows: false,
  });

  // Reset carousel when data changes to prevent issues
  useEffect(() => {
    if (data && data.length > 0 && carousel.carouselRef.current) {
      carousel.carouselRef.current.slickGoTo(0);
    }
  }, [data]);

  if (isLoading) {
    return (
      <Container
        sx={{
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: { xs: '30vh', md: '50vh' },
        }}
      >
        <Typography>Loading banner...</Typography>
      </Container>
    );
  }

  const isBannerAvailable = data && data.length > 0;

  return (
    <Container
      sx={{
        width: '100vw',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        px: { xs: 1, sm: 2, md: 3 }, // Responsive padding
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: { xs: '30vh', md: '50vh' },
          maxWidth: '1800px',
          position: 'relative',
        }}
      >
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {isBannerAvailable ? (
            data.map((item) => (
              <Card
                component={Link}
                to="/promo"
                key={item.id}
                sx={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                  borderRadius: 1,
                  boxShadow: 10,
                }}
              >
                <Image
                  alt={item.title}
                  src={item.image_url}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 'inherit',
                  }}
                />
              </Card>
            ))
          ) : (
            <Card
              sx={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
                borderRadius: 1,
                boxShadow: 10,
              }}
            >
              <Image
                alt="Default Banner"
                src="https://picsum.photos/1840/600"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
              />
            </Card>
          )}
        </Carousel>

        {/* Only show arrows if we have multiple items */}
        {isBannerAvailable && data.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none', // This allows clicks to pass through to the carousel
            }}
          >
            <CarouselArrows
              onNext={carousel.onNext}
              onPrev={carousel.onPrev}
              sx={{
                position: 'relative',
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 9,
                '& .arrow': {
                  pointerEvents: 'auto', // Re-enable pointer events for the arrows
                  backgroundColor: 'rgba(161, 126, 126, 0.7)',
                  width: { xs: 40, sm: 50, md: 70 }, // Responsive width
                  height: { xs: 30, sm: 40, md: 48 }, // Responsive height
                  borderRadius: '50%',
                  color: 'white',
                  fontSize: { xs: 20, sm: 24, md: 28 }, // Responsive font size
                  mx: { xs: 1, sm: 2, md: 3 }, // Responsive margin
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.9)',
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}
