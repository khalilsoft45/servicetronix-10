
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RepairsList from "@/components/dashboard/RepairsList";
import NotificationsList from "@/components/dashboard/NotificationsList";
import ProfileForms from "@/components/dashboard/ProfileForms";
import { Notification } from "@/components/dashboard/NotificationsList";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredRepairs: any[];
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  userData: { name: string; email: string } | null;
}

const DashboardTabs = ({
  activeTab,
  setActiveTab,
  filteredRepairs,
  notifications,
  onNotificationClick,
  userData
}: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="repairs">My Repairs</TabsTrigger>
        <TabsTrigger value="notifications" className="relative">
          Notifications
          {notifications.some(n => n.isNew) && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></span>
          )}
        </TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>
      
      <TabsContent value="repairs" className="space-y-4">
        <RepairsList repairs={filteredRepairs} />
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationsList 
          notifications={notifications} 
          onNotificationClick={onNotificationClick}
        />
      </TabsContent>
      
      <TabsContent value="profile">
        <ProfileForms userData={userData || { name: "", email: "" }} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
