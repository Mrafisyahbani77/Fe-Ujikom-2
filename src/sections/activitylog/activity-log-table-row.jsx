import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function ActivityLogTableRow({ row }) {
  const { username, action, description, ip_address, created_at, role } = row;

  // Function to get label color based on action type
  const getLabelColor = (actionType) => {
    if (actionType.includes('create')) return 'success';
    if (actionType.includes('update')) return 'warning';
    if (actionType.includes('delete')) return 'error';
    return 'info';
  };

  // Function to format action type for display
  const formatActionType = (actionType) => {
    return actionType
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="column" spacing={0.5}>
          <Typography variant="subtitle2">{username}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {role}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Label color={getLabelColor(action)}>{formatActionType(action)}</Label>
      </TableCell>

      <TableCell>{description}</TableCell>

      <TableCell>{ip_address}</TableCell>

      <TableCell>{format(new Date(created_at), 'dd MMM yyyy, HH:mm:ss')}</TableCell>
    </TableRow>
  );
}

ActivityLogTableRow.propTypes = {
  row: PropTypes.object,
};
