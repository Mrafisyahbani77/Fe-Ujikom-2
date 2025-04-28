import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
// sections
import UserDetailProfileView from 'src/sections/user/view/user-detail-profile-view';

// ----------------------------------------------------------------------

export default function AccountPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Detail User</title>
      </Helmet>

      <UserDetailProfileView id={`${id}`} />
    </>
  );
}
