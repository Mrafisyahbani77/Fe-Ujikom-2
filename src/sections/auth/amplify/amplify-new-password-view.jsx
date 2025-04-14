import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'notistack';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useMutationResetPassword } from 'src/utils/auth';
import { paths } from 'src/routes/paths';
import { useParams } from 'react-router-dom'; // <-- pastikan menggunakan useParams dari react-router-dom
import { useBoolean } from 'src/hooks/use-boolean';
import { IconButton, InputAdornment } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function ResetPasswordView() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const password = useBoolean();
  const { resetToken } = useParams(); // Ambil token dari URL path
  console.log(resetToken);

  const { mutateAsync: resetPassword, isLoading } = useMutationResetPassword({
    onSuccess: () => {
      enqueueSnackbar('Password berhasil direset!', { variant: 'success' });
      router.push(paths.auth.jwt.login); // Redirect ke login page setelah reset berhasil
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.error || 'Terjadi kesalahan', { variant: 'error' });
    },
  });

  const ResetPasswordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('Password baru wajib diisi')
      .min(8, 'Password minimal 8 karakter'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Konfirmasi password tidak cocok')
      .required('Konfirmasi password wajib diisi'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    try {
      await resetPassword({
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
        resetToken: resetToken, // Kirim token yang diambil dari URL path
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Typography variant="h3" paragraph>
        Reset Password
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <RHFTextField
            name="newPassword"
            label="Password Baru"
            type={password.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <RHFTextField
            name="confirmPassword"
            label="Konfirmasi Password"
            type={password.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton type="submit" variant="contained" loading={isLoading}>
            Reset Password
          </LoadingButton>
        </Stack>
      </FormProvider>
    </>
  );
}
