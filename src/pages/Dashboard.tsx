
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import RepairStatusCard from "@/components/dashboard/RepairStatusCard";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  CheckCircle2,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

// Sample data for demonstration
const sampleRepairs = [
  {
    id: "REP-001",
    device: "MacBook Pro 2019",
    issue: "Screen not working properly, shows lines",
    status: "in_repair" as const,
    dateCreated: "12 Jun 2023",
    lastUpdated: "15 Jun 2023",
  },
  {
    id: "REP-002",
    device: "iPhone 12",
    issue: "Battery draining too quickly",
    status: "completed" as const,
    dateCreated: "05 May 2023",
    lastUpdated: "10 May 2023",
  },
  {
    id: "REP-003",
    device: "Samsung Galaxy S21",
    issue: "Cracked screen needs replacement",
    status: "awaiting_collection" as const,
    dateCreated: "20 Jun 2023",
    lastUpdated: "20 Jun 2023",
  },
  {
    id: "REP-004",
    device: "iPad Pro 2021",
    issue: "Not charging when plugged in",
    status: "pending_confirmation" as const,
    dateCreated: "22 Jun 2023",
    lastUpdated: "22 Jun 2023",
  },
];

const Dashboard = () => {
  const { toast } = useToast();
  const [repairs] = useState(sampleRepairs);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newRepairForm, setNewRepairForm] = useState({
    deviceType: "",
    deviceModel: "",
    issue: "",
    additionalInfo: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRepairFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRepairForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRepairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API request
    setTimeout(() => {
      toast({
        title: "Repair request submitted!",
        description: "A phone operator will contact you soon to confirm the details.",
      });
      setDialogOpen(false);
      setNewRepairForm({
        deviceType: "",
        deviceModel: "",
        issue: "",
        additionalInfo: "",
      });
    }, 1000);
  };

  // Filter repairs based on search query and status filter
  const filteredRepairs = repairs.filter((repair) => {
    const matchesSearch = searchQuery === "" || 
      repair.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || repair.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate counts for the summary cards
  const completedCount = repairs.filter(r => r.status === "completed").length;
  const inProgressCount = repairs.filter(r => ["in_repair", "awaiting_collection", "fixed_awaiting_delivery"].includes(r.status)).length;
  const pendingCount = repairs.filter(r => r.status === "pending_confirmation").length;

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Repairs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-3xl font-bold">{repairs.length}</div>
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
        </div>
        
        {/* Action Bar */}
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
                <SelectItem value="fixed_awaiting_delivery">Fixed & Awaiting Delivery</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Request Repair
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleRepairSubmit}>
                <DialogHeader>
                  <DialogTitle>Request a New Repair</DialogTitle>
                  <DialogDescription>
                    Fill out the details of your device and issue. Our team will contact you to arrange a pickup.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="deviceType">Device Type</Label>
                    <Select
                      name="deviceType"
                      value={newRepairForm.deviceType}
                      onValueChange={(value) => handleRepairFormChange({
                        target: { name: "deviceType", value }
                      } as any)}
                      required
                    >
                      <SelectTrigger id="deviceType">
                        <SelectValue placeholder="Select device type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="laptop">Laptop</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="desktop">Desktop</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="deviceModel">Device Model</Label>
                    <Input
                      id="deviceModel"
                      name="deviceModel"
                      placeholder="e.g. MacBook Pro 2019, iPhone 12"
                      value={newRepairForm.deviceModel}
                      onChange={handleRepairFormChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="issue">Issue Description</Label>
                    <Textarea
                      id="issue"
                      name="issue"
                      placeholder="Describe the problem with your device"
                      value={newRepairForm.issue}
                      onChange={handleRepairFormChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      placeholder="Any additional details that might help our technicians"
                      value={newRepairForm.additionalInfo}
                      onChange={handleRepairFormChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Submit Request</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Repairs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepairs.length > 0 ? (
            filteredRepairs.map((repair) => (
              <RepairStatusCard
                key={repair.id}
                id={repair.id}
                device={repair.device}
                issue={repair.issue}
                status={repair.status}
                dateCreated={repair.dateCreated}
                lastUpdated={repair.lastUpdated}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-500">No repairs found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
