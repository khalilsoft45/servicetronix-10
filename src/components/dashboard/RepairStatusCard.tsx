import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, CheckCircle, Wrench, Truck, Phone, DollarSign, XCircle, User } from "lucide-react";
import { RepairStatus } from "@/types/repair";

interface RepairStatusCardProps {
  id: string;
  device: string;
  issue: string;
  status: RepairStatus;
  dateCreated: string;
  lastUpdated: string;
  price?: number;
  fixerNotes?: string;
  assignedFixer?: string;
}

const RepairStatusCard = ({
  id,
  device,
  issue,
  status,
  dateCreated,
  lastUpdated,
  price,
  fixerNotes,
  assignedFixer,
}: RepairStatusCardProps) => {
  const getStatusInfo = (status: RepairStatus) => {
    switch (status) {
      case "pending_confirmation":
        return {
          label: "Pending Confirmation",
          color: "bg-yellow-100 text-yellow-800",
          icon: Phone,
          description: "Waiting for phone operator to call and confirm details.",
        };
      case "awaiting_collection":
      case "confirmed_awaiting_collection":
        return {
          label: "Awaiting Collection",
          color: "bg-blue-100 text-blue-800",
          icon: Truck,
          description: "A collector has been assigned to pick up your device.",
        };
      case "in_repair":
        return {
          label: "In Repair",
          color: "bg-purple-100 text-purple-800",
          icon: Wrench,
          description: "Your device is with our technician for diagnosis.",
        };
      case "waiting_price_confirmation":
        return {
          label: "Waiting for Approval",
          color: "bg-orange-100 text-orange-800",
          icon: DollarSign,
          description: "Waiting for your approval of the repair price.",
        };
      case "price_confirmed_in_repair":
      case "repair_in_progress":
        return {
          label: "Repair in Progress",
          color: "bg-indigo-100 text-indigo-800",
          icon: Wrench,
          description: "Your device is currently being repaired by our technician.",
        };
      case "fixed_awaiting_delivery":
        return {
          label: "Fixed & Awaiting Delivery",
          color: "bg-green-100 text-green-800",
          icon: Truck,
          description: "Your device has been fixed and will be delivered soon.",
        };
      case "price_rejected":
      case "repair_rejected":
      case "rejected":
        return {
          label: "Repair Rejected",
          color: "bg-red-100 text-red-800",
          icon: XCircle,
          description: "The repair was not approved. Device will be returned.",
        };
      case "completed":
        return {
          label: "Completed",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          description: "The repair has been completed successfully.",
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
          icon: Clock,
          description: "Status unknown.",
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Repair #{id}</CardTitle>
          <Badge className={statusInfo.color}>
            <statusInfo.icon className="h-3.5 w-3.5 mr-1" />
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-gray-500">Device</h4>
            <p className="font-medium">{device}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-500">Issue</h4>
            <p>{issue}</p>
          </div>
          
          {price !== undefined && (
            <div>
              <h4 className="font-medium text-sm text-gray-500">Repair Price</h4>
              <p className="font-medium">${price.toFixed(2)}</p>
            </div>
          )}
          
          {assignedFixer && (
            <div>
              <h4 className="font-medium text-sm text-gray-500">Assigned Technician</h4>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <p>{assignedFixer}</p>
              </div>
            </div>
          )}
          
          {fixerNotes && (
            <div>
              <h4 className="font-medium text-sm text-gray-500">Technician Notes</h4>
              <p className="text-sm italic">{fixerNotes}</p>
            </div>
          )}
          
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
              <Clock className="h-4 w-4" />
              <span>Created: {dateCreated}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <ArrowRight className="h-4 w-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-gray-600">{statusInfo.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepairStatusCard;
