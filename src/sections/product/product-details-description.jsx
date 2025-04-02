import PropTypes from 'prop-types';
// components
import Markdown from 'src/components/markdown';
import { Box, Grid, Typography, Divider } from '@mui/material';

// ----------------------------------------------------------------------

export default function ProductDetailsDescription({ description, data }) {
  // Map the product data to the specifications array
  const specifications = [
    { label: 'Kategori', value: data?.categories?.name || '' },
    { label: 'SKU', value: data?.sku || '' },
    // { label: 'Harga', value: `Rp ${parseInt(data?.price).toLocaleString()}` || '' },
    { label: 'Jumlah Stok', value: data?.stock?.quantity || '' },
    { label: 'Status Stok', value: data?.stock?.status || '' },
    { label: 'Ukuran Tersedia', value: data?.size?.join(', ') || '' },
    { label: 'Warna Tersedia', value: data?.color?.join(', ') || '' },
    // { label: 'Status Produk', value: data?.status || '' },
    // { label: 'Tanggal Dibuat', value: new Date(data?.created_at).toLocaleDateString() || '' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Spesifikasi Produk */}
      <Typography variant="h6" gutterBottom>
        Spesifikasi Produk
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {specifications.map((spec, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Typography variant="body2" fontWeight="bold">
              {spec.label}
            </Typography>
            <Typography variant="body2">{spec.value}</Typography>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Deskripsi Produk */}
      <Typography variant="h6" gutterBottom>
        Deskripsi Produk
      </Typography>

      <Markdown
        children={description}
        sx={{
          '& p, li, ol': {
            typography: 'body2',
          },
          '& ol': {
            p: 0,
            display: { md: 'flex' },
            listStyleType: 'none',
            '& li': {
              '&:first-of-type': {
                minWidth: 240,
                mb: { xs: 0.5, md: 0 },
              },
            },
          },
        }}
      />
    </Box>
  );
}

ProductDetailsDescription.propTypes = {
  description: PropTypes.string.isRequired,
  data: PropTypes.shape({
    categories: PropTypes.shape({
      name: PropTypes.string,
    }),
    sku: PropTypes.string,
    price: PropTypes.string,
    stock: PropTypes.shape({
      quantity: PropTypes.number,
      status: PropTypes.string,
    }),
    size: PropTypes.arrayOf(PropTypes.string),
    color: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
    created_at: PropTypes.string,
  }).isRequired,
};
