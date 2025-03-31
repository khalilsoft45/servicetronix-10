
export interface NewRepairFormData {
  deviceType: string;
  deviceModel: string;
  issue: string;
  additionalInfo: string;
}

export type RepairStatus = 
  | "pending_confirmation"
  | "awaiting_collection"
  | "in_repair"
  | "waiting_price_confirmation"
  | "repair_in_progress"
  | "price_confirmed_in_repair"
  | "fixed_awaiting_delivery"
  | "repair_rejected"
  | "price_rejected"
  | "completed";
