import { Container } from '@mui/material';
import React from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import EditForm from '../EditForm';
import { useFetchCategoryById } from 'src/utils/category';

export default function CategoryEditView({ id }) {
  const settings = useSettingsContext();

  const { data } = useFetchCategoryById(id);

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
      <EditForm category={data} />
    </Container>
  );
}
