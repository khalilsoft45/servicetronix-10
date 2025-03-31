import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Repair, RepairStatus } from "@/types/repair";
import { Notification } from "@/components/dashboard/NotificationsList";
import { NotificationType } from "@/components/dashboard/NotificationItem";

// Extracted components
import SearchBar from "@/components/fixer-dashboard/SearchBar";
import StatisticsCards from "@/components/fixer-dashboard/StatisticsCards";
import RepairsTab from "@/components/fixer-dashboard/RepairsTab";
import CompletedRepairsTab from "@/components/fixer-dashboard/CompletedRepairsTab";
import NotificationsTab from "@/components/fixer-dashboard/NotificationsTab";
import RepairDetailsDialog from "@/components/fixer-dashboard/RepairDetailsDialog";
import SetPriceDialog from "@/components/fixer-dashboard/SetPriceDialog";
import CompleteRepairDialog from "@/components/fixer-dashboard/CompleteRepairDialog";

// Sample assigned repairs data
const assignedRepairsData: Repair[] = [
  {
    id: "REP-001",
    clientName: "John Doe",
    deviceType: "MacBook Pro 2020",
    issue: "Screen not working, shows lines across the display when turned on.",
    status: "assigned",
    dateAssigned: "2023-06-15",
    estimatedCompletion: "",
    price: null,
    notes: "",
  },
  {
    id: "REP-002",
    clientName: "Jane Smith",
    deviceType: "iPhone 13",
    issue: "Battery drains extremely quickly, even when not in use.",
    status: "in_progress",
    dateAssigned: "2023-06-12",
    estimatedCompletion: "2023-06-18",
    price: 85,
    notes: "Ordered replacement battery, should arrive tomorrow.",
  },
  {
    id: "REP-003",
    clientName: "Michael Wilson",
    deviceType: "Samsung Galaxy S22",
    issue: "Cracked screen needs replacement.",
    status: "waiting_for_parts",
    dateAssigned: "2023-06-10",
    estimatedCompletion: "2023-06-20",
    price: 150,
    notes: "Waiting for replacement screen to arrive from supplier.",
  },
  {
    id: "REP-007",
    clientName: "Sarah Johnson",
    deviceType: "HP Spectre x360",
    issue: "Laptop not powering on at all.",
    status: "assigned",
    dateAssigned: "2023-06-16",
    estimatedCompletion: "",
    price: null,
    notes: "",
  },
  {
    id: "REP-008",
    clientName: "Robert Davis",
    deviceType: "iPad Air 2022",
    issue: "Touch screen unresponsive in certain areas.",
    status: "waiting_client_approval",
    dateAssigned: "2023-06-14",
    estimatedCompletion: "2023-06-19",
    price: 110,
    notes: "Need to replace touch digitizer.",
  },
];

// Sample completed repairs data
const completedRepairsData: Repair[] = [
  {
    id: "REP-004",
    clientName: "Emily Johnson",
    deviceType: "Dell XPS 15",
    issue: "Keyboard not responding to certain keys.",
    status: "completed",
    dateAssigned: "2023-05-28",
    dateCompleted: "2023-06-02",
    price: 120,
    notes: "Replaced keyboard assembly.",
  },
  {
    id: "REP-005",
    clientName: "Robert Brown",
    deviceType: "iPad Pro 2021",
    issue: "Charging port damaged.",
    status: "completed",
    dateAssigned: "2023-06-05",
    dateCompleted: "2023-06-08",
    price: 90,
    notes: "Replaced charging port and tested with multiple cables.",
  },
];

// Sample notifications
const sampleNotifications: Notification[] = [
  {
    id: "NOTIF-001",
    type: "info" as NotificationType,
    title: "New Repair Assigned",
    message: "You've been assigned to repair HP Spectre x360 (REP-007).",
    time: "1 hour ago",
    isNew: true,
    repairId: "REP-007"
  },
  {
    id: "NOTIF-002",
    type: "success" as NotificationType,
    title: "Repair Price Approved",
    message: "The client has approved the price for REP-002. You can proceed with the repair.",
    time: "3 hours ago",
    isNew: true,
    repairId: "REP-002"
  },
  {
    id: "NOTIF-003",
    type: "warning" as NotificationType,
    title: "Repair Price Rejected",
    message: "The client has rejected the price for iPad repair. The device will be returned.",
    time: "1 day ago",
    isNew: false,
    repairId: "REP-008"
  }
];

const FixerDashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [assignedRepairs, setAssignedRepairs] = useState<Repair[]>(assignedRepairsData);
  const [completedRepairs, setCompletedRepairs] = useState<Repair[]>(completedRepairsData);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [repairDetails, setRepairDetails] = useState<Repair | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [priceForm, setPriceForm] = useState({
    price: "",
    estimatedCompletion: "",
    notes: "",
  });
  const [completeForm, setCompleteForm] = useState({
    notes: "",
  });

  const handleViewDetails = (repair: Repair) => {
    setRepairDetails(repair);
    setDetailsOpen(true);
  };

  const handleSetPrice = (repair: Repair) => {
    setRepairDetails(repair);
    setPriceForm({
      price: repair.price ? String(repair.price) : "",
      estimatedCompletion: repair.estimatedCompletion || "",
      notes: repair.notes || "",
    });
    setPriceDialogOpen(true);
  };

  const handleCompleteRepair = (repair: Repair) => {
    setRepairDetails(repair);
    setCompleteForm({
      notes: repair.notes || "",
    });
    setCompleteDialogOpen(true);
  };

  const handlePriceSubmit = () => {
    const updatedRepairs = assignedRepairs.map(repair => {
      if (repair.id === repairDetails?.id) {
        return {
          ...repair,
          price: parseFloat(priceForm.price),
          estimatedCompletion: priceForm.estimatedCompletion,
          notes: priceForm.notes,
          status: "waiting_client_approval" as RepairStatus,
        };
      }
      return repair;
    });

    setAssignedRepairs(updatedRepairs);
    setPriceDialogOpen(false);
    toast({
      title: "Price set successfully",
      description: `Price for repair ${repairDetails?.id} has been set to $${priceForm.price}`,
    });
  };

  const handleCompleteSubmit = () => {
    // Find the repair to mark as complete
    const repairToComplete = assignedRepairs.find(repair => repair.id === repairDetails?.id);
    if (!repairToComplete) return;

    // Remove from assigned repairs
    setAssignedRepairs(assignedRepairs.filter(repair => repair.id !== repairDetails?.id));

    // Add to completed repairs with today's date
    setCompletedRepairs([
      {
        ...repairToComplete,
        status: "completed" as RepairStatus,
        dateCompleted: new Date().toISOString().split('T')[0],
        notes: completeForm.notes,
      },
      ...completedRepairs,
    ]);

    setCompleteDialogOpen(false);
    toast({
      title: "Repair marked as complete",
      description: `Repair ${repairDetails?.id} has been marked as completed.`,
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    const repair = [...assignedRepairs, ...completedRepairs].find(r => r.id === notification.repairId);
    if (repair) {
      setRepairDetails(repair);
      setDetailsOpen(true);
      
      // Mark notification as read
      setNotifications(
        notifications.map(n => 
          n.id === notification.id ? { ...n, isNew: false } : n
        )
      );
    }
  };

  const filteredAssignedRepairs = assignedRepairs.filter(repair => {
    return (
      repair.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.deviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.issue.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredCompletedRepairs = completedRepairs.filter(repair => {
    return (
      repair.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.deviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.issue.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "assigned":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Assigned</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Progress</Badge>;
      case "waiting_for_parts":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Waiting for Parts</Badge>;
      case "waiting_client_approval":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Waiting for Approval</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t('fixer.dashboard')}</h2>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <Link to="/">
              <Button>{t('app.back.home')}</Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <StatisticsCards 
            assignedRepairs={assignedRepairs} 
            completedRepairs={completedRepairs} 
            notifications={notifications} 
          />
        </div>

        <Tabs defaultValue="assigned" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assigned">{t('fixer.assigned.repairs')}</TabsTrigger>
            <TabsTrigger value="completed">{t('fixer.completed.repairs')}</TabsTrigger>
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {notifications.some(n => n.isNew) && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Assigned Repairs Tab */}
          <TabsContent value="assigned" className="space-y-4">
            <RepairsTab 
              filteredRepairs={filteredAssignedRepairs} 
              onViewDetails={handleViewDetails}
              onSetPrice={handleSetPrice}
              onCompleteRepair={handleCompleteRepair}
            />
          </TabsContent>

          {/* Completed Repairs Tab */}
          <TabsContent value="completed" className="space-y-4">
            <CompletedRepairsTab 
              filteredRepairs={filteredCompletedRepairs} 
              onViewDetails={handleViewDetails}
            />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <NotificationsTab 
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <RepairDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        repair={repairDetails}
        getStatusBadge={getStatusBadge}
      />

      <SetPriceDialog
        open={priceDialogOpen}
        onOpenChange={setPriceDialogOpen}
        repair={repairDetails}
        priceForm={priceForm}
        setPriceForm={setPriceForm}
        onSubmit={handlePriceSubmit}
      />

      <CompleteRepairDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        repair={repairDetails}
        completeForm={completeForm}
        setCompleteForm={setCompleteForm}
        onSubmit={handleCompleteSubmit}
      />
    </div>
  );
};

export default FixerDashboard;
