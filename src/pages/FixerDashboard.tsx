
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Badge } from "@/components/ui/badge";
import { Repair, RepairStatus } from "@/types/repair";
import { useRepairSync } from "@/hooks/useRepairSync";
import { useNotifications } from "@/context/NotificationContext";

// Extracted components
import SearchBar from "@/components/fixer-dashboard/SearchBar";
import StatisticsCards from "@/components/fixer-dashboard/StatisticsCards";
import RepairsTab from "@/components/fixer-dashboard/RepairsTab";
import CompletedRepairsTab from "@/components/fixer-dashboard/CompletedRepairsTab";
import NotificationsTab from "@/components/fixer-dashboard/NotificationsTab";
import RepairDetailsDialog from "@/components/fixer-dashboard/RepairDetailsDialog";
import SetPriceDialog from "@/components/fixer-dashboard/SetPriceDialog";
import CompleteRepairDialog from "@/components/fixer-dashboard/CompleteRepairDialog";

const FixerDashboard = () => {
  const { t } = useLanguage();
  const { repairs, isLoading, updatePrice, completeRepair } = useRepairSync();
  const { notifications, markAsRead } = useNotifications();
  
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

  // Filter repairs based on status
  const assignedRepairs = repairs.filter(repair => repair.status !== "completed");
  const completedRepairs = repairs.filter(repair => repair.status === "completed");

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
    if (repairDetails) {
      updatePrice({ 
        id: repairDetails.id, 
        price: parseFloat(priceForm.price) 
      });
      setPriceDialogOpen(false);
    }
  };

  const handleCompleteSubmit = () => {
    if (repairDetails) {
      completeRepair({ 
        id: repairDetails.id, 
        notes: completeForm.notes 
      });
      setCompleteDialogOpen(false);
    }
  };

  const handleNotificationClick = (notification: any) => {
    const repair = repairs.find(r => r.id === notification.repairId);
    if (repair) {
      setRepairDetails(repair);
      setDetailsOpen(true);
      
      // Mark notification as read
      markAsRead(notification.id);
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
            {isLoading ? (
              <div className="text-center py-8">Loading repairs...</div>
            ) : (
              <RepairsTab 
                filteredRepairs={filteredAssignedRepairs} 
                onViewDetails={handleViewDetails}
                onSetPrice={handleSetPrice}
                onCompleteRepair={handleCompleteRepair}
              />
            )}
          </TabsContent>

          {/* Completed Repairs Tab */}
          <TabsContent value="completed" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading repairs...</div>
            ) : (
              <CompletedRepairsTab 
                filteredRepairs={filteredCompletedRepairs} 
                onViewDetails={handleViewDetails}
              />
            )}
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
