
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { repairService } from "@/services/repairService";
import { Repair, RepairStatus } from "@/types/repair";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const useRepairSync = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const role = user?.role || "user";

  // Fetch repairs with polling for real-time updates
  const { 
    data: repairs = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ["repairs", role],
    queryFn: () => repairService.getRepairsByRole(role),
    refetchInterval: 5000, // Poll every 5 seconds for updates
    staleTime: 2000 // Consider data stale after 2 seconds to enable refetching
  });

  // Mutation for updating repair status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RepairStatus }) => 
      repairService.updateRepairStatus(id, status),
    onSuccess: () => {
      // Invalidate and refetch queries after status update
      queryClient.invalidateQueries({ queryKey: ["repairs"] });
      toast.success("Repair status updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update status: ${error.message}`);
    }
  });

  // Mutation for updating repair price
  const updatePriceMutation = useMutation({
    mutationFn: ({ id, price }: { id: string; price: number }) => 
      repairService.updateRepairPrice(id, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairs"] });
      toast.success("Repair price set successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to set price: ${error.message}`);
    }
  });

  // Mutation for completing a repair
  const completeRepairMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => 
      repairService.completeRepair(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairs"] });
      toast.success("Repair marked as complete");
    },
    onError: (error: Error) => {
      toast.error(`Failed to complete repair: ${error.message}`);
    }
  });

  // Mutation for assigning collector
  const assignCollectorMutation = useMutation({
    mutationFn: ({ id, collectorName }: { id: string; collectorName: string }) => 
      repairService.assignCollector(id, collectorName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairs"] });
      toast.success("Collector assigned successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to assign collector: ${error.message}`);
    }
  });

  return {
    repairs,
    isLoading,
    error,
    updateStatus: updateStatusMutation.mutate,
    updatePrice: updatePriceMutation.mutate,
    completeRepair: completeRepairMutation.mutate,
    assignCollector: assignCollectorMutation.mutate
  };
};
