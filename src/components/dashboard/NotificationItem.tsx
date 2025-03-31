
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Bell, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationType = "info" | "alert" | "success" | "warning";

export interface NotificationItemProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isNew?: boolean;
  onClick?: () => void;
}

const NotificationItem = ({
  type,
  title,
  message,
  time,
  isNew = false,
  onClick,
}: NotificationItemProps) => {
  const getTypeInfo = (type: NotificationType) => {
    switch (type) {
      case "info":
        return {
          icon: Info,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
        };
      case "alert":
        return {
          icon: Bell,
          color: "text-purple-500",
          bgColor: "bg-purple-50",
        };
      case "success":
        return {
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-50",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "text-yellow-500",
          bgColor: "bg-yellow-50",
        };
      default:
        return {
          icon: Info,
          color: "text-gray-500",
          bgColor: "bg-gray-50",
        };
    }
  };

  const typeInfo = getTypeInfo(type);
  const Icon = typeInfo.icon;

  return (
    <Card 
      className={cn(
        "relative border cursor-pointer hover:shadow-md transition-all", 
        isNew && "border-blue-200"
      )}
      onClick={onClick}
    >
      {isNew && (
        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500"></div>
      )}
      <CardContent className="p-4 flex items-start gap-3">
        <div className={cn("p-2 rounded-full", typeInfo.bgColor)}>
          <Icon className={cn("h-4 w-4", typeInfo.color)} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" /> {time}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationItem;
