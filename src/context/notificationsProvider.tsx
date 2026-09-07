import {
  NotificationsStoreProvider,
  useNotificationsStoreSelector,
} from '@/context/notificationsStore';
import { useEffect, useRef } from 'react';

function NotificationsEffect({ children }: { children: React.ReactNode }) {
  const notifications = useNotificationsStoreSelector((state) => state.notifications);
  const seenNotificationIds = useRef(new Set<string>());
  const initialized = useRef(false);

  useEffect(() => {
    const newNotifications = notifications.filter(
      (notification) => !seenNotificationIds.current.has(notification.id),
    );

    newNotifications.forEach((notification) => {
      seenNotificationIds.current.add(notification.id);
    });

    if (!initialized.current) {
      initialized.current = true;
      return;
    }

    newNotifications.forEach((notification) => {
      if (typeof window === 'undefined' || !('Notification' in window)) return;

      const show = () => {
        if (window.Notification.permission === 'granted') {
          new window.Notification(notification.title, { body: notification.body });
        }
      };

      if (window.Notification.permission === 'default') {
        void window.Notification.requestPermission().then((permission) => {
          if (permission === 'granted') show();
        });
      } else {
        show();
      }
    });
  }, [notifications]);

  return children;
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  return (
    <NotificationsStoreProvider>
      <NotificationsEffect>{children}</NotificationsEffect>
    </NotificationsStoreProvider>
  );
}
