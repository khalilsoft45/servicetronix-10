
import { Badge } from "@/components/ui/badge";
import { RepairStatus } from "@/types/repair";

export const getStatusBadge = (status: RepairStatus) => {
  switch (status) {
    case "assigned":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Assigned</Badge>;
    case "in_progress":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Progress</Badge>;
    case "waiting_for_parts":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Waiting for Parts</Badge>;
    case "waiting_client_approval":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Waiting for Approval</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Completed</Badge>;
    case "in_repair":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Repair</Badge>;
    case "pending_confirmation":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending Confirmation</Badge>;
    case "awaiting_collection":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Awaiting Collection</Badge>;
    case "waiting_price_confirmation":
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Waiting for Price Confirmation</Badge>;
    case "repair_in_progress":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Repair in Progress</Badge>;
    case "price_confirmed_in_repair":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Price Confirmed</Badge>;
    case "fixed_awaiting_delivery":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Fixed - Awaiting Delivery</Badge>;
    case "repair_rejected":
    case "price_rejected":
    case "rejected":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
