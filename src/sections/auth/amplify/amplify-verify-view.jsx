import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'notistack';
// components
import FormProvider, { RHFCode } from 'src/components/hook-form';
import { useMutationVerifyOtp } from 'src/utils/auth';
// mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
// assets
import { EmailInboxIcon } from 'src/assets/icons';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// ---------------------------------------------------------------

const VerifySchema = Yup.object().shape({
  code: Yup.string()
    .required('Code is required')
    .min(6, 'Code must be 6 characters')
    .max(6, 'Code must be 6 characters'),
});

export default function AmplifyVerifyView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(VerifySchema),
    defaultValues: {
      code: '',
    },
  });

  const { handleSubmit } = methods;

  const { mutateAsync: verifyOtp, isLoading } = useMutationVerifyOtp({
    onSuccess: (response) => {
      enqueueSnackbar('OTP berhasil diverifikasi!');
      const { resetToken } = response; // <<== ambil resetToken dari response
      if (resetToken) {
        router.push(`/auth/new-password/${resetToken}`); // <<== kirim token ke URL
      }
    },
    onError: (error) => {
      enqueueSnackbar(error?.message || 'Gagal verifikasi OTP', { variant: 'error' });
    },
  });

  const onSubmit = async (data) => {
    try {
      await verifyOtp({ otp: data.code });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Stack spacing={2} sx={{ my: 5, textAlign: 'center' }}>
        <EmailInboxIcon sx={{ height: 96 }} />
        <Typography variant="h3">Please check your email!</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Kami telah mengirim kode konfirmasi 6 digit melalui email. Harap masukkan kode di bawah
          ini untuk memverifikasi alamat email Anda.
        </Typography>
      </Stack>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <RHFCode name="code" />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isLoading}
          >
            Verify
          </LoadingButton>
        </Stack>
      </FormProvider>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.register}
        color="inherit"
        variant="subtitle2"
        sx={{ mt: 3, mx: 'auto', alignItems: 'center', display: 'inline-flex' }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign up
      </Link>
    </>
  );
}
