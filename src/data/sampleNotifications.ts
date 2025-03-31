
import { NotificationType } from "@/components/dashboard/NotificationItem";

export const sampleNotifications = [
  {
    id: "NOTIF-001",
    type: "info" as NotificationType,
    title: "Price Set for Your Repair",
    message: "The technician has set a price of $120 for your Dell XPS repair. Please confirm if you accept.",
    time: "2 hours ago",
    isNew: true,
    repairId: "REP-005"
  },
  {
    id: "NOTIF-002",
    type: "success" as NotificationType,
    title: "Repair Completed",
    message: "Your iPhone 12 has been successfully repaired and is ready for delivery.",
    time: "1 day ago",
    isNew: false,
    repairId: "REP-002"
  },
  {
    id: "NOTIF-003",
    type: "alert" as NotificationType,
    title: "Device Collection Scheduled",
    message: "A collector will pick up your Samsung Galaxy S21 tomorrow between 10 AM and 2 PM.",
    time: "3 days ago",
    isNew: false,
    repairId: "REP-003"
  }
];
