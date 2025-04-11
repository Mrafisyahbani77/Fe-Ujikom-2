import PropTypes from 'prop-types';
import { m, AnimatePresence } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
// assets
import { OrderCompleteIllustration } from 'src/assets/illustrations';
// components
import Iconify from 'src/components/iconify';
import { varFade } from 'src/components/animate';
import { useMutationBuy } from 'src/utils/payment';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function CheckoutOrderComplete({ open, onReset, onDownloadPDF, data }) {
  console.log(data);
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: Payment, isLoading } = useMutationBuy({
    onSuccess: (res) => {
      console.log('Payment success', res);
      enqueueSnackbar('Redirecting to payment...', { variant: 'success' });

      const redirectUrl = res?.redirect_url;
      if (redirectUrl) {
        window.location.href = redirectUrl; // Langsung redirect ke Midtrans
      } else {
        enqueueSnackbar('Redirect URL tidak ditemukan!', { variant: 'error' });
      }
      onReset();
    },
    onError: (error) => {
      console.log('Payment error', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const handlePayment = () => {
    if (!data?.id) {
      enqueueSnackbar('Order ID tidak ditemukan!', { variant: 'error' });
      return;
    }
    Payment({ order_id: data.id }); // Kirim order_id ke API payment
  };
  const renderContent = (
    <Stack
      spacing={5}
      sx={{
        m: 'auto',
        maxWidth: 480,
        textAlign: 'center',
        px: { xs: 2, sm: 0 },
      }}
    >
      <Typography variant="h4">Thank you for your purchase!</Typography>

      <OrderCompleteIllustration sx={{ height: 260 }} />

      <Typography>
        Thanks for placing order
        <br />
        <br />
        <Link>01dc1370-3df6-11eb-b378-0242ac130002</Link>
        <br />
        <br />
        We will send you a notification within 5 days when it ships.
        <br /> If you have any question or queries then fell to get in contact us. <br /> <br />
        All the best,
      </Typography>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack
        spacing={2}
        justifyContent="space-between"
        direction={{ xs: 'column-reverse', sm: 'row' }}
      >
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          onClick={onReset}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Continue Shopping
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Iconify icon="eva:credit-card-fill" />}
          onClick={handlePayment}
          disabled={isLoading} // disable saat loading
        >
          {isLoading ? 'Proses...' : 'Bayar Sekarang'}
        </Button>

        {/* <Button
          fullWidth
          size="large"
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-download-fill" />}
          onClick={onDownloadPDF}
        >
          Download as PDF
        </Button> */}
      </Stack>
    </Stack>
  );

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          fullWidth
          fullScreen
          open={open}
          PaperComponent={(props) => (
            <Box
              component={m.div}
              {...varFade({
                distance: 120,
                durationIn: 0.32,
                durationOut: 0.24,
                easeIn: 'easeInOut',
              }).inUp}
              sx={{
                width: 1,
                height: 1,
                p: { md: 3 },
              }}
            >
              <Paper {...props}>{props.children}</Paper>
            </Box>
          )}
        >
          {renderContent}
        </Dialog>
      )}
    </AnimatePresence>
  );
}

CheckoutOrderComplete.propTypes = {
  open: PropTypes.bool,
  onReset: PropTypes.func,
  children: PropTypes.node,
  onDownloadPDF: PropTypes.func,
};
