import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import UserQuickEditForm from './user-quick-edit-form';
import { useMutationBanned, useMutationUnban } from 'src/utils/users';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------------------------

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const {
    username,
    avatarUrl,
    company,
    role,
    status,
    email,
    phoneNumber,
    phone_number,
    profile_photo,
    gender,
    is_active,
    is_banned,
  } = row;

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  const statusPopover = usePopover();

  // Mapping label untuk status
  const statusLabel = {
    banned: 'Banned',
    active: 'Active',
  };

  const { mutate: banned } = useMutationBanned({
    onSuccess: () => {
      enqueueSnackbar('User berhasil di ban', {
        variant: 'success',
      });
      queryClient.invalidateQueries(['fetch.alluser']);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const { mutate: unban } = useMutationUnban({
    onSuccess: () => {
      enqueueSnackbar('User berhasil di unban', {
        variant: 'success',
      });
      queryClient.invalidateQueries(['fetch.alluser']);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Terjadi kesalahan';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });

  const handleChangeBanStatus = (action) => {
    if (action === 'ban') {
      banned({ id: row.id });
    } else if (action === 'unban') {
      unban({ id: row.id });
    }
    statusPopover.onClose();
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={username} src={profile_photo} sx={{ mr: 2 }} />

          <ListItemText
            primary={username}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phone_number}</TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{company}</TableCell> */}

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{role}</TableCell>

        {/* <TableCell>
          <Label color={is_banned ? 'error' : is_active ? 'success' : 'default'}>
            {is_banned ? 'Banned' : is_active ? 'Active' : 'Inactive'}
          </Label>
        </TableCell> */}
        <TableCell>
          {/* Ini Popover untuk Ban/Unban */}
          <CustomPopover
            open={statusPopover.open}
            onClose={statusPopover.onClose}
            sx={{ width: 160 }}
          >
            {is_banned ? (
              <MenuItem
                onClick={() => handleChangeBanStatus('unban')}
                sx={{ typography: 'body2', textTransform: 'capitalize' }}
              >
                Unban User
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => handleChangeBanStatus('ban')}
                sx={{ typography: 'body2', textTransform: 'capitalize' }}
              >
                Ban User
              </MenuItem>
            )}
          </CustomPopover>

          {/* Label Status */}
          <Label
            variant="soft"
            color={is_banned ? 'error' : is_active ? 'success' : 'default'}
            onClick={statusPopover.onOpen}
            sx={{
              textTransform: 'capitalize',
              cursor: 'pointer',
            }}
          >
            {is_banned ? statusLabel['banned'] : statusLabel['active']}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
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

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
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

UserTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
