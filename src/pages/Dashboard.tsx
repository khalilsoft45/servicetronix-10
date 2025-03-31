import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SummaryCards from "@/components/dashboard/SummaryCards";
import ActionBar from "@/components/dashboard/ActionBar";
import RepairsList from "@/components/dashboard/RepairsList";
import NotificationsList from "@/components/dashboard/NotificationsList";
import ProfileForms from "@/components/dashboard/ProfileForms";
import NewRepairDialog from "@/components/dashboard/NewRepairDialog";
import PriceConfirmationDialog from "@/components/dashboard/PriceConfirmationDialog";
import { Notification } from "@/components/dashboard/NotificationsList";
import { NotificationType } from "@/components/dashboard/NotificationItem";

const sampleRepairs = [
  {
    id: "REP-001",
    device: "MacBook Pro 2019",
    issue: "Screen not working properly, shows lines",
    status: "in_repair" as const,
    dateCreated: "12 Jun 2023",
    lastUpdated: "15 Jun 2023",
    assignedFixer: "John Smith",
  },
  {
    id: "REP-002",
    device: "iPhone 12",
    issue: "Battery draining too quickly",
    status: "completed" as const,
    dateCreated: "05 May 2023",
    lastUpdated: "10 May 2023",
    price: 85,
    fixerNotes: "Replaced battery and cleaned internal components to improve heat dissipation",
    assignedFixer: "Jane Doe",
  },
  {
    id: "REP-003",
    device: "Samsung Galaxy S21",
    issue: "Cracked screen needs replacement",
    status: "awaiting_collection" as const,
    dateCreated: "20 Jun 2023",
    lastUpdated: "20 Jun 2023",
  },
  {
    id: "REP-004",
    device: "iPad Pro 2021",
    issue: "Not charging when plugged in",
    status: "pending_confirmation" as const,
    dateCreated: "22 Jun 2023",
    lastUpdated: "22 Jun 2023",
  },
  {
    id: "REP-005",
    device: "Dell XPS 13",
    issue: "Keyboard not responding correctly",
    status: "waiting_price_confirmation" as const,
    dateCreated: "18 Jun 2023",
    lastUpdated: "21 Jun 2023",
    price: 120,
    assignedFixer: "Mike Johnson",
  },
  {
    id: "REP-006",
    device: "Google Pixel 6",
    issue: "Camera not focusing properly",
    status: "repair_in_progress" as const,
    dateCreated: "15 Jun 2023",
    lastUpdated: "23 Jun 2023",
    price: 95,
    assignedFixer: "Sarah Williams",
  },
];

const sampleNotifications = [
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

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [repairs] = useState(sampleRepairs);
  const [notifications] = useState(sampleNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newRepairForm, setNewRepairForm] = useState({
    deviceType: "",
    deviceModel: "",
    issue: "",
    additionalInfo: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [priceConfirmDialog, setPriceConfirmDialog] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("repairs");

  const handleRepairFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRepairForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRepairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API request
    setTimeout(() => {
      toast({
        title: "Repair request submitted!",
        description: "A phone operator will contact you soon to confirm the details.",
      });
      setDialogOpen(false);
      setNewRepairForm({
        deviceType: "",
        deviceModel: "",
        issue: "",
        additionalInfo: "",
      });
    }, 1000);
  };

  const handleNotificationClick = (notification: Notification) => {
    const repair = repairs.find(r => r.id === notification.repairId);
    if (repair && repair.status === "waiting_price_confirmation") {
      setSelectedRepair(repair);
      setPriceConfirmDialog(true);
    } else {
      toast({
        title: "Notification viewed",
        description: `You viewed notification about ${notification.repairId}`,
      });
    }
  };

  const handlePriceConfirm = (accept: boolean) => {
    toast({
      title: accept ? "Price accepted" : "Price rejected",
      description: accept 
        ? "The technician will proceed with the repair." 
        : "The device will be returned without repair.",
    });
    setPriceConfirmDialog(false);
  };

  const filteredRepairs = repairs.filter((repair) => {
    const matchesSearch = searchQuery === "" || 
      repair.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || repair.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const completedCount = repairs.filter(r => r.status === "completed").length;
  const inProgressCount = repairs.filter(r => [
    "in_repair", 
    "awaiting_collection", 
    "fixed_awaiting_delivery",
    "repair_in_progress",
    "price_confirmed_in_repair"
  ].includes(r.status as any)).length;
  const pendingCount = repairs.filter(r => [
    "pending_confirmation",
    "waiting_price_confirmation"
  ].includes(r.status as any)).length;

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid gap-6">
        <SummaryCards 
          totalRepairs={repairs.length} 
          completedCount={completedCount} 
          pendingCount={pendingCount} 
        />
        
        <ActionBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onRequestRepairClick={() => setDialogOpen(true)}
        />
        
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
              onNotificationClick={handleNotificationClick}
            />
          </TabsContent>
          
          <TabsContent value="profile">
            <ProfileForms userData={user || { name: "", email: "" }} />
          </TabsContent>
        </Tabs>
      </div>
      
      <NewRepairDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleRepairSubmit}
        formData={newRepairForm}
        onFormChange={handleRepairFormChange}
      />
      
      <PriceConfirmationDialog 
        open={priceConfirmDialog}
        onOpenChange={setPriceConfirmDialog}
        selectedRepair={selectedRepair}
        onConfirm={handlePriceConfirm}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
