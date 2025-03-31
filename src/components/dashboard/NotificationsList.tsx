
import { Card, CardContent } from "@/components/ui/card";
import NotificationItem, { NotificationType } from "@/components/dashboard/NotificationItem";
import { Bell } from "lucide-react";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isNew: boolean;
  repairId: string;
}

interface NotificationsListProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

const NotificationsList = ({ notifications, onNotificationClick }: NotificationsListProps) => {
  return (
    <div className="space-y-4">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            id={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            time={notification.time}
            isNew={notification.isNew}
            onClick={() => onNotificationClick(notification)}
          />
        ))
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <Bell className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500">No notifications yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationsList;
