import { Container } from '@mui/material';
import React from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import EditForm from '../EditForm';
import { useFetchDiscountById } from 'src/utils/discount';

export default function DiscountEditView({ id }) {
  const settings = useSettingsContext();

  const { data } = useFetchDiscountById(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Diskon"
        links={[
          { name: 'Daftar diskon', href: paths.dashboard.discount.list },
          { name: 'Edit diskon' },

        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <EditForm currentDiscount={data} />
    </Container>
  );
}
