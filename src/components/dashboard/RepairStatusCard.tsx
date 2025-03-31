import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, CheckCircle, Wrench, Truck, Phone } from "lucide-react";

type RepairStatus = 
  | "pending_confirmation" 
  | "awaiting_collection" 
  | "in_repair" 
  | "fixed_awaiting_delivery" 
  | "completed";

interface RepairStatusCardProps {
  id: string;
  device: string;
  issue: string;
  status: RepairStatus;
  dateCreated: string;
  lastUpdated: string;
}

const RepairStatusCard = ({
  id,
  device,
  issue,
  status,
  dateCreated,
  lastUpdated,
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
          description: "Your device is currently being repaired by our technician.",
        };
      case "fixed_awaiting_delivery":
        return {
          label: "Fixed & Awaiting Delivery",
          color: "bg-indigo-100 text-indigo-800",
          icon: Truck,
          description: "Your device has been fixed and will be delivered soon.",
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
