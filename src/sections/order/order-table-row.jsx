import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fCurrency } from 'src/utils/format-number';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useMutationUpdateOrderStatus } from 'src/utils/order';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------------------------

export default function OrderTableRow({
  updateStatus,
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}) {
  const {
    items,
    status,
    orderNumber,
    createdAt,
    created_at,
    customer,
    totalQuantity,
    subTotal,
    user,
    total_price,
    id,
    users_id,
  } = row;

  // const { enqueueSnackbar } = useSnackbar();
  // const queryClient = useQueryClient();
  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();
  const statusPopover = usePopover();

  const handleChangeStatus = async (newStatus) => {
    statusPopover.onClose();
    try {
      await updateStatus({
        id: row.id, // id dari order
        status: newStatus,
        users_id: users_id,
      });

      // enqueueSnackbar('Status berhasil diubah!');
      // queryClient.invalidateQueries({ queryKey: ['order'] });
      // queryClient.invalidateQueries({ queryKey: ['fetch.cart'] });
    } catch (error) {
      // enqueueSnackbar(error?.message || 'Gagal mengubah status', { variant: 'error' });
    }
  };

  const statusLabel = {
    pending: 'Belum Bayar',
    paid: 'Dikemas',
    shipped: 'Dikirim',
    delivered: 'Selesai',
    canceled: 'Dibatalkan',
  };

  const renderPrimary = (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {id}
        </Box>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ mr: 2 }} alt={user.name} src={user.photo_profile} />

        <ListItemText
          primary={user.name}
          secondary={user.email}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={format(new Date(created_at), 'dd MMM yyyy')}
          secondary={format(new Date(created_at), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center"> {items.quantity} </TableCell>

      <TableCell> {fCurrency(total_price)} </TableCell>

      <TableCell>
        {/* Ini Popover untuk Status */}
        <CustomPopover
          open={statusPopover.open}
          onClose={statusPopover.onClose}
          sx={{ width: 160 }}
        >
          {['pending', 'paid', 'shipped', 'delivered', 'canceled'].map((option) => (
            <MenuItem
              key={option}
              onClick={() => handleChangeStatus(option)}
              selected={option === status}
              sx={{ typography: 'body2', textTransform: 'capitalize' }}
            >
              {statusLabel[option] || option}
            </MenuItem>
          ))}
        </CustomPopover>

        <Label
          variant="soft"
          color={
            (status === 'pending' && 'warning') ||
            (status === 'paid' && 'info') ||
            (status === 'shipped' && 'primary') ||
            (status === 'delivered' && 'success') ||
            (status === 'canceled' && 'error') ||
            'default'
          }
          onClick={statusPopover.onOpen}
          sx={{
            textTransform: 'capitalize',
            cursor: 'pointer',
          }}
        >
          {statusLabel[status] || status}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {items.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                  },
                }}
              >
                <Avatar
                  src={item?.product?.images?.[0]?.image_url}
                  variant="rounded"
                  sx={{ width: 48, height: 48, mr: 2 }}
                />

                <ListItemText
                  primary={item.product.name}
                  secondary={item.sku}
                  primaryTypographyProps={{
                    typography: 'body2',
                  }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                />

                <Box>x{item.quantity}</Box>

                <Box sx={{ width: 110, textAlign: 'right' }}>{fCurrency(item.product.price)}</Box>
              </Stack>
            ))}
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Lihat
        </MenuItem>
      </CustomPopover>

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      /> */}
    </>
  );
}

OrderTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
