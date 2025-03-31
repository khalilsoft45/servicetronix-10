
import { useState } from "react";
import { useRepairSync } from "@/hooks/useRepairSync";
import { useNotifications } from "@/context/NotificationContext";
import { Repair } from "@/types/repair";

export const useFixerDashboard = () => {
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

  return {
    repairs,
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
  };
};
