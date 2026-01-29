'use client';

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  useTheme,
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Warning,
  Error,
  Info,
  DoneAll,
  DeleteSweep,
} from '@mui/icons-material';
import { useNotificationsStore } from '@/store';
import { formatRelativeTime } from '@/lib/utils';

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const notificationIcons = {
  success: <CheckCircle />,
  warning: <Warning />,
  error: <Error />,
  info: <Info />,
};

const notificationColors = {
  success: 'success.main',
  warning: 'warning.main',
  error: 'error.main',
  info: 'info.main',
};

export default function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const theme = useTheme();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationsStore();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 380 },
          maxWidth: '100vw',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Typography variant="caption" color="text.secondary">
                {unreadCount} unread
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {/* Actions */}
        {notifications.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              p: 1,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              size="small"
              startIcon={<DoneAll />}
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              sx={{ flex: 1 }}
            >
              Mark all read
            </Button>
            <Button
              size="small"
              startIcon={<DeleteSweep />}
              onClick={clearAll}
              color="error"
              sx={{ flex: 1 }}
            >
              Clear all
            </Button>
          </Box>
        )}

        {/* Notifications list */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 3,
              }}
            >
              <Info sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                No notifications
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    py: 2,
                    px: 2,
                    bgcolor: notification.read ? 'transparent' : `${theme.palette.primary.main}08`,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: theme.palette.action.hover,
                    },
                  }}
                  onClick={() => markAsRead(notification.id)}
                  secondaryAction={
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: `${notificationColors[notification.type]}20`,
                        color: notificationColors[notification.type],
                      }}
                    >
                      {notificationIcons[notification.type]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle2"
                        fontWeight={notification.read ? 400 : 600}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {formatRelativeTime(notification.timestamp)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
