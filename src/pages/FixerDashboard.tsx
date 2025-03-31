
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useFixerDashboard } from "@/hooks/useFixerDashboard";
import { getStatusBadge } from "@/utils/statusUtils";

// Extracted components
import SearchBar from "@/components/fixer-dashboard/SearchBar";
import StatisticsCards from "@/components/fixer-dashboard/StatisticsCards";
import RepairsTab from "@/components/fixer-dashboard/RepairsTab";
import CompletedRepairsTab from "@/components/fixer-dashboard/CompletedRepairsTab";
import NotificationsTab from "@/components/fixer-dashboard/NotificationsTab";
import RepairDetailsDialog from "@/components/fixer-dashboard/RepairDetailsDialog";
import SetPriceDialog from "@/components/fixer-dashboard/SetPriceDialog";
import CompleteRepairDialog from "@/components/fixer-dashboard/CompleteRepairDialog";
import FixerDashboardHeader from "@/components/fixer-dashboard/FixerDashboardHeader";

const FixerDashboard = () => {
  const { t } = useLanguage();
  const {
    isLoading,
    notifications,
    searchQuery,
    setSearchQuery,
    repairDetails,
    detailsOpen,
    setDetailsOpen,
    priceDialogOpen,
    setPriceDialogOpen,
    completeDialogOpen,
    setCompleteDialogOpen,
    priceForm,
    setPriceForm,
    completeForm,
    setCompleteForm,
    assignedRepairs,
    completedRepairs,
    filteredAssignedRepairs,
    filteredCompletedRepairs,
    handleViewDetails,
    handleSetPrice,
    handleCompleteRepair,
    handlePriceSubmit,
    handleCompleteSubmit,
    handleNotificationClick
  } = useFixerDashboard();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FixerDashboardHeader />

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <StatisticsCards 
            assignedRepairs={assignedRepairs} 
            completedRepairs={completedRepairs} 
            notifications={notifications} 
          />
        </div>

        <DashboardTabs 
          isLoading={isLoading}
          filteredAssignedRepairs={filteredAssignedRepairs}
          filteredCompletedRepairs={filteredCompletedRepairs}
          notifications={notifications}
          handleViewDetails={handleViewDetails}
          handleSetPrice={handleSetPrice}
          handleCompleteRepair={handleCompleteRepair}
          handleNotificationClick={handleNotificationClick}
        />
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

// Dashboard tabs component
const DashboardTabs = ({ 
  isLoading, 
  filteredAssignedRepairs, 
  filteredCompletedRepairs, 
  notifications,
  handleViewDetails,
  handleSetPrice,
  handleCompleteRepair,
  handleNotificationClick
}) => {
  const { t } = useLanguage();
  
  return (
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
  );
};

export default FixerDashboard;
