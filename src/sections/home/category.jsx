import { Box, Container, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { MotionViewport } from 'src/components/animate';
import Image from 'src/components/image';
import { LoadingScreen } from 'src/components/loading-screen';
import { useFetchCategoryBySlug } from 'src/utils/category'; // Pastikan ini adalah custom hook yang mengembalikan { data, isLoading, isError }
import ProductSlug from './product-slug';

export default function Category() {
  const { slug } = useParams();

  const { data, isLoading, isError } = useFetchCategoryBySlug(slug);

  if (isLoading) {
    return (
      <Typography>
        <LoadingScreen />
      </Typography>
    );
  }

  if (isError) {
    return <Typography>Error loading category</Typography>;
  }

  // Pastikan data tersedia dan sesuai dengan struktur API
  const category = data?.category;
  const products = data?.products;

  // console.log(category)

  if (!category) {
    return <Typography>No category data available</Typography>;
  }

  return (
    <Container component={MotionViewport} sx={{ py: { xs: 5, md: 10 } }}>
      <Typography color="gray" variant="body1">
        Kategori {category.name}
      </Typography>
      <Box>
        <Image
          src={category.image_url}
          alt={category.name}
          sx={{ width: '100%', height: 300, objectFit: 'cover' }}
        />
      </Box>
      <Box sx={{ py: { xs: 5, md: 10 } }}>
        <ProductSlug slug={slug} />
      </Box>
    </Container>
  );
}
