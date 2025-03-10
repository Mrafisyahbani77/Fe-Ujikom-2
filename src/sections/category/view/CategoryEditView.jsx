import { Button, Container } from '@mui/material';
import React from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';

export default function CategoryEditView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Kategori"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'daftar kategori', href: paths.dashboard.category.list },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
    </Container>
  );
}
