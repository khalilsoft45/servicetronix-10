
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SummaryCards from "@/components/dashboard/SummaryCards";
import ActionBar from "@/components/dashboard/ActionBar";
import NewRepairDialog from "@/components/dashboard/NewRepairDialog";
import PriceConfirmationDialog from "@/components/dashboard/PriceConfirmationDialog";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { useDashboardState } from "@/hooks/useDashboardState";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    notifications,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    newRepairForm,
    dialogOpen,
    setDialogOpen,
    priceConfirmDialog,
    setPriceConfirmDialog,
    selectedRepair,
    activeTab,
    setActiveTab,
    filteredRepairs,
    completedCount,
    inProgressCount,
    pendingCount,
    handleRepairFormChange,
    handleRepairSubmit,
    handleNotificationClick,
    handlePriceConfirm
  } = useDashboardState();

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid gap-6">
        <SummaryCards 
          totalRepairs={filteredRepairs.length} 
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
        
        <DashboardTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredRepairs={filteredRepairs}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          userData={user}
        />
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
