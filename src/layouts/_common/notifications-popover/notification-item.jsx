import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
// utils
import { fToNow } from 'src/utils/format-time';
// components
import Label from 'src/components/label';
import { Link } from 'react-router-dom';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function NotificationItem({ notification, onRead, onClose }) {
  const STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Belum Bayar' },
    { value: 'paid', label: 'Dikemas' },
    // { value: 'processing', label: 'Proses' },
    { value: 'shipped', label: 'Dikirim' },
    { value: 'delivered', label: 'Selesai' },
    { value: 'cancellation_requested', label: 'Dibatalkan' },
  ];

  // Function to get status label from STATUS_OPTIONS based on value
  const getStatusLabel = (statusValue) => {
    const statusOption = STATUS_OPTIONS.find((option) => option.value === statusValue);
    return statusOption
      ? statusOption.label
      : statusValue.charAt(0).toUpperCase() + statusValue.slice(1);
  };

  const renderTypeIcon = (type) => {
    switch (type) {
      case 'order_status':
        return 'ic_order';
      case 'payment_status':
        return 'ic_payment';
      case 'chat':
        return 'ic_chat';
      case 'mail':
        return 'ic_mail';
      case 'delivery':
        return 'ic_delivery';
      case 'new_order':
        return 'ic_order';
      default:
        return 'ic_notification';
    }
  };

  const handleClick = () => {
    if (!notification.is_read && onRead) {
      onRead(notification.id);
    }
  };

  // Handle order button click - mark as read and close drawer
  const handleOrderClick = () => {
    if (!notification.is_read && onRead) {
      onRead(notification.id);
    }
    if (onClose) {
      onClose();
    }
  };

  const renderAvatar = (
    <ListItemAvatar>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'background.neutral',
        }}
      >
        <Box
          component="img"
          src={`/assets/icons/notification/${renderTypeIcon(notification.type)}.svg`}
          sx={{ width: 24, height: 24 }}
          onError={(e) => {
            e.target.src = '/assets/icons/notification/ic_notification.svg';
          }}
        />
      </Stack>
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={reader(notification.title)}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
          divider={
            <Box
              sx={{
                width: 2,
                height: 2,
                bgcolor: 'currentColor',
                mx: 0.5,
                borderRadius: '50%',
              }}
            />
          }
        >
          {fToNow(notification.created_at)}
          {notification.data?.status && (
            <Label
              color={
                (notification.data.status === 'delivered' && 'success') ||
                (notification.data.status === 'shipped' && 'info') ||
                (notification.data.status === 'paid' && 'primary') ||
                'default'
              }
              variant="soft"
            >
              {getStatusLabel(notification.data.status)}
            </Label>
          )}
        </Stack>
      }
    />
  );

  const renderUnReadBadge = !notification.is_read && (
    <Box
      sx={{
        top: 26,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: '50%',
        bgcolor: 'info.main',
        position: 'absolute',
      }}
    />
  );

  // Render content based on notification type
  const renderContent = () => {
    switch (notification.type) {
      case 'order_status':
        return (
          <Stack spacing={1} sx={{ mt: 1.5 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                color: 'text.secondary',
                bgcolor: 'background.neutral',
              }}
            >
              {reader(notification.message)}
              {notification.data && (
                <Typography
                  variant="caption"
                  sx={{ display: 'block', mt: 0.5, color: 'text.disabled' }}
                >
                  Order ID: {notification.data.orderId}
                </Typography>
              )}
            </Box>
            {notification.data?.orderId && (
              <Button
                component={Link}
                to={`${paths.dashboard.order.details}/${notification.data.orderId}`}
                size="small"
                variant="contained"
                onClick={handleOrderClick}
              >
                Lihat Order
              </Button>
            )}
          </Stack>
        );
      case 'new_order':
        return (
          <Stack spacing={1} sx={{ mt: 1.5 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                color: 'text.secondary',
                bgcolor: 'background.neutral',
              }}
            >
              {reader(notification.message)}
              {notification.data && notification.data.order_id && (
                <Typography
                  variant="caption"
                  sx={{ display: 'block', mt: 0.5, color: 'text.disabled' }}
                >
                  Order ID: {notification.data.order_id}
                </Typography>
              )}
            </Box>
            {notification.data?.order_id && (
              <Button
                component={Link}
                to={`/riwayat-order/${notification.data.order_id}`}
                size="small"
                variant="contained"
                onClick={handleOrderClick}
              >
                Lihat Order
              </Button>
            )}
          </Stack>
        );
      default:
        // For simple notifications, just show the message
        return notification.message ? (
          <Box
            sx={{
              p: 1.5,
              mt: 1.5,
              borderRadius: 1.5,
              color: 'text.secondary',
              bgcolor: 'background.neutral',
            }}
          >
            {reader(notification.message)}
          </Box>
        ) : null;
    }
  };

  return (
    <ListItemButton
      disableRipple
      onClick={handleClick}
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
      }}
    >
      {renderUnReadBadge}

      {renderAvatar}

      <Stack sx={{ flexGrow: 1 }}>
        {renderText}
        {renderContent()}
      </Stack>
    </ListItemButton>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
  onRead: PropTypes.func,
  onClose: PropTypes.func,
};

// ----------------------------------------------------------------------

function reader(data) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        mb: 0.5,
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
