
import { Repair, RepairStatus } from "@/types/repair";
import { sampleRepairs } from "@/data/sampleRepairs";

// In a real application, this would be replaced with API calls
// For now, we'll use a simulated database in memory
let repairsDatabase: Repair[] = [...sampleRepairs];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const repairService = {
  // Fetch all repairs
  getAllRepairs: async (): Promise<Repair[]> => {
    await delay(300);
    return [...repairsDatabase];
  },

  // Fetch repairs for a specific role
  getRepairsByRole: async (role: string): Promise<Repair[]> => {
    await delay(300);
    
    if (role === "admin") {
      return [...repairsDatabase];
    } else if (role === "fixer") {
      return repairsDatabase.filter(repair => 
        ["assigned", "in_progress", "waiting_for_parts", "waiting_client_approval", "completed"].includes(repair.status)
      );
    } else if (role === "operator") {
      return repairsDatabase.filter(repair => 
        ["pending_confirmation", "awaiting_collection", "in_repair", "waiting_price_confirmation", "fixed_awaiting_delivery", "completed"].includes(repair.status)
      );
    } else if (role === "collector") {
      return repairsDatabase.filter(repair => 
        ["awaiting_collection", "fixed_awaiting_delivery"].includes(repair.status)
      );
    } else {
      // For regular users, normally we would filter by the user's ID
      // For now, just return a subset of repairs
      return repairsDatabase.filter(repair => 
        repair.clientName.includes("John")
      );
    }
  },

  // Update repair status
  updateRepairStatus: async (id: string, status: RepairStatus): Promise<Repair> => {
    await delay(300);
    
    const repairIndex = repairsDatabase.findIndex(repair => repair.id === id);
    if (repairIndex === -1) {
      throw new Error(`Repair with ID ${id} not found`);
    }

    repairsDatabase[repairIndex] = {
      ...repairsDatabase[repairIndex],
      status,
      lastUpdated: new Date().toISOString()
    };

    return repairsDatabase[repairIndex];
  },

  // Update repair price
  updateRepairPrice: async (id: string, price: number): Promise<Repair> => {
    await delay(300);
    
    const repairIndex = repairsDatabase.findIndex(repair => repair.id === id);
    if (repairIndex === -1) {
      throw new Error(`Repair with ID ${id} not found`);
    }

    repairsDatabase[repairIndex] = {
      ...repairsDatabase[repairIndex],
      price,
      status: "waiting_client_approval" as RepairStatus,
      lastUpdated: new Date().toISOString()
    };

    return repairsDatabase[repairIndex];
  },

  // Complete a repair
  completeRepair: async (id: string, notes: string): Promise<Repair> => {
    await delay(300);
    
    const repairIndex = repairsDatabase.findIndex(repair => repair.id === id);
    if (repairIndex === -1) {
      throw new Error(`Repair with ID ${id} not found`);
    }

    repairsDatabase[repairIndex] = {
      ...repairsDatabase[repairIndex],
      status: "completed" as RepairStatus,
      dateCompleted: new Date().toISOString().split('T')[0],
      notes,
      lastUpdated: new Date().toISOString()
    };

    return repairsDatabase[repairIndex];
  },

  // Assign collector to a repair
  assignCollector: async (id: string, collectorName: string): Promise<Repair> => {
    await delay(300);
    
    const repairIndex = repairsDatabase.findIndex(repair => repair.id === id);
    if (repairIndex === -1) {
      throw new Error(`Repair with ID ${id} not found`);
    }

    repairsDatabase[repairIndex] = {
      ...repairsDatabase[repairIndex],
      assignedCollector: collectorName,
      status: "awaiting_collection" as RepairStatus,
      lastUpdated: new Date().toISOString()
    };

    return repairsDatabase[repairIndex];
  }
};
