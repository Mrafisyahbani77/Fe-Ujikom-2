import { Container } from '@mui/material';
import React from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import EditForm from '../EditForm';
import { useFetchBannerById } from 'src/utils/banner';

export default function BannerEditView({ id }) {
  const settings = useSettingsContext();

  const { data } = useFetchBannerById(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Banner"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'daftar banner', href: paths.dashboard.category.list },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <EditForm currentProduct={data} />
    </Container>
  );
}
