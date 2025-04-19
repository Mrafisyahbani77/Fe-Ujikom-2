import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// hooks
// import { useMockedUser } from 'src/hooks/use-mocked-users';
// utils
import { fData } from 'src/utils/format-number';
// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
} from 'src/components/hook-form';
import { useAuthContext } from 'src/auth/hooks';
import { useMutationUpdateProfile } from 'src/utils/auth';
import { useQueryClient } from '@tanstack/react-query';
import { MenuItem } from '@mui/material';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const users = user.data;

  const { initialize } = useAuthContext();

  // console.log(users);

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name harus di isi'),
    email: Yup.string().required('Email harus di isi').email('Email harus valid'),
    photoURL: Yup.mixed().nullable().required('Foto harus di isi'),
    phoneNumber: Yup.string().required('Nomor telepon harus di isi'),
    gender: Yup.string().required('Gender harus di isi'),
  });

  const defaultValues = {
    user_id: users?.id || '',
    displayName: users?.username || '',
    email: users?.email || '',
    phoneNumber: users?.phone_number || '',
    gender: users?.gender || '',
    photoURL: users?.profile_photo || null,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const { mutateAsync: updateProfile } = useMutationUpdateProfile({
    onSuccess: async () => {
      enqueueSnackbar('Update berhasil!', { variant: 'success' });
      queryClient.invalidateQueries(['user']);
      await initialize();
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append('username', data.displayName);
      formData.append('email', data.email);
      formData.append('phone_number', data.phoneNumber);
      formData.append('gender', data.gender);
      if (data.photoURL instanceof File) {
        formData.append('profile_photo', data.photoURL);
      }

      updateProfile({
        user_id: data.user_id,
        data: formData,
      });

      // enqueueSnackbar('Profile updated successfully!');
      // queryClient.invalidateQueries(['user']);
    } catch (error) {
      console.error(error);
      // enqueueSnackbar('Failed to update profile', { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid sx={{ mb: 5 }} container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
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

            {/* <RHFSwitch
              name="isPublic"
              labelPlacement="start"
              label="Public Profile"
              sx={{ mt: 5 }}
            /> */}

            {/* <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Delete User
            </Button> */}
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
              <RHFTextField name="displayName" label="Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phoneNumber" label="Phone Number" />
              {/* <RHFTextField name="address" label="Address" /> */}
              <RHFSelect name="gender" label="Jenis Kelamin">
                <MenuItem value="pria">Laki-laki</MenuItem>
                <MenuItem value="wanita">Wanita</MenuItem>
              </RHFSelect>

              {/* <RHFAutocomplete
                name="country"
                label="Country"
                options={countries.map((country) => country.label)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => {
                  const { code, label, phone } = countries.filter(
                    (country) => country.label === option
                  )[0];

                  if (!label) {
                    return null;
                  }

                  return (
                    <li {...props} key={label}>
                      <Iconify
                        key={label}
                        icon={`circle-flags:${code.toLowerCase()}`}
                        width={28}
                        sx={{ mr: 1 }}
                      />
                      {label} ({code}) +{phone}
                    </li>
                  );
                }}
              />

              <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="zipCode" label="Zip/Code" /> */}
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Simpan perubahan
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
