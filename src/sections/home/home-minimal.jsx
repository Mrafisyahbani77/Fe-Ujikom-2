import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { varFade, MotionViewport } from 'src/components/animate';
import { fetchCategory } from 'src/utils/category';
import Image from 'src/components/image';

export default function ShoesCategories() {
  const { data } = fetchCategory();

  return (
    <Container component={MotionViewport} sx={{ py: 5 }}>
      <m.div variants={varFade().inUp}>
        <Card sx={{ pt: 0, boxShadow: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h4">KATEGORI</Typography>
          </Box>

          {data && data.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                overflowX: 'auto',
                borderTop: '1px solid #e0e0e0',
                '&::-webkit-scrollbar': {
                  height: 6,
                },
                '&::-webkit-scrollbar-thumb': {
                  borderRadius: 3,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                },
                scrollbarWidth: 'thin',
                pb: 0.5, // Adds a bit of padding at the bottom for the scrollbar
              }}
            >
              {data.map((category) => (
                <Box
                  key={category.id}
                  component={Link}
                  to={`/category/${category.slug}`}
                  sx={{
                    minWidth: 120, // Fixed minimum width for each category
                    textAlign: 'center',
                    p: 2,
                    borderRight: '0.5px solid #e0e0e0',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0, // Prevents items from shrinking
                  }}
                >
                  <Image
                    alt={category.name}
                    src={category.image_url}
                    sx={{ width: 64, height: 64, borderRadius: '50%', mb: 1 }}
                  />
                  <Typography variant="body2" noWrap sx={{ width: '100%' }}>
                    {category.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Tidak ada data kategori
              </Typography>
            </Box>
          )}
        </Card>
      </m.div>
    </Container>
  );
}
