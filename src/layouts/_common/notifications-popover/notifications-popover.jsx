import { m } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';
//
import NotificationItem from './notification-item';
import {
  useFetchNontificationAll,
  useFetchUnreadNontification,
  useMutationReadAll,
  useMutationReadById,
} from 'src/utils/nontification';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const drawer = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const smUp = useResponsive('up', 'sm');

  const [currentTab, setCurrentTab] = useState('all');

  // State for notifications data
  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState([]);

  // Setup mutations for reading notifications
  const { mutate: readAll } = useMutationReadAll({
    onSuccess: () => {
      enqueueSnackbar('All notifications marked as read!', { variant: 'success' });
      // Immediately invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['all.nontification'] });
      queryClient.invalidateQueries({ queryKey: ['unread.nontification'] });
    },
    onError: (error) => {
      console.error('Error marking all as read:', error);
      enqueueSnackbar('Failed to mark notifications as read!', { variant: 'error' });
    },
  });

  const { mutate: readById } = useMutationReadById({
    onSuccess: () => {
      // Immediately invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['all.nontification'] });
      queryClient.invalidateQueries({ queryKey: ['unread.nontification'] });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
      enqueueSnackbar('Failed to mark notification as read!', { variant: 'error' });
    },
  });

  // Fetch notifications query hooks
  const allNotificationsQuery = useFetchNontificationAll();
  const unreadNotificationQuery = useFetchUnreadNontification();

  // Effect to update state when data changes
  useEffect(() => {
    if (allNotificationsQuery.data) {
      setAllNotifications(allNotificationsQuery.data);
      // Filter unread notifications
      setUnreadNotifications(
        allNotificationsQuery.data.filter((notification) => !notification.is_read)
      );
    }
  }, [allNotificationsQuery.data]);

  useEffect(() => {
    if (unreadNotificationQuery.data) {
      setUnreadCount(unreadNotificationQuery.data.count || 0);
    }
  }, [unreadNotificationQuery.data]);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleMarkAllAsRead = () => {
    readAll();
  };

  const handleReadNotification = (id) => {
    readById(id);
  };

  // Get total count
  const allCount = allNotifications.length;

  // Define tabs with dynamic counts
  const TABS = [
    {
      value: 'all',
      label: 'All',
      count: allCount,
    },
    {
      value: 'unread',
      label: 'Unread',
      count: unreadCount,
    },
  ];

  // Get notifications based on current tab
  const getNotifications = () => {
    switch (currentTab) {
      case 'unread':
        return unreadNotifications;
      default:
        return allNotifications;
    }
  };

  const currentNotifications = getNotifications();

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {!!unreadCount && (
        <Tooltip title="Mark all as read">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  const renderTabs = (
    <Tabs value={currentTab} onChange={handleChangeTab}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'}
              color={(tab.value === 'unread' && 'info') || 'default'}
            >
              {tab.count}
            </Label>
          }
          sx={{
            '&:not(:last-of-type)': {
              mr: 3,
            },
          }}
        />
      ))}
    </Tabs>
  );

  const renderList = (
    <Scrollbar>
      <List disablePadding>
        {currentNotifications.length > 0 ? (
          currentNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={handleReadNotification}
              onClose={drawer.onFalse}
            />
          ))
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle1">No notifications</Typography>
          </Box>
        )}
      </List>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={unreadCount} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}

        <Divider />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pl: 2.5, pr: 1 }}
        >
          {renderTabs}
          {/* <IconButton>
            <Iconify icon="solar:settings-bold-duotone" />
          </IconButton> */}
        </Stack>

        <Divider />

        {renderList}

        {currentNotifications.length > 0 && (
          <Box sx={{ p: 1 }}>
            <Button fullWidth size="large">
              View All
            </Button>
          </Box>
        )}
      </Drawer>
    </>
  );
}
