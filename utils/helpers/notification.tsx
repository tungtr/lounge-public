// Essentials
import { notifications } from '@mantine/notifications';
import type { NotificationProps } from '@mantine/notifications/lib/types';

// Assets
import { LuX, LuCheck, LuInfo } from 'react-icons/lu';

export const getNotificationProps = ({
  title,
  message,
  status,
}: {
  title: string,
  message: string,
  status: string
}): NotificationProps => {
  let color = 'purple'; let icon = null;
  switch (status) {
    case 'success':
      color = 'green';
      icon = <LuCheck />;
      break;
    case 'error':
      color = 'red';
      icon = <LuX />;
      break;
    default:
      color = 'purple';
      icon = <LuInfo />
  };

  return {
    autoClose: message.length * 150,
    color,
    icon,
    loading: false,
    message,
    radius: 'lg',
    style: { padding: '16px' },
    title,
    withBorder: true,
    withCloseButton: true,
  };
};

export const showNotification = ({
  title,
  message,
  status,
}: {
  title: string,
  message: string,
  status: string
}) => {
  notifications.show(getNotificationProps({ title, message, status }));
};