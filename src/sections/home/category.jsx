import { Box, Container, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { MotionViewport } from 'src/components/animate';
import Image from 'src/components/image';
import { LoadingScreen } from 'src/components/loading-screen';
import { useFetchCategory } from 'src/utils/category'; // Pastikan ini adalah custom hook yang mengembalikan { data, isLoading, isError }

export default function Category() {
  const { id } = useParams();

  const { data, isLoading, isError } = useFetchCategory(id); // Pastikan ini sesuai

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

  if (!data || !Array.isArray(data)) {
    return <Typography>No category data available</Typography>;
  }

  return (
  <Container component={MotionViewport} sx={{ py: { xs: 5, md: 10 } }}>
      {data.map((category, index) => (
        <Box key={index}>
          <Image
            src={category.image_url}
            alt={category.name}
            sx={{ width: '100%', height: 80, objectFit: 'cover' }}
          />
          <Typography variant="h1">Category: {category.name}</Typography>
        </Box>
      ))}
    </Container>
  );
}
