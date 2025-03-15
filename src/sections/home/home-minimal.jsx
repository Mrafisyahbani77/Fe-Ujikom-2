import { m } from 'framer-motion';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Image from 'src/components/image';
import { MotionViewport, varFade } from 'src/components/animate';
import { fetchCategory } from 'src/utils/category';

export default function ShoesCategories() {
  const { data } = fetchCategory();

  return (
    <Container component={MotionViewport} sx={{ py: { xs: 5, md: 10 } }}>
      <Stack spacing={3} sx={{ mb: { xs: 5, md: 10 } }}>
        <m.div variants={varFade().inUp}>
          <Typography component="div" variant="h2" sx={{ color: 'text.disabled' }}>
            Kategori
          </Typography>
        </m.div>
      </Stack>

      {/* Grid kategori sepatu */}
      <Box
        gap={3}
        display="grid"
        sx={{
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          gap: 7,
          pb: 1,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
        gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }}
      >
        {data.map((category) => (
          <m.div key={category.id} variants={varFade().inUp}>
            <Stack alignItems="center" spacing={1}>
              <Image
                src={category.image_url}
                alt={category.name}
                sx={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
              />
              <Typography variant="subtitle1">{category.name}</Typography>
            </Stack>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
