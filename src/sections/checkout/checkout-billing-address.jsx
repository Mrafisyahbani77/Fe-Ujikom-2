// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
// _mock
import { _addressBooks } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
//
import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import { AddressNewForm, AddressItem } from '../address';
import { useFetchShippings, useMutationDeleteShippings } from 'src/utils/shippings';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function CheckoutBillingAddress() {
  const checkout = useCheckoutContext();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { data } = useFetchShippings();

  const addressForm = useBoolean();

  const { mutate: deleteShipping, isLoading } = useMutationDeleteShippings({
    onSuccess: () => {
      enqueueSnackbar('Alamat berhasil dihapus', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fetch.shippings'] });
      setOpenConfirm(false);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || error?.message || 'Terjadi kesalahan', {
        variant: 'error',
      });
    },
  });

  const handleOpenConfirm = (id) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      deleteShipping(selectedId);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          {data.slice(0, 4).map((address) => (
            <AddressItem
              key={address.id}
              address={{
                recipient_name: address.recipient_name,
                fullAddress: `${address.address}, ${address.postal_code}`, // atau bisa lebih lengkap nanti
                addressType: 'Utama', // atau bisa 'Rumah', 'Kantor', bebas tergantung logic
                phone_number: address.phone_number,
                primary: true, // kalau mau kasih tanda primary address
              }}
              action={
                <Stack flexDirection="row" flexWrap="wrap" flexShrink={0}>
                  <Button variant="outlined" size="small">
                    Edit alamat ini
                  </Button>
                  {!address.primary && (
                    <Button
                      size="small"
                      color="error"
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenConfirm(address.id)}
                      disabled={isLoading}
                    >
                      Delete
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => checkout.onCreateBilling(address)}
                  >
                    Kirim ke alamat ini
                  </Button>
                </Stack>
              }
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                boxShadow: (theme) => theme.customShadows.card,
              }}
            />
          ))}

          <Stack direction="row" justifyContent="space-between">
            <Button
              size="small"
              color="inherit"
              onClick={checkout.onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              Kembali
            </Button>

            <Button
              size="small"
              color="primary"
              component={Link}
              to="/shipping"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Tambah alamat baru
            </Button>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutSummary
            total={checkout.total}
            subTotal={checkout.subTotal}
            discount={checkout.discount}
          />
        </Grid>
      </Grid>

      <AddressNewForm open={addressForm.value} onClose={addressForm.onFalse} />

      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Yakin ingin menghapus alamat ini?</DialogTitle>

        <DialogActions>
          <Button onClick={handleCloseConfirm} color="inherit">
            Batal
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
