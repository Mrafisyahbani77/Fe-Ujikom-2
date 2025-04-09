import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useMutationLogout } from 'src/utils/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

// ----------------------------------------------------------------------

const OPTIONS = [
  // {
  //   label: 'Home',
  //   linkTo: '/',
  // },
  {
    label: 'Profile',
    linkTo: paths.dashboard.user.account,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();

  // const { user } = useMockedUser();

  const { logout } = useAuthContext();

  const { user } = useAuthContext();
  const users = user.data;
  console.log(user);

  const [openDialog, setOpenDialog] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const popover = usePopover();

  // const { mutate: handleLogout } = useMutationLogout({
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['authenticated.user'] }); // Reset cache
  //     navigate('/'); // Kembali ke landing page
  //     enqueueSnackbar('Logout berhasil', { variant: 'success' });
  //     localStorage.removeItem('accessToken');
  //     localStorage.removeItem('refreshToken');
  //     // setTimeout(() => {
  //     //   window.location.reload(); // Refresh halaman agar reset state
  //     // }, 500);
  //   },
  //   onError: (error) => {
  //     enqueueSnackbar(error.message, { variant: 'error' });
  //   },
  // });

  const handleLogoutClick = () => {
    setOpenDialog(true);
    popover.onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      setOpenDialog(false);
      router.replace('/');
      enqueueSnackbar('Logout Berhasil!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Gagal log out!', { variant: 'error' });
      setOpenDialog(false);
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const handleClickItem = (path) => {
    popover.onClose();
    router.push(path);
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={users?.profile_photo}
          alt={users?.username}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        />
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {users?.username}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {users?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLogoutClick}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          Logout
        </MenuItem>
      </CustomPopover>

      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Konfirmasi Logout</DialogTitle>
        <DialogContent>
          <Typography>Apakah Anda yakin ingin keluar?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Batal
          </Button>
          <Button onClick={handleLogout} color="error">
            Keluar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
