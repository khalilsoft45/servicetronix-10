
export const filterRepairsByStatus = (repairs: any[], statusFilter: string) => {
  if (statusFilter === "all") return repairs;
  return repairs.filter(repair => repair.status === statusFilter);
};

export const filterRepairsBySearch = (repairs: any[], searchQuery: string) => {
  if (!searchQuery) return repairs;
  const query = searchQuery.toLowerCase();
  
  return repairs.filter(repair => 
    repair.deviceType.toLowerCase().includes(query) ||
    repair.issue.toLowerCase().includes(query) ||
    repair.id.toLowerCase().includes(query)
  );
};

export const countRepairsByStatus = (repairs: any[]) => {
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

  return {
    completedCount,
    inProgressCount,
    pendingCount
  };
};
