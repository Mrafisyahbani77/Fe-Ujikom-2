import { Box, Container, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { MotionViewport } from 'src/components/animate';
import Image from 'src/components/image';
import { LoadingScreen } from 'src/components/loading-screen';
import { useFetchCategoryBySlug } from 'src/utils/category'; // Pastikan ini adalah custom hook yang mengembalikan { data, isLoading, isError }
import ProductSlug from './product-slug';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

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
      <CustomBreadcrumbs
        heading={`Daftar kategori ${category.name}`}
        links={[
          {
            name: 'Beranda',
            href: '/',
          },
          { name: `${category.name}` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box>
        <Image
          src={category.image_url}
          alt={category.name}
          sx={{
            width: '100%',
            height: { xs: 200, md: 400 }, // Adjust height based on screen size
            objectFit: 'cover', // Ensures the image covers the area without distortion
            borderRadius: 2, // Optional: Adds rounded corners for a more modern feel
            boxShadow: 3, // Optional: Adds a subtle shadow to make it stand out
          }}
        />
      </Box>
      <Box sx={{ py: { xs: 5, md: 10 } }}>
        <ProductSlug slug={slug} />
      </Box>
    </Container>
  );
}
