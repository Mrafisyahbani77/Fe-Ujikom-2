import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
        <Card sx={{pt:0, boxShadow: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h4">KATEGORI</Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              borderTop: '1px solid #e0e0e0', // garis atas
              borderLeft: '1px solid #e0e0e0', // garis kiri
            }}
          >
            {data?.map((category) => (
              <Box
                key={category.id}
                component={Link}
                to={`/category/${category.slug}`}
                sx={{
                  textAlign: 'center',
                  p: 2,
                  borderRight: '0.5px solid #e0e0e0', // garis kanan antar item
                  borderBottom: '0.5px solid #e0e0e0', // garis bawah antar item
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  alt={category.name}
                  src={category.image_url}
                  sx={{ width: 64, height: 64, borderRadius: '50%', mb: 1 }}
                />
                <Typography variant="body2">{category.name}</Typography>
              </Box>
            ))}
          </Box>
        </Card>
      </m.div>
    </Container>
  );
}
