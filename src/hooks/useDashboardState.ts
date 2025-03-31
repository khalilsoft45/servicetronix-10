
import { useState } from "react";
import { sampleRepairs } from "@/data/sampleRepairs";
import { sampleNotifications } from "@/data/sampleNotifications";
import { filterRepairsBySearch, filterRepairsByStatus, countRepairsByStatus } from "@/utils/dashboardUtils";
import { useRepairActions } from "@/hooks/useRepairActions";
import { NewRepairFormData } from "@/types/dashboard";

export const useDashboardState = () => {
  const [repairs] = useState(sampleRepairs);
  const [notifications] = useState(sampleNotifications);
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

  return {
    repairs,
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
  };
};
