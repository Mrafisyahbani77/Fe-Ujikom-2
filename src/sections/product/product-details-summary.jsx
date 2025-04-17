import PropTypes from 'prop-types';
import { useEffect, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// utils
import { fShortenNumber, fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ColorPicker } from 'src/components/color-utils';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
//
import IncrementerButton from './common/incrementer-button';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'notistack';
import {
  useFetchWhislist,
  useMutationCreateWhislist,
  useMutationDeleteWhislist,
} from 'src/utils/whishlist';
import { useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------------------------

export default function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  disabledActions,
  ...other
}) {
  const router = useRouter();
  const { user } = useAuthContext(); // Cek user login
  const { enqueueSnackbar } = useSnackbar(); // Buat notif
  const queryClient = useQueryClient();

  const {
    id,
    name,
    size,
    price,
    images,
    color,
    newLabel,
    available,
    priceSale,
    saleLabel,
    totalRatings,
    totalReviews,
    inventoryType,
    review,
    subDescription,
    stock,
  } = product;

  const existProduct = !!items?.length && items.map((item) => item.id).includes(id);

  const isMaxQuantity =
    !!items?.length &&
    items.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  const defaultValues = {
    id,
    name,
    images,
    available,
    price,
    color: color[0],
    size: size[0],
    quantity: available < 1 ? 0 : 1,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit } = methods;
  const { data: wishlistData } = useFetchWhislist();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (Array.isArray(wishlistData?.data)) {
      setWishlist(wishlistData.data);
    } else {
      setWishlist([]);
    }
  }, [wishlistData]);

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
  }, [product]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!existProduct) {
        onAddCart?.({
          ...data,
          colors: [values.color],
          subTotal: data.price * data.quantity,
        });
      }
      onGotoStep?.(0);
      router.push(paths.product.checkout);
    } catch (error) {
      console.error(error);
    }
  });

  const handleAddCart = useCallback(() => {
    if (!user) {
      enqueueSnackbar('Anda harus login dulu', { variant: 'warning' });
      router.push('/auth/login');
      return;
    }

    // if (!data.size) {
    //   enqueueSnackbar('Silakan pilih ukuran terlebih dahulu', { variant: 'error' });
    //   return;
    // }

    try {
      onAddCart?.({
        ...values,
        colors: values.color,
        subTotal: values.price * values.quantity,
      });
    } catch (error) {
      console.error(error);
    }
  }, [onAddCart, values]);

  const { mutateAsync: AddWishlist } = useMutationCreateWhislist({
    onSuccess: () => {
      enqueueSnackbar('Berhasil menambahkan ke wishlist', {
        variant: 'success',
      });
      queryClient.invalidateQueries(['fetch.whishlist']);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message, {
        variant: 'error',
      });
    },
  });

  const { mutateAsync: RemoveWishlist } = useMutationDeleteWhislist({
    onSuccess: () => {
      enqueueSnackbar('Berhasil hapus produk dari wishlist', {
        variant: 'success',
      });
      queryClient.invalidateQueries(['fetch.whishlist']);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message, {
        variant: 'error',
      });
    },
  });

  const handleWishlist = async (productId) => {
    const existingItem = wishlist.find((item) => item.product.id === productId);

    try {
      if (existingItem) {
        const wishlistId = existingItem.wishlist_id; // ambil wishlist_id yang sebenarnya
        await RemoveWishlist(wishlistId);

        setWishlist((prev) => prev.filter((item) => item.product.id !== productId));
      } else {
        await AddWishlist({ products_id: productId });

        // biasanya respons create akan return data baru, tapi kalau tidak ada:
        const newItem = { id: new Date().getTime(), product: { id: productId }, is_wishlist: true }; // id sementara
        setWishlist((prev) => [...prev, newItem]);
      }
    } catch (error) {
      console.error('Error with wishlist operation:', error);
    }
  };

  const isWishlisted = wishlist.some((item) => item.product.id === product?.id);

  const renderPrice = (
    <Box sx={{ typography: 'h5' }}>
      {priceSale && (
        <Box
          component="span"
          sx={{
            color: 'text.disabled',
            textDecoration: 'line-through',
            mr: 0.5,
          }}
        >
          {fCurrency(priceSale)}
        </Box>
      )}

      {fCurrency(price)}
    </Box>
  );

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      {/* <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="mingcute:add-line" width={16} sx={{ mr: 1 }} />
        Compare
      </Link> */}

      <Link
        variant="subtitle2"
        onClick={() => handleWishlist(product?.id)} // Call the handleWishlist function with the product id
        sx={{
          cursor: 'pointer',
          color: isWishlisted ? 'primary.main' : 'text.secondary', // Change color based on wishlist status
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify
          icon={isWishlisted ? 'solar:bookmark-bold' : 'solar:bookmark-outline'}
          width={16}
          sx={{ mr: 1 }}
        />
        {isWishlisted ? 'Disimpan' : 'Simpan'}
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Bagikan
      </Link>
    </Stack>
  );

  const renderColorOptions = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Warna
      </Typography>

      <RHFSelect
        name="color"
        size="small"
        sx={{
          maxWidth: 120,
        }}
      >
        {color.map((color) => (
          <MenuItem key={color} value={color}>
            {/* <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: color,
                display: 'inline-block',
                marginRight: 1,
                borderRadius: '50%',
                border: '1px solid #ddd',
              }}
            /> */}
            {color}
          </MenuItem>
        ))}
      </RHFSelect>
    </Stack>
  );

  const renderSizeOptions = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Ukuran
      </Typography>

      <RHFSelect
        name="size"
        size="small"
        // helperText={
        //   <Link underline="always" color="textPrimary">
        //     Size Chart
        //   </Link>
        // }
        sx={{
          maxWidth: 88,
          [`& .${formHelperTextClasses.root}`]: {
            mx: 0,
            mt: 1,
            textAlign: 'right',
          },
        }}
      >
        {size.map((size) => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </RHFSelect>
    </Stack>
  );

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Jumlah
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={values.quantity}
          disabledDecrease={values.quantity <= 1}
          disabledIncrease={values.quantity >= available}
          onIncrease={() => setValue('quantity', values.quantity + 1)}
          onDecrease={() => setValue('quantity', values.quantity - 1)}
        />

        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
          {stock.status} {stock.quantity}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderActions = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        disabled={isMaxQuantity || disabledActions}
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: 'nowrap' }}
      >
        <Typography variant="button" sx={{ fontSize: '0.75rem' }}>
          Masukan keranjang
        </Typography>
      </Button>

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        disabled={disabledActions}
        onClick={(e) => {
          if (!user) {
            e.preventDefault(); // supaya submit form-nya nggak jalan
            enqueueSnackbar('Anda harus login dulu', { variant: 'warning' });
            router.push('/auth/login');
            return;
          }
          // kalau sudah login, lanjut submit
        }}
      >
        Beli sekarang
      </Button>
    </Stack>
  );

  // const renderSubDescription = (
  //   <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  //     {subDescription}
  //   </Typography>
  // );

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        color: 'text.disabled',
        typography: 'body2',
      }}
    >
      <Rating size="small" value={review.average_rating} precision={0.1} readOnly sx={{ mr: 1 }} />
      {`(${fShortenNumber(review.total_review)} review)`}
    </Stack>
  );

  // const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
  //   <Stack direction="row" alignItems="center" spacing={1}>
  //     {newLabel.enabled && <Label color="info">{newLabel.content}</Label>}
  //     {saleLabel.enabled && <Label color="error">{saleLabel.content}</Label>}
  //   </Stack>
  // );

  // const renderInventoryType = (
  //   <Box
  //     component="span"
  //     sx={{
  //       typography: 'overline',
  //       color:
  //         (stock.status === 'out of stock' && 'error.main') ||
  //         (stock.status === 'low stock' && 'warning.main') ||
  //         'success.main',
  //     }}
  //   >
  //     {stock.status}
  //   </Box>
  // );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {/* {renderLabels} */}

          {/* {renderInventoryType} */}
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <Typography variant="h5" noWrap>
              {name}
            </Typography>

            {renderShare}
          </Box>

          {renderRating}

          {renderPrice}

          {/* {renderSubDescription} */}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderColorOptions}

        {renderSizeOptions}

        {renderQuantity}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderActions}
      </Stack>
    </FormProvider>
  );
}

ProductDetailsSummary.propTypes = {
  items: PropTypes.array,
  disabledActions: PropTypes.bool,
  onAddCart: PropTypes.func,
  onGotoStep: PropTypes.func,
  product: PropTypes.object,
};
