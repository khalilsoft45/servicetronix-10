
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, AlertTriangle, Timer } from "lucide-react";

interface SummaryCardsProps {
  totalRepairs: number;
  completedCount: number;
  pendingCount: number;
  inProgressCount: number;
}

const SummaryCards = ({ totalRepairs, completedCount, pendingCount, inProgressCount }: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Repairs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="text-3xl font-bold">{totalRepairs}</div>
            <div className="ml-auto bg-blue-100 p-2 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="text-3xl font-bold">{completedCount}</div>
            <div className="ml-auto bg-green-100 p-2 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="text-3xl font-bold">{pendingCount}</div>
            <div className="ml-auto bg-yellow-100 p-2 rounded-full">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="text-3xl font-bold">{inProgressCount}</div>
            <div className="ml-auto bg-purple-100 p-2 rounded-full">
              <Timer className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
