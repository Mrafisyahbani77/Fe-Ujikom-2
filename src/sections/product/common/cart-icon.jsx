import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export default function CartIcon({ totalItems }) {
  return (
    <Box
      component={RouterLink}
      href={paths.product.checkout}
      sx={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: '50%',
        bgcolor: 'background.paper',
        padding: 1.5,
        boxShadow: (theme) => theme.customShadows.dropdown,
        transition: (theme) => theme.transitions.create(['opacity']),
        '&:hover': { opacity: 0.72 },
      }}
    >
      <Badge showZero badgeContent={totalItems} color="error" max={99}>
        <Iconify icon="solar:cart-3-bold" width={32} />
      </Badge>
    </Box>
  );
}

CartIcon.propTypes = {
  totalItems: PropTypes.number,
};
