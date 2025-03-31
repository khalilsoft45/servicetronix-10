
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/components/dashboard/NotificationsList";
import { NewRepairFormData } from "@/types/dashboard";
import { useNotifications } from "@/context/NotificationContext";
import { useRepairSync } from "@/hooks/useRepairSync";

export const useRepairActions = () => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { updateStatus, updatePrice } = useRepairSync();
  
  const [newRepairForm, setNewRepairForm] = useState<NewRepairFormData>({
    deviceType: "",
    deviceModel: "",
    issue: "",
    additionalInfo: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [priceConfirmDialog, setPriceConfirmDialog] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);

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
      
      // Add a notification for operators
      addNotification({
        type: "info",
        title: "New Repair Request",
        message: `New ${newRepairForm.deviceType} repair request needs confirmation.`,
        repairId: `REP-${Date.now().toString().substring(7)}`
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
    // Find the related repair in the repairs array
    if (notification.repairId === "REP-005") {
      setSelectedRepair({
        id: "REP-005",
        device: "Dell XPS 13",
        issue: "Keyboard not responding correctly",
        status: "waiting_price_confirmation",
        price: 120,
        assignedFixer: "Mike Johnson",
      });
      setPriceConfirmDialog(true);
    } else {
      toast({
        title: "Notification viewed",
        description: `You viewed notification about ${notification.repairId}`,
      });
    }
  };

  const handlePriceConfirm = (accept: boolean) => {
    if (selectedRepair) {
      if (accept) {
        updateStatus({ 
          id: selectedRepair.id, 
          status: "in_progress" 
        });
        
        // Add notification for fixer
        addNotification({
          type: "success",
          title: "Price Approved",
          message: `The client has approved the price for repair ${selectedRepair.id}.`,
          repairId: selectedRepair.id
        });
      } else {
        updateStatus({ 
          id: selectedRepair.id, 
          status: "price_rejected" 
        });
        
        // Add notification for fixer
        addNotification({
          type: "warning",
          title: "Price Rejected",
          message: `The client has rejected the price for repair ${selectedRepair.id}.`,
          repairId: selectedRepair.id
        });
      }
      
      toast({
        title: accept ? "Price accepted" : "Price rejected",
        description: accept 
          ? "The technician will proceed with the repair." 
          : "The device will be returned without repair.",
      });
    }
    
    setPriceConfirmDialog(false);
  };

  return {
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
  };
};
