import { Button, Container } from '@mui/material';
import React from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import CreateForm from '../CreateForm';

export default function DiscountCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Buat Diskon"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'daftar diskon', href: paths.dashboard.discount.list },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <CreateForm />
    </Container>
  );
}
