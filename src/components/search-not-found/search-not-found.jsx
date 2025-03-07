import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

// ----------------------------------------------------------------------

export default function SearchNotFound({ query, sx, ...other }) {
  return query ? (
    <Paper
      sx={{
        bgcolor: 'unset',
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h6" gutterBottom>
        Tidak ada data barang yang di cari
      </Typography>

      <Typography variant="body2">
        tidak ada hasil ditemukan untuk &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br /> Cobalah memeriksa kesalahan ketik atau menggunakan kata-kata yang lengkap.
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2" sx={sx}>
      Silakan masukkan kata kunci
    </Typography>
  );
}

SearchNotFound.propTypes = {
  query: PropTypes.string,
  sx: PropTypes.object,
};
