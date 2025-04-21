// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ShippingView from './shipping-view';
// ----------------------------------------------------------------------

export default function CreateShippingView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ my: 5 }}>
      <CustomBreadcrumbs
        heading="Buat alamat baru"
        links={[
          { name: 'Pilih alamat ', href: paths.product.checkout },
          { name: 'Buat alamat baru' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ShippingView />
    </Container>
  );
}
