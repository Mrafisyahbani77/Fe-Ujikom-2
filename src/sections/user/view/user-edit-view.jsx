import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _userList } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useFetchUserById } from 'src/utils/users';
import UserCreateEditForm from '../user-create-edit-form';

// ----------------------------------------------------------------------

export default function UserEditView({ id }) {
  const settings = useSettingsContext();

  // const currentUser = _userList.find((user) => user.id === id);
  const { data } = useFetchUserById(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit User"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'User',
            href: paths.dashboard.user.list,
          },
          { name: data?.user?.username },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserCreateEditForm User={data} />
    </Container>
  );
}

UserEditView.propTypes = {
  id: PropTypes.string,
};
