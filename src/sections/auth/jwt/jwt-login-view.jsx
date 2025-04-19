import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { Button } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// Mutation Auth
import { useMutationLogin } from 'src/utils/auth';
import { useSnackbar } from 'notistack';
import { HOST_API } from 'src/config-global';
import { useQueryClient } from '@tanstack/react-query';

export default function JwtLoginView() {
  const { enqueueSnackbar } = useSnackbar();
  const { login } = useAuthContext();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const password = useBoolean();
  const queryClient = useQueryClient();

  // const { mutate: mutationLogin } = useMutationLogin({
  //   onSuccess: (response) => {
  //     const userRole = response?.user?.role; // Ambil role dari response
  //     enqueueSnackbar('Login successful', { variant: 'success' });

  //     // Simpan token dan role di localStorage
  //     localStorage.setItem('accessToken', response.accessToken);
  //     localStorage.setItem('refreshToken', response.refreshToken);

  //     if (userRole?.includes('admin')) {
  //       router.push('/dashboard');
  //     } else if (userRole?.includes('pembeli')) router.push('/');
  //   },

  //   onError: (error) => {
  //     enqueueSnackbar(error.message || 'Login failed', { variant: 'error' });
  //     setErrorMsg(typeof error === 'string' ? error : error.message);
  //   },
  // });

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Validasi format email sebelum mengirim permintaan
      const errors = methods.formState.errors;

      if (errors.email) {
        enqueueSnackbar(errors.email.message, { variant: 'error' });
        return;
      }

      const response = await login?.(data.email, data.password);

      if (!response || !response.user) {
        enqueueSnackbar('Gagal mendapatkan data user!', { variant: 'error' });
        return;
      }

      const userRole = response.user.role;
      console.log(userRole);
      // Redirect sesuai role
      if (userRole?.includes('admin')) {
        router.push('/dashboard');
      } else if (userRole?.includes('pembeli')) {
        router.push('/');
      } else {
        enqueueSnackbar('Role tidak dikenal!', { variant: 'error' });
      }

      enqueueSnackbar('Login berhasil!', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fetch.cart'] }); // refresh cart
    } catch (error) {
      const errorMessage = error?.response?.data?.error || 'Terjadi kesalahan';

      if (error?.response?.status === 400) {
        if (errorMessage === 'Email tidak ditemukan') {
          enqueueSnackbar('Email anda salah!', { variant: 'error' });
        } else {
          enqueueSnackbar('Password anda salah!', { variant: 'error' });
        }
      } else {
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    }
  });

  const handleGoogleLogin = () => {
    window.location.href = `${HOST_API}/api/auth/google`;
  };

  // // Menangkap token dari URL setelah redirect dari backend Google
  // useEffect(() => {
  //   const params = new URLSearchParams(
  //     window.location.search || window.location.hash.replace('#', '?')
  //   );

  //   const accessToken = params.get('accessToken');
  //   const refreshToken = params.get('refreshToken');
  //   const role = params.get('role');

  //   console.log('Token dari URL:', { accessToken, refreshToken, role }); // Debugging

  //   if (accessToken && refreshToken) {
  //     localStorage.setItem('accessToken', accessToken);
  //     localStorage.setItem('refreshToken', refreshToken);

  //     enqueueSnackbar('Login berhasil', { variant: 'success' });
  //     router.push(role === 'admin' ? paths.dashboard.root : '/');
  //   }
  // }, []);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2} sx={{ mb: 5 }}>
        <Typography variant="h4">Login to Barangin</Typography>
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">Pengguna baru?</Typography>
          <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2">
            Buat akun
          </Link>
        </Stack>
      </Stack>

      {/* {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>} */}

      <Stack spacing={2.5}>
        <RHFTextField
          name="email"
          label="Email address"
          error={!!methods.formState.errors.email}
          helperText={methods.formState.errors.email?.message}
        />

        <RHFTextField
          name="password"
          label="Password"
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
        <Link
          component={RouterLink}
          href={paths.auth.jwt.forgotPassword}
          variant="body2"
          color="inherit"
          underline="always"
          sx={{ alignSelf: 'flex-end' }}
        >
          Forgot password?
        </Link>
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
        <Button
          fullWidth
          startIcon={<Iconify icon="flat-color-icons:google" />}
          color="primary"
          size="large"
          sx={{ borderRadius: 5, py: 1 }}
          variant="contained"
          onClick={handleGoogleLogin}
        >
          Login with Google
        </Button>
      </Stack>
    </FormProvider>
  );
}
