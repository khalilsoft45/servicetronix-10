
import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
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
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
