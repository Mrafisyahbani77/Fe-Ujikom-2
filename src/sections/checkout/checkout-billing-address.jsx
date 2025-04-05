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
import { useFetchShippings } from 'src/utils/shippings';

// ----------------------------------------------------------------------

export default function CheckoutBillingAddress() {
  const checkout = useCheckoutContext();

  const { data } = useFetchShippings();

  const addressForm = useBoolean();

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
                  {!address.primary && (
                    <Button size="small" color="error" sx={{ mr: 1 }}>
                      Delete
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => checkout.onCreateBilling(address)}
                  >
                    Deliver to this Address
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
              Back
            </Button>

            <Button
              size="small"
              color="primary"
              onClick={addressForm.onTrue}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Buat alamat baru
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
    </>
  );
}
