import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { Button, MenuItem, TextField, Select, FormControl, InputLabel } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
import { HOST_API } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import { useMutationRegister } from 'src/utils/auth';
import { enqueueSnackbar } from 'notistack';

export default function JwtRegisterView() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const searchParams = useSearchParams();
  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    username: Yup.string().min(3, 'Username minimal 3 karakter').required('Username harus di isi'),
    phone_number: Yup.string()
      .matches(/^[0-9]+$/, 'Nomor telepon hanya boleh berisi angka')
      .min(10, 'Nomor telepon minimal 10 digit')
      .required('Nomor telepon harus di isi'),
    email: Yup.string().required('Email harus di isi').email('Format email tidak valid'),
    gender: Yup.string().required('Gender harus di isi'),
    password: Yup.string().min(6, 'Password minimal 6 karakter').required('Password harus di isi'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Password tidak cocok')
      .required('Konfirmasi password harus di isi'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      username: '',
      phone_number: '',
      email: '',
      gender: '',
      password: '',
      confirm_password: '',
    },
  });

  const { mutate: mutationRegister } = useMutationRegister({
    onSuccess: (response) => {
      enqueueSnackbar('Registrasi berhasil', { variant: 'success' });

      if (response.isGoogle) {
        // Jika pengguna daftar via Google, langsung login dengan menyimpan token
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        if (response.role === 'admin') {
          router.push(paths.dashboard.root);
        } else {
          router.push('/');
        }
      } else {
        // Jika daftar manual, arahkan ke login
        router.push(paths.auth.jwt.login);
      }
    },
    onError: (error) => {
      let errorMessage = 'Registrasi gagal';

      if (error?.response) {
        const { status, data } = error.response;

        if (status === 400) {
          if (data?.message?.includes('Username, email, atau nomor telepon sudah terdaftar')) {
            errorMessage =
              'Username, email, atau nomor telepon sudah terdaftar! Silakan gunakan data lain.';
          } else {
            errorMessage = data?.message || 'Input tidak valid. Periksa kembali data Anda.';
          }
        } else if (status === 500) {
          errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setErrorMsg(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const onSubmit = (data) => {
    try {
      mutationRegister(data);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${HOST_API}/api/auth/google`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const role = params.get('role');

    console.log('Tokens:', { accessToken, refreshToken, role }); // Debugging

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      enqueueSnackbar('Login successful', { variant: 'success' });

      if (role === 'admin') {
        router.push(paths.dashboard.root);
      } else {
        router.push('/');
      }
    }
  }, []);

  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Register </Typography>
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">Sudah punya akun?</Typography>
          <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2">
            Login
          </Link>
        </Stack>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
          <TextField
            label="Username"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            label="Nomor Telepon"
            {...register('phone_number')}
            error={!!errors.phone_number}
            helperText={errors.phone_number?.message}
          />
          <TextField
            label="Email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <FormControl>
            <InputLabel>Jenis Kelamin</InputLabel>
            <Select {...register('gender')} error={!!errors.gender}>
              <MenuItem value="pria">Laki-laki</MenuItem>
              <MenuItem value="wanita">Perempuan</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Password"
            type={password.value ? 'text' : 'password'}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
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
          <TextField
            label="Konfirmasi Password"
            type="password"
            {...register('confirm_password')}
            error={!!errors.confirm_password}
            helperText={errors.confirm_password?.message}
          />
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Buat Akun
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
      </form>
    </>
  );
}
