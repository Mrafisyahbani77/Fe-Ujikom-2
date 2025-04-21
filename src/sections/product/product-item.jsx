import PropTypes from 'prop-types';
// @mui
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { ColorPreview } from 'src/components/color-utils';
//
import { useCheckoutContext } from '../checkout/context';
import { Typography } from '@mui/material';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hooks';
import { useCallback } from 'react';

// ----------------------------------------------------------------------

export default function ProductItem({ product }) {
  const { onAddToCart } = useCheckoutContext();
  const { user } = useAuthContext(); // <-- ambil user login
  const { enqueueSnackbar } = useSnackbar(); // <-- buat notifikasi
  const router = useRouter(); // <-- buat redirect

  const {
    id,
    name,
    images,
    price,
    color,
    stock,
    sizes,
    priceSale,
    newLabel,
    saleLabel,
    total_sold,
    review,
    videos,
  } = product;

  console.log(product);

  const imageSrc = images?.[0]?.image_url || videos?.[0]?.video_url || '/placeholder.png'; // fallback ke placeholder

  const linkTo = paths.product.details(id);

  const handleAddCart = useCallback(() => {
    if (!user) {
      enqueueSnackbar('Anda harus login dulu', { variant: 'warning' });
      router.push('/auth/login');
      return;
    }

    // if (!sizes || sizes.length === 0) {
    //   enqueueSnackbar('Produk ini belum memiliki ukuran', { variant: 'error' });
    //   return;
    // }

    try {
      onAddToCart({
        id,
        name,
        image: images?.[0], // ambil gambar pertama
        price,
        quantity: 1,
        color: color?.[0] || '', // ambil warna pertama kalau ada
        size: sizes?.[0] || '', // ambil ukuran pertama kalau ada
        subTotal: price * 1,
      });
      enqueueSnackbar('Berhasil tambah ke keranjang!', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Gagal menambahkan ke keranjang.', { variant: 'error' });
    }
  }, [user, enqueueSnackbar, router, onAddToCart, id, name, images, price, color, sizes]);

  // const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
  //   <Stack
  //     direction="row"
  //     alignItems="center"
  //     spacing={1}
  //     sx={{ position: 'absolute', zIndex: 9, top: 16, right: 16 }}
  //   >
  //     {newLabel.enabled && (
  //       <Label variant="filled" color="info">
  //         {newLabel.content}
  //       </Label>
  //     )}
  //     {saleLabel.enabled && (
  //       <Label variant="filled" color="error">
  //         {saleLabel.content}
  //       </Label>
  //     )}
  //   </Stack>
  // );

  const isOutOfStock = !stock || stock.quantity <= 0 || stock.status !== 'available';

  const renderImg = (
    <Box sx={{ position: 'relative', p: 1 }}>
      {/* Tombol "Add to Cart" hanya muncul jika stok tersedia */}
      {/* {!isOutOfStock && (
        <Fab
          color="warning"
          size="medium"
          className="add-cart-btn"
          onClick={handleAddCart}
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 9,
            opacity: 0,
            position: 'absolute',
            transition: (theme) =>
              theme.transitions.create('all', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          <Iconify icon="solar:cart-plus-bold" width={24} />
        </Fab>
      )} */}

      {/* Gambar Produk dengan validasi stok */}
      <Tooltip title={isOutOfStock ? 'Stok habis' : ''} placement="bottom-end">
        <Image
          alt={name}
          src={imageSrc}
          ratio="1/1"
          sx={{
            borderRadius: 1.5,
            ...(isOutOfStock && {
              opacity: 0.48,
              filter: 'grayscale(1)',
            }),
          }}
        />
      </Tooltip>
    </Box>
  );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      {/* Nama Produk */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Link component={RouterLink} href={linkTo} color="inherit" variant="subtitle2" noWrap>
          {name}
        </Link>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Iconify icon="mdi:star" width={18} height={18} color="#FFC107" />
          <Typography variant="caption" color="text.secondary">
            {review.average_rating || 0}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {/* Warna Produk */}
        {/* <ColorPreview colors={color} /> */}
        <Typography variant="subtitle1" noWrap>
          {fCurrency(price)}
        </Typography>

        {/* Bagian Rating, Terjual dan Harga */}
        <Stack spacing={0.5} alignItems="flex-end">
          {/* Rating */}

          {/* Terjual */}
          <Typography variant="caption" color="text.secondary">
            Terjual {total_sold || 0}
          </Typography>

          {/* Harga */}
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Card
      sx={{
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      {/* {renderLabels} */}

      {renderImg}

      {renderContent}
    </Card>
  );
}

ProductItem.propTypes = {
  product: PropTypes.object,
};
