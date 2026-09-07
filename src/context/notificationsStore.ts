import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

export type AppNotification = {
  id: string;
  title: string;
  body?: string;
  createdAt: number;
};

type NotificationsStore = {
  notifications: AppNotification[];
};

const defaults: NotificationsStore = {
  notifications: [],
};

const {
  Provider: NotificationsStoreProvider,
  useStoreSelector: useNotificationsStoreSelector,
  useSetStore,
} = createLocalStorageStoreNg<NotificationsStore>(defaults, 'notificationsStore');

export function useNotifications() {
  const setStore = useSetStore();

  return {
    addNotification: (title: string, body?: string) => {
      setStore((previous) => ({
        notifications: [
          ...previous.notifications,
          {
            id: `${Date.now()}-${Math.random()}`,
            title,
            body,
            createdAt: Date.now(),
          },
        ],
      }));
    },
  };
}

export { NotificationsStoreProvider, useNotificationsStoreSelector };
