import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
// utils
import { fData } from 'src/utils/format-number';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
} from 'src/components/hook-form';
import { useMutationCreateAdmin } from 'src/utils/users';

// ----------------------------------------------------------------------

export default function UserCreateEditForm({ User }) {
  const currentUser = User?.user;

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { mutateAsync: CreateAdmin } = useMutationCreateAdmin({
    onSuccess: () => {
      enqueueSnackbar(currentUser ? 'Update user berhasil!' : 'Buat user berhasil!', {
        variant: 'success',
      });
      router.push(paths.dashboard.user.list);
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    },
  });

  const NewUserSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    phone_number: Yup.string().nullable(),
    gender: Yup.string().nullable(),
    role: Yup.string()
      .required('Role is required')
      .oneOf(['admin', 'pembeli'], 'Role must be either admin or pembeli'),
    avatarUrl: Yup.mixed().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      password: '',
      phone_number: currentUser?.phone_number || '',
      gender: currentUser?.gender || '',
      role: currentUser?.role || 'pembeli',
      avatarUrl: currentUser?.profile_photo || null,
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Create the data object to send to backend
      const userData = {
        username: data.username,
        email: data.email,
        password: data.password,
        phone_number: data.phone_number || null,
        gender: data.gender || null,
        role: data.role,
        // Handle profile photo if needed
      };

      await CreateAdmin(userData);

      // If we get here, the creation was successful (handled in the mutation's onSuccess)
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message || 'Something went wrong', { variant: 'error' });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {/* {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="is_banned"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={(event) => field.onChange(event.target.checked)}
                        />
                      )}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Banned User
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Disable user account
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
                />
              </Stack>
            )} */}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="username" label="Username" />
              <RHFTextField name="email" label="Email Address" />

              <RHFTextField
                name="password"
                label="Password"
                type="password"
                helperText="Minimum 8 characters"
              />

              <RHFTextField name="phone_number" label="Phone Number" />

              <RHFSelect name="gender" label="Jenis Kelamin">
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="pria">Pria</MenuItem>
                <MenuItem value="wanita">Wanita</MenuItem>
              </RHFSelect>

              <RHFSelect name="role" label="Role">
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="pembeli">Pembeli</MenuItem>
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Buat User' : 'Simpan Perubahan'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserCreateEditForm.propTypes = {
  User: PropTypes.object,
};
