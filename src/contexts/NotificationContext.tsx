import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch notifications (would connect to real backend API)
    const fetchNotifications = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock notifications
          const mockNotifications: Notification[] = [
            {
              id: '1',
              title: 'Resource Allocated',
              message: 'Your GPU resource request has been approved and allocated.',
              type: 'success',
              read: false,
              createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            },
            {
              id: '2',
              title: 'Resource Expiring',
              message: 'Your allocated GPU resources will expire in 24 hours.',
              type: 'warning',
              read: false,
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            },
            {
              id: '3',
              title: 'System Maintenance',
              message: 'Scheduled maintenance will occur on Friday, 6PM - 8PM.',
              type: 'info',
              read: true,
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            },
          ];
          setNotifications(mockNotifications);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};