import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// auth
import { useAuthContext } from 'src/auth/hooks';
// assets
import { PasswordIcon } from 'src/assets/icons';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useMutationForgotPassword } from 'src/utils/auth/useMutationForgotPassword';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function AmplifyForgotPasswordView() {
  // const { forgotPassword } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: forgotPassword } = useMutationForgotPassword({
    onSuccess: () => {
      // console.log('success');
      enqueueSnackbar('Periksa email Anda untuk lihat kode otp', {
        variant: 'success',
      });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const router = useRouter();

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await forgotPassword({ email: data.email });

      const searchParams = new URLSearchParams({
        email: data.email,
      }).toString();

      // const href = `${paths.auth.amplify.verify}?${searchParams}`
      router.push(paths.auth.jwt.verify);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Kirim
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Kembali ke login
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Forgot your password?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Silakan masukkan alamat email yang terkait dengan akun Anda dan kami akan mengirimkan
          tautan untuk mengatur ulang kata sandi Anda.
        </Typography>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
