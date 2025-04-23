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
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Buat komponen styled untuk tombol navigasi carousel
const NavigationButton = styled(Button)(({ theme }) => ({
  pointerEvents: 'auto',
  backgroundColor: 'rgba(161, 126, 126, 0.7)',
  minWidth: 'auto',
  borderRadius: '50%',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  position: 'absolute',
  zIndex: 1000,
  padding: 0,
}));

export default function HomeHero() {
  const { data, isLoading } = useFetchBanner();
  const [preventClick, setPreventClick] = useState(false);

  const carousel = useCarousel({
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 300,
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

  // Handler untuk mencegah navigasi ke promo saat mengklik arrow
  const handleArrowClick = (callback) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    callback();

    // Mencegah navigasi selama 100ms setelah mengklik arrow
    setPreventClick(true);
    setTimeout(() => setPreventClick(false), 100);
  };

  // Handler untuk navigasi ke promo
  const handlePromoClick = (event) => {
    if (preventClick) {
      event.preventDefault();
    }
  };

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
        {/* Main carousel with slides */}
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
            {isBannerAvailable ? (
              data.map((item) => (
                <Box key={item.id} sx={{ position: 'relative' }}>
                  <Link
                    to="/promo"
                    onClick={handlePromoClick}
                    style={{
                      textDecoration: 'none',
                      display: 'block',
                      width: '100%',
                      height: '100%',
                    }}
                  >
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
                  </Link>
                </Box>
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
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 'inherit',
                  }}
                />
              </Card>
            )}
          </Carousel>

          {/* Completely separate navigation arrows with medium size */}
          {isBannerAvailable && data.length > 1 && (
            <>
              {/* Left arrow */}
              <NavigationButton
                onClick={handleArrowClick(carousel.onPrev)}
                sx={{
                  left: { xs: '10px', sm: '15px', md: '20px' },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: { xs: 32, sm: 36, md: 40 },
                  height: { xs: 32, sm: 36, md: 40 },
                  fontSize: { xs: 16, sm: 18, md: 20 },
                }}
              >
                <span style={{ marginTop: '-2px' }}>&lt;</span>
              </NavigationButton>

              {/* Right arrow */}
              <NavigationButton
                onClick={handleArrowClick(carousel.onNext)}
                sx={{
                  right: { xs: '10px', sm: '15px', md: '20px' },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: { xs: 32, sm: 36, md: 40 },
                  height: { xs: 32, sm: 36, md: 40 },
                  fontSize: { xs: 16, sm: 18, md: 20 },
                }}
              >
                <span style={{ marginTop: '-2px' }}>&gt;</span>
              </NavigationButton>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}
