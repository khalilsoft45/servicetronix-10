
import { Card } from "@/components/ui/card";
import { Clock, CheckCircle2, Bell } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Repair } from "@/types/repair";
import { Notification } from "@/components/dashboard/NotificationsList";

interface StatisticsCardsProps {
  assignedRepairs: Repair[];
  completedRepairs: Repair[];
  notifications: Notification[];
}

const StatisticsCards = ({ assignedRepairs, completedRepairs, notifications }: StatisticsCardsProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex space-x-2">
      <Card className="border p-2 px-3 flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Clock className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium">{assignedRepairs.length}</p>
          <p className="text-xs text-muted-foreground">{t('fixer.assigned')}</p>
        </div>
      </Card>
      <Card className="border p-2 px-3 flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium">{completedRepairs.length}</p>
          <p className="text-xs text-muted-foreground">{t('fixer.completed')}</p>
        </div>
      </Card>
      <Card className="border p-2 px-3 flex items-center space-x-2 relative">
        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <Bell className="h-4 w-4 text-purple-600" />
        </div>
        {notifications.some(n => n.isNew) && (
          <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></div>
        )}
        <div>
          <p className="text-sm font-medium">{notifications.length}</p>
          <p className="text-xs text-muted-foreground">Notifications</p>
        </div>
      </Card>
    </div>
  );
};

export default StatisticsCards;
