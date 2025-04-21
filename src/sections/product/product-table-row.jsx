import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
// utils
import { fCurrency } from 'src/utils/format-number';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Tooltip, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const {
    name,
    sku,
    description,
    stock,
    images,
    videos,
    size,
    color,
    created_at,
    price,
    publish,
    status,
    coverUrl,
    category_id,
    quantity,
    createdAt,
    available,
    categories,
    inventoryType,
    categories_id,
  } = row;

  const imageSrc = images?.[0]?.image_url || videos?.[0]?.video_url || '/placeholder.png'; // fallback ke placeholder

  const translateInventoryType = (type) => {
    switch (type) {
      case 'available':
        return 'Tersedia';
      case 'out of stock':
        return 'Habis';
      case 'low stock':
        return 'Stok Menipis';
      default:
        return type; // Kalau tidak ketemu, tetap pakai original
    }
  };

  const availableStock = stock.available ?? stock.quantity;
  const progressColor =
    availableStock === 0 ? 'error' : inventoryType === 'low stock' ? 'warning' : 'success';

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={name}
            src={imageSrc}
            variant="rounded"
            sx={{ width: 64, height: 64, mr: 2 }}
          />

          <ListItemText
            disableTypography
            primary={
              <Link
                noWrap
                color="inherit"
                variant="subtitle2"
                onClick={onViewRow}
                sx={{ cursor: 'pointer' }}
              >
                {name}
              </Link>
            }
            secondary={
              <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
                {categories.name}
              </Box>
            }
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

        <TableCell sx={{ typography: 'caption', color: 'text.secondary' }}>
          <LinearProgress
            value={(availableStock * 100) / stock.quantity}
            variant="determinate"
            color={progressColor}
            sx={{ mb: 1, height: 6, maxWidth: 80 }}
          />
          {/* Tampilkan available + status dalam bahasa Indonesia */}
          {!!(stock.available ?? stock.quantity) && (stock.available ?? stock.quantity)}{' '}
          {translateInventoryType(stock.status)}
        </TableCell>

        <TableCell
          align="right"
          sx={{
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <Tooltip title={fCurrency(price)} arrow enterTouchDelay={0}>
            <Typography variant="body2" noWrap>
              {fCurrency(price)}
            </Typography>
          </Tooltip>
        </TableCell>

        <TableCell>
          <Label variant="soft" color={(publish === 'published' && 'info') || 'default'}>
            {status}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

ProductTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
