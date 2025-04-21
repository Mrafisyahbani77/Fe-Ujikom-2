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

// ----------------------------------------------------------------------

export default function NotificationItem({ notification, onRead, onClose }) {
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
              {notification.data.status.charAt(0).toUpperCase() + notification.data.status.slice(1)}
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
                to={`/riwayat-order/${notification.data.orderId}`}
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
