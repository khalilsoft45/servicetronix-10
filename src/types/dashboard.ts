
export interface NewRepairFormData {
  deviceType: string;
  deviceModel: string;
  issue: string;
  additionalInfo: string;
}

// Import RepairStatus from repair.ts to avoid duplication
import { RepairStatus } from "./repair";
export { RepairStatus };
