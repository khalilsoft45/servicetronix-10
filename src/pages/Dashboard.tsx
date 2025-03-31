
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SummaryCards from "@/components/dashboard/SummaryCards";
import ActionBar from "@/components/dashboard/ActionBar";
import NewRepairDialog from "@/components/dashboard/NewRepairDialog";
import PriceConfirmationDialog from "@/components/dashboard/PriceConfirmationDialog";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { useRepairSync } from "@/hooks/useRepairSync";
import { useNotifications } from "@/context/NotificationContext";
import { useRepairActions } from "@/hooks/useRepairActions";
import { filterRepairsByStatus, filterRepairsBySearch, countRepairsByStatus } from "@/utils/dashboardUtils";
import { useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const { repairs, isLoading } = useRepairSync();
  const { notifications } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("repairs");
  
  const {
    newRepairForm,
    dialogOpen,
    setDialogOpen,
    priceConfirmDialog,
    setPriceConfirmDialog,
    selectedRepair,
    handleRepairFormChange,
    handleRepairSubmit,
    handleNotificationClick,
    handlePriceConfirm
  } = useRepairActions();

  // Apply filters to get the list of repairs to display
  const filteredByStatus = filterRepairsByStatus(repairs, statusFilter);
  const filteredRepairs = filterRepairsBySearch(filteredByStatus, searchQuery);
  
  // Calculate counts for summary cards
  const { completedCount, inProgressCount, pendingCount } = countRepairsByStatus(repairs);

  // Make sure we have data to pass to ProfileForms
  const userData = user ? {
    name: user.name || "",
    email: user.email || ""
  } : null;

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid gap-6">
        <SummaryCards 
          totalRepairs={repairs.length} 
          completedCount={completedCount} 
          pendingCount={pendingCount} 
          inProgressCount={inProgressCount}
        />
        
        <ActionBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onRequestRepairClick={() => setDialogOpen(true)}
        />
        
        {isLoading ? (
          <div className="text-center py-8">Loading dashboard data...</div>
        ) : (
          <DashboardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filteredRepairs={filteredRepairs}
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            userData={userData}
          />
        )}
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
