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

// const StyledRoot = styled('div')(() => ({
//   width: '100vw',
//   minHeight: '100vh',
//   position: 'relative',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   overflow: 'hidden',
// }));

export default function HomeHero() {
  const { data, isLoading } = useFetchBanner();

  const carousel = useCarousel({
    autoplay: true,
    speed: 500,
    loop: true,
    draggable: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    fade: true,
    arrows: false,
  });

  if (isLoading) return null;

  return (
    <Container
      sx={{
        width: '100vw',
        // minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '100%', lg: '100%' },
          height: { xs: '30vh', md: '50vh' },
          maxWidth: '1800px',
          position: 'relative',
        }}
      >
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {data?.map((item) => (
            <Card
              key={item.id}
              sx={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
                borderRadius: 1, // Lebih gede, lebih bulet
                boxShadow: 10,
              }}
            >
              <Image
                alt={item.title}
                src={item.image_url}
                sx={{ width: '100%', height: '100%', objectFit: 'cover',  borderRadius: 'inherit' }}
              />
              {/* Optional: Tambah isi Card (judul, tombol, dll) */}
              {/* <CardContent
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  color: 'white',
                  background: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: 2,
                  padding: 2,
                }}
              >
                <Typography variant="h5">{item.title}</Typography>
              </CardContent> */}
            </Card>
          ))}
        </Carousel>

        {/* ARROWS */}
        <CarouselArrows
          onNext={carousel.onNext}
          onPrev={carousel.onPrev}
          sx={{
            position: 'absolute',
            top: '50%',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            px: 2,
            transform: 'translateY(-50%)',
            '& .arrow': {
              backgroundColor: 'rgba(161, 126, 126, 0.7)',
              width: 48,
              height: 48,
              borderRadius: '50%',
              color: 'white',
              fontSize: 28,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.9)',
              },
            },
          }}
        />
      </Box>
    </Container>
  );
}
