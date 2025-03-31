
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActionBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onRequestRepairClick: () => void;
}

const ActionBar = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onRequestRepairClick,
}: ActionBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search repairs..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending_confirmation">Pending Confirmation</SelectItem>
            <SelectItem value="awaiting_collection">Awaiting Collection</SelectItem>
            <SelectItem value="in_repair">In Repair</SelectItem>
            <SelectItem value="waiting_price_confirmation">Waiting for Approval</SelectItem>
            <SelectItem value="repair_in_progress">Repair in Progress</SelectItem>
            <SelectItem value="price_confirmed_in_repair">In Repair (Price Confirmed)</SelectItem>
            <SelectItem value="fixed_awaiting_delivery">Fixed & Awaiting Delivery</SelectItem>
            <SelectItem value="repair_rejected">Repair Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={onRequestRepairClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Request Repair
      </Button>
    </div>
  );
};

export default ActionBar;
