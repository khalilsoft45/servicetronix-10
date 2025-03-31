
import { Repair } from "@/types/repair";
import { Notification } from "@/components/dashboard/NotificationsList";
import NotificationsList from "@/components/dashboard/NotificationsList";

interface NotificationsTabProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

const NotificationsTab = ({ notifications, onNotificationClick }: NotificationsTabProps) => {
  return (
    <NotificationsList 
      notifications={notifications}
      onNotificationClick={onNotificationClick}
    />
  );
};

export default NotificationsTab;
