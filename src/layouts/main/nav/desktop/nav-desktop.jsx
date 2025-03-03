import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
// components
import NavList from './nav-list';

// ----------------------------------------------------------------------

export default function NavDesktop({ offsetTop, data }) {
  return (
    <Stack component="nav" direction="row" spacing={5} sx={{ mr: 2.5, height: 1 }}>
      {data.map((link) => (
        <>
          <Badge
            key={link.title}
            badgeContent={link.badge}
            color="error"
            max={99}
            overlap="rectangular"
            invisible={!link.badge}
            sx={{
              top: 25,
              left: 35,
              zIndex: 999,
            }}
          />
          <NavList item={link} offsetTop={offsetTop} />
        </>
      ))}
    </Stack>
  );
}

NavDesktop.propTypes = {
  data: PropTypes.array.isRequired,
  offsetTop: PropTypes.bool,
};
