
export type RepairStatus = 
  | "assigned"
  | "in_progress"
  | "waiting_for_parts"
  | "waiting_client_approval"
  | "price_confirmed_in_repair"
  | "repair_in_progress"
  | "fixed_awaiting_delivery"
  | "repair_rejected"
  | "price_rejected"
  | "rejected"
  | "completed";

export interface Repair {
  id: string;
  clientName: string;
  deviceType: string;
  issue: string;
  status: RepairStatus;
  dateAssigned: string;
  estimatedCompletion?: string;
  dateCompleted?: string;
  price?: number | null;
  notes?: string;
}
