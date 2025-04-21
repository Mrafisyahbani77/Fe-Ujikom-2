import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Image from 'src/components/image';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import Carousel, { CarouselArrowIndex, useCarousel } from 'src/components/carousel';

// ----------------------------------------------------------------------

const THUMB_SIZE = 64; // Set a consistent size for thumbnails

const StyledThumbnailsContainer = styled('div')(({ length, theme }) => ({
  position: 'relative',
  margin: theme.spacing(0, 'auto'),
  '& .slick-slide': {
    lineHeight: 0,
  },
  ...(length === 1 && {
    maxWidth: THUMB_SIZE * 1 + 16,
  }),
  ...(length === 2 && {
    maxWidth: THUMB_SIZE * 2 + 32,
  }),
  ...((length === 3 || length === 4) && {
    maxWidth: THUMB_SIZE * 3 + 48,
  }),
  ...(length >= 5 && {
    maxWidth: THUMB_SIZE * 6,
  }),
  ...(length > 3 && {
    '&:before, &:after': {
      ...bgGradient({
        direction: 'to left',
        startColor: `${alpha(theme.palette.background.default, 0)} 0%`,
        endColor: `${theme.palette.background.default} 100%`,
      }),
      top: 0,
      zIndex: 9,
      content: "''",
      height: '100%',
      position: 'absolute',
      width: (THUMB_SIZE * 2) / 3,
    },
    '&:after': {
      right: 0,
      transform: 'scaleX(-1)',
    },
  }),
}));

// ----------------------------------------------------------------------

export default function ProductDetailsCarousel({ product }) {
  const theme = useTheme();
  const videoRefs = useRef({});

  // Separate slides for carousel and lightbox
  const carouselSlides = [
    ...(product?.images?.map((img) => ({
      type: 'image',
      src: img.image_url,
    })) || []),
    ...(product?.videos?.map((vid) => ({
      type: 'video',
      src: vid.video_url,
    })) || []),
  ];

  // Create a special format for lightbox that won't break video playback
  const lightboxSlides = carouselSlides.map((slide, index) => {
    if (slide.type === 'image') {
      return {
        src: slide.src,
        type: 'image',
      };
    }

    // For videos, we need to use a special format
    return {
      src: slide.src,
      type: 'video',
      width: 1280,
      height: 720,
    };
  });

  const lightbox = useLightBox(lightboxSlides);

  const carouselLarge = useCarousel({
    rtl: false,
    draggable: false,
    adaptiveHeight: true,
  });

  const carouselThumb = useCarousel({
    rtl: false,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: true,
    centerPadding: '0px',
    slidesToShow: carouselSlides?.length > 3 ? 3 : carouselSlides?.length,
  });

  useEffect(() => {
    carouselLarge.onSetNav();
    carouselThumb.onSetNav();
  }, [carouselLarge, carouselThumb]);

  useEffect(() => {
    if (lightbox.open) {
      carouselLarge.onTogo(lightbox.selected);
    }
  }, [carouselLarge, lightbox.open, lightbox.selected]);

  // Custom function to properly handle lightbox open with videos
  const handleOpenLightbox = (index) => {
    // Pause all videos in the carousel before opening lightbox
    Object.values(videoRefs.current).forEach((ref) => {
      if (ref && ref.pause) {
        ref.pause();
      }
    });

    lightbox.onOpen(index);
  };

  const renderLargeImg = (
    <Box
      sx={{
        mb: 3,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Carousel
        {...carouselLarge.carouselSettings}
        asNavFor={carouselThumb.nav}
        ref={carouselLarge.carouselRef}
      >
        {carouselSlides?.map((slide, index) =>
          slide.type === 'image' ? (
            <Image
              key={`slide-image-${index}`}
              alt={`Product image ${index + 1}`}
              src={slide.src}
              ratio="1/1"
              onClick={() => handleOpenLightbox(index)}
              sx={{ cursor: 'zoom-in' }}
            />
          ) : (
            <Box key={`slide-video-${index}`} sx={{ position: 'relative', pt: '100%', height: 0 }}>
              <Box
                component="video"
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={slide.src}
                controls
                autoPlay={false}
                onClick={() => handleOpenLightbox(index)}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                }}
              />
            </Box>
          )
        )}
      </Carousel>

      <CarouselArrowIndex
        index={carouselLarge.currentIndex}
        total={carouselSlides?.length}
        onNext={carouselThumb.onNext}
        onPrev={carouselThumb.onPrev}
      />
    </Box>
  );

  const renderThumbnails = (
    <StyledThumbnailsContainer length={carouselSlides?.length}>
      <Carousel
        {...carouselThumb.carouselSettings}
        asNavFor={carouselLarge.nav}
        ref={carouselThumb.carouselRef}
      >
        {carouselSlides?.map((item, index) => (
          <Box key={`thumb-${index}`} sx={{ px: 0.5 }}>
            {item.type === 'image' ? (
              <Avatar
                alt={`Product thumbnail ${index + 1}`}
                src={item.src}
                variant="rounded"
                sx={{
                  width: THUMB_SIZE,
                  height: THUMB_SIZE,
                  opacity: 0.48,
                  cursor: 'pointer',
                  ...(carouselLarge.currentIndex === index && {
                    opacity: 1,
                    border: `solid 2.5px ${theme.palette.primary.main}`,
                  }),
                }}
              />
            ) : (
              <Box
                sx={{
                  width: THUMB_SIZE,
                  height: THUMB_SIZE,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'grey.200',
                  borderRadius: 1,
                  opacity: 0.48,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  ...(carouselLarge.currentIndex === index && {
                    opacity: 1,
                    border: `solid 2.5px ${theme.palette.primary.main}`,
                  }),
                }}
              >
                {/* Play icon overlay for video thumbnails */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                  }}
                >
                  <Box
                    sx={{
                      width: 0,
                      height: 0,
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                      borderLeft: '12px solid white',
                      ml: '3px',
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </Carousel>
    </StyledThumbnailsContainer>
  );

  // Custom renderer for lightbox content
  const renderLightboxContent = () => {
    if (!lightbox.open) return null;

    const currentSlide = lightboxSlides[lightbox.selected];

    if (currentSlide.type === 'video') {
      return (
        <Box
          sx={{
            width: '100%',
            maxWidth: '80vw',
            maxHeight: '80vh',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component="video"
            src={currentSlide.src}
            controls
            autoPlay
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              outline: 'none',
            }}
          />
        </Box>
      );
    }

    // For images, let the default lightbox handle it
    return null;
  };

  return (
    <Box
      sx={{
        '& .slick-slide': {
          float: theme.direction === 'rtl' ? 'right' : 'left',
        },
      }}
    >
      {renderLargeImg}

      {renderThumbnails}

      <Lightbox
        index={lightbox.selected}
        slides={lightboxSlides}
        open={lightbox.open}
        close={lightbox.onClose}
        onGetCurrentIndex={(index) => lightbox.setSelected(index)}
        customContent={renderLightboxContent()}
      />
    </Box>
  );
}

ProductDetailsCarousel.propTypes = {
  product: PropTypes.object,
};
