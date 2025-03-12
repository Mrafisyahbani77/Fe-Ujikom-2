// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Badge, { badgeClasses } from '@mui/material/Badge';
// hooks
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgBlur } from 'src/theme/css';
// routes
import { paths } from 'src/routes/paths';
// components
import Logo from 'src/components/logo';
//
import { HEADER } from '../config-layout';
import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
import navConfig from './config-navigation';
//
import { SettingsButton, HeaderShadow } from '../_common';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import AccountPopoverUser from '../user/account-popover-user';
import { useAuthContext } from 'src/auth/hooks';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();
  const data = navConfig();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Cek apakah token tersimpan di localStorage
    const token = sessionStorage.getItem('accessToken');
    setIsAuthenticated(!!token); // Jika token ada, berarti sudah login
  }, []);

  const mdUp = useResponsive('up', 'md');

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          <Badge
            sx={{
              [`& .${badgeClasses.badge}`]: {
                top: 8,
                right: -16,
              },
            }}
          >
            <Logo />
          </Badge>

          <Box sx={{ flexGrow: 1 }} />

          {mdUp && <NavDesktop offsetTop={offsetTop} data={data} />}

          <Stack alignItems="center" direction={{ xs: 'row', md: 'row-reverse' }}>
            {isAuthenticated ? (
              <AccountPopoverUser />
            ) : (
              <Button
                component={RouterLink}
                href={paths.auth.jwt.login}
                variant="outlined"
                color="primary"
              >
                Login
              </Button>
            )}
            {/* <SettingsButton
              sx={{
                ml: { xs: 1, md: 0 },
                mr: { md: 2 },
              }}
            /> */}

            {!mdUp && <NavMobile offsetTop={offsetTop} data={data} />}
          </Stack>
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
