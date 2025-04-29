import React, { useState } from 'react';
import { 
  Badge, 
  IconButton, 
  Menu, 
  Typography, 
  Box, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success';
  message: string;
  timestamp: Date;
  read: boolean;
}

const NotificationCenter: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      message: 'Ваш прием у доктора Смирнова запланирован на 20 марта в 10:00',
      timestamp: new Date(2024, 2, 18, 14, 30),
      read: false
    },
    {
      id: '2',
      type: 'warning',
      message: 'Напоминание: завтра сдача анализа крови',
      timestamp: new Date(2024, 2, 17, 9, 15),
      read: false
    },
    {
      id: '3',
      type: 'success',
      message: 'Результаты вашего анализа готовы',
      timestamp: new Date(2024, 2, 16, 16, 45),
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'info':
        return <InfoIcon color="info" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      default:
        return <InfoIcon />;
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'd MMMM, HH:mm', { locale: ru });
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: 360,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Уведомления</Typography>
          {unreadCount > 0 && (
            <Typography 
              variant="body2" 
              color="primary" 
              sx={{ cursor: 'pointer' }}
              onClick={markAllAsRead}
            >
              Отметить все как прочитанные
            </Typography>
          )}
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2">Нет новых уведомлений</Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', p: 0 }}>
            {notifications.map((notification) => (
              <ListItem 
                key={notification.id}
                sx={{ 
                  bgcolor: notification.read ? 'transparent' : 'rgba(0, 0, 0, 0.04)',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' }
                }}
                onClick={() => markAsRead(notification.id)}
              >
                <ListItemIcon>
                  {getIconByType(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={notification.message}
                  secondary={formatDate(notification.timestamp)}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: notification.read ? 'normal' : 'bold'
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
};

export default NotificationCenter; 