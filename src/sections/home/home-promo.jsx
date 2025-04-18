import { Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function HomePromo() {
  return (
    <Container>
      <CustomBreadcrumbs 
        heading="Wishlist"
        links={[{ name: 'Beranda', href: '/' }, { name: 'Promo' }]}
        sx={{ mb: 3 }}
      />
      HomePromo
    </Container>
  );
}
