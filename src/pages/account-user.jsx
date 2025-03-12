import { Helmet } from 'react-helmet-async';
// sections
import { AccountView } from 'src/layouts/user/account/view';

// ----------------------------------------------------------------------

export default function AccountUser() {
  return (
    <>
      <Helmet>
        <title> Profile </title>
      </Helmet>

      <AccountView />
    </>
  );
}
