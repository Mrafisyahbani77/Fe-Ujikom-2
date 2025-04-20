import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// routes
import { RouterLink } from 'src/routes/components';
// utils
import { fDateTime } from 'src/utils/format-time';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useDownloadInvoice, useMutationCreateInvoice } from 'src/utils/order';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------------------------

export default function OrderDetailsToolbar({
  status,
  backLink,
  createdAt,
  orderNumber,
  statusOptions,
  onChangeStatus,
}) {
  const popover = usePopover();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const STATUS_OPTIONS = [
    { value: 'all', label: 'Semua', color: 'default' },
    { value: 'pending', label: 'Belum Bayar', color: 'warning' },
    { value: 'paid', label: 'Dikemas', color: 'warning' },
    { value: 'shipped', label: 'Dikirim', color: 'info' },
    { value: 'delivered', label: 'Selesai', color: 'success' },
    { value: 'cancellation_requested', label: 'Dibatalkan', color: 'error' },
  ];

  const getStatusLabel = (status) => {
    const found = STATUS_OPTIONS.find((opt) => opt.value === status);
    return found ? found.label : status;
  };

  const getStatusColor = (status) => {
    const found = STATUS_OPTIONS.find((opt) => opt.value === status);
    return found ? found.color : 'default';
  };

  const { mutate: generateInvoice } = useMutationCreateInvoice({
    onSuccess: async () => {
      enqueueSnackbar('Invoice berhasil di generate', { variant: 'success' });
      queryClient.invalidateQueries(['order']);

      try {
        const fileData = await useDownloadInvoice(orderNumber);
        const blob = new Blob([fileData], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${orderNumber}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Failed to download invoice', { variant: 'error' });
      }
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || 'Failed to generate invoice', {
        variant: 'error',
      });
    },
  });

  const handleGenerate = () => {
    generateInvoice({ order_id: orderNumber });
  };

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4"> Order {orderNumber} </Typography>
              <Label variant="soft" color={getStatusColor(status)}>
                {getStatusLabel(status)}
              </Label>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDateTime(createdAt)}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          flexGrow={1}
          spacing={1.5}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {/* <Button
            color="inherit"
            variant="outlined"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={popover.onOpen}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Button> */}

          <Button
            color="inherit"
            type="submit"
            variant="outlined"
            onClick={handleGenerate}
            startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
          >
            Print
          </Button>

          {/* <Button color="inherit" variant="contained" startIcon={<Iconify icon="solar:pen-bold" />}>
            Edit
          </Button> */}
        </Stack>
      </Stack>

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === status}
            onClick={() => {
              popover.onClose();
              onChangeStatus(option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover> */}
    </>
  );
}

OrderDetailsToolbar.propTypes = {
  backLink: PropTypes.string,
  createdAt: PropTypes.instanceOf(Date),
  onChangeStatus: PropTypes.func,
  orderNumber: PropTypes.string,
  status: PropTypes.string,
  statusOptions: PropTypes.array,
};
