import { Helmet } from 'react-helmet-async';
// sections
import AmplifyForgotPasswordView from 'src/sections/auth/jwt/amplify-forgot-password-view';


// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title>Lupa Password</title>
      </Helmet>

      <AmplifyForgotPasswordView />
    </>
  );
}
