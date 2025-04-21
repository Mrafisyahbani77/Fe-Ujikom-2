import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useFetchShippingsById } from 'src/utils/shippings/useFetchShippingsById';
import ShippingView from './shipping-view';

// ----------------------------------------------------------------------

export default function EditShippingView({ id }) {
  // console.log(id)
  const settings = useSettingsContext();

  const { data } = useFetchShippingsById(id);
  // console.log(data)

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ my: 5 }}>
      <CustomBreadcrumbs
        heading="Edit alamat"
        links={[
          { name: 'Pilih alamat ', href: paths.product.checkout },
          { name: 'Edit alamat' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ShippingView currentData={data?.data} />
    </Container>
  );
}

EditShippingView.propTypes = {
  id: PropTypes.string,
};
