import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
// routes
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const logo = (
    <Box
      ref={ref}
      component="img"
      src="/logo/barangin 3.png" // <-- benar, tanpa /public
      sx={{
        height: { xs: 50, sm: 60, md: 72 }, // lebih besar
        width: 'auto', // biar proporsional
        display: 'block', // gambar block supaya rapih
        mx: 'auto', // center horizontal
        my: 'auto', // center vertical
        cursor: 'pointer',
        ...sx,
      }}
      {...other}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'inline-flex' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
