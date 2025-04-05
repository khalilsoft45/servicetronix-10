import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Phone, 
  CheckCircle, 
  X, 
  Truck, 
  Wrench, 
  AlertTriangle,
  Bell,
  Filter,
  UserCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import NotificationItem, { NotificationType } from "@/components/dashboard/NotificationItem";

// Types
type RepairStatus = 
  | "pending_operator_review" 
  | "confirmed_awaiting_collection" 
  | "rejected"
  | "in_repair"
  | "awaiting_price_confirmation"
  | "price_confirmed_in_repair"
  | "price_rejected"
  | "fixed_awaiting_delivery"
  | "completed";

interface Repair {
  id: string;
  clientName: string;
  clientPhone: string;
  deviceType: string;
  deviceModel: string;
  issue: string;
  status: RepairStatus;
  dateCreated: string;
  lastUpdated: string;
  assignedCollector?: string;
  assignedFixer?: string;
  price?: number;
  notes?: string;
}

interface Collector {
  id: string;
  name: string;
  phone: string;
  available: boolean;
  activeCollections: number;
}

interface Fixer {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
  activeRepairs: number;
}

// Sample data
const sampleRepairs: Repair[] = [
  {
    id: "REP-001",
    clientName: "John Doe",
    clientPhone: "+1 555-123-4567",
    deviceType: "Laptop",
    deviceModel: "MacBook Pro 2019",
    issue: "Screen not working properly, shows lines",
    status: "in_repair",
    dateCreated: "12 Jun 2023",
    lastUpdated: "15 Jun 2023",
    assignedCollector: "COL-002",
    assignedFixer: "FIX-001"
  },
  {
    id: "REP-002",
    clientName: "Jane Smith",
    clientPhone: "+1 555-987-6543",
    deviceType: "Phone",
    deviceModel: "iPhone 12",
    issue: "Battery draining too quickly",
    status: "completed",
    dateCreated: "05 May 2023",
    lastUpdated: "10 May 2023",
    assignedCollector: "COL-001",
    assignedFixer: "FIX-003",
    price: 85
  },
  {
    id: "REP-003",
    clientName: "Michael Wilson",
    clientPhone: "+1 555-222-3333",
    deviceType: "Phone",
    deviceModel: "Samsung Galaxy S21",
    issue: "Cracked screen needs replacement",
    status: "confirmed_awaiting_collection",
    dateCreated: "20 Jun 2023",
    lastUpdated: "20 Jun 2023",
    assignedCollector: "COL-001"
  },
  {
    id: "REP-004",
    clientName: "Emily Johnson",
    clientPhone: "+1 555-444-5555",
    deviceType: "Tablet",
    deviceModel: "iPad Pro 2021",
    issue: "Not charging when plugged in",
    status: "pending_operator_review",
    dateCreated: "22 Jun 2023",
    lastUpdated: "22 Jun 2023"
  },
  {
    id: "REP-005",
    clientName: "Robert Brown",
    clientPhone: "+1 555-777-8888",
    deviceType: "Laptop",
    deviceModel: "Dell XPS 13",
    issue: "Keyboard not responding correctly",
    status: "awaiting_price_confirmation",
    dateCreated: "18 Jun 2023",
    lastUpdated: "21 Jun 2023",
    assignedCollector: "COL-002",
    assignedFixer: "FIX-002",
    price: 120
  },
  {
    id: "REP-006",
    clientName: "Sarah Davis",
    clientPhone: "+1 555-666-9999",
    deviceType: "Phone",
    deviceModel: "Google Pixel 6",
    issue: "Camera not focusing properly",
    status: "fixed_awaiting_delivery",
    dateCreated: "15 Jun 2023",
    lastUpdated: "25 Jun 2023",
    assignedCollector: "COL-001",
    assignedFixer: "FIX-001",
    price: 95
  }
];

const collectors: Collector[] = [
  { id: "COL-001", name: "Mark Johnson", phone: "+1 555-111-2222", available: true, activeCollections: 2 },
  { id: "COL-002", name: "Lisa Williams", phone: "+1 555-333-4444", available: true, activeCollections: 1 },
  { id: "COL-003", name: "David Miller", phone: "+1 555-555-6666", available: false, activeCollections: 3 }
];

const fixers: Fixer[] = [
  { id: "FIX-001", name: "Alex Chen", specialty: "Phones, Tablets", available: true, activeRepairs: 2 },
  { id: "FIX-002", name: "Jessica Thompson", specialty: "Laptops, Desktops", available: true, activeRepairs: 1 },
  { id: "FIX-003", name: "Ryan Martinez", specialty: "All Devices", available: false, activeRepairs: 4 }
];

// Sample notifications
const sampleNotifications = [
  {
    id: "NOTIF-001",
    type: "info" as NotificationType,
    title: "New Repair Request",
    message: "Emily Johnson has submitted a new repair request for an iPad Pro.",
    time: "2 hours ago",
    isNew: true,
    repairId: "REP-004"
  },
  {
    id: "NOTIF-002",
    type: "success" as NotificationType,
    title: "Repair Completed",
    message: "Fixer Alex Chen has completed the repair for Google Pixel 6 (REP-006).",
    time: "1 day ago",
    isNew: true,
    repairId: "REP-006"
  },
  {
    id: "NOTIF-003",
    type: "alert" as NotificationType,
    title: "Price Set for Repair",
    message: "A price of $120 has been set for Dell XPS 13 repair (REP-005). Client needs to be contacted for approval.",
    time: "3 days ago",
    isNew: false,
    repairId: "REP-005"
  }
];

const OperatorDashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [repairs, setRepairs] = useState<Repair[]>(sampleRepairs);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [assignCollectorDialogOpen, setAssignCollectorDialogOpen] = useState(false);
  const [assignFixerDialogOpen, setAssignFixerDialogOpen] = useState(false);
  const [callClientDialogOpen, setCallClientDialogOpen] = useState(false);
  const [confirmForm, setConfirmForm] = useState({
    notes: "",
    collectorId: ""
  });
  const [rejectForm, setRejectForm] = useState({
    reason: ""
  });
  const [assignFixerForm, setAssignFixerForm] = useState({
    fixerId: ""
  });
  const [callClientForm, setCallClientForm] = useState({
    accepted: false,
    notes: ""
  });

  const pendingCount = repairs.filter(r => r.status === "pending_operator_review").length;
  const inProgressCount = repairs.filter(r => [
    "confirmed_awaiting_collection", 
    "in_repair", 
    "awaiting_price_confirmation", 
    "price_confirmed_in_repair", 
    "fixed_awaiting_delivery"
  ].includes(r.status)).length;
  const completedCount = repairs.filter(r => r.status === "completed").length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleViewDetails = (repair: Repair) => {
    setSelectedRepair(repair);
    setDetailsOpen(true);
  };

  const handleConfirmRepair = (repair: Repair) => {
    setSelectedRepair(repair);
    setConfirmForm({
      notes: "",
      collectorId: ""
    });
    setConfirmDialogOpen(true);
  };

  const handleRejectRepair = (repair: Repair) => {
    setSelectedRepair(repair);
    setRejectForm({
      reason: ""
    });
    setRejectDialogOpen(true);
  };

  const handleAssignCollector = (repair: Repair) => {
    setSelectedRepair(repair);
    setConfirmForm({
      notes: "",
      collectorId: collectors[0]?.id || ""
    });
    setAssignCollectorDialogOpen(true);
  };

  const handleAssignFixer = (repair: Repair) => {
    setSelectedRepair(repair);
    setAssignFixerForm({
      fixerId: fixers[0]?.id || ""
    });
    setAssignFixerDialogOpen(true);
  };

  const handleCallClient = (repair: Repair) => {
    setSelectedRepair(repair);
    setCallClientForm({
      accepted: false,
      notes: ""
    });
    setCallClientDialogOpen(true);
  };

  const submitConfirmRepair = () => {
    if (!selectedRepair) return;

    const updatedRepairs = repairs.map(repair => {
      if (repair.id === selectedRepair.id) {
        return {
          ...repair,
          status: "confirmed_awaiting_collection" as RepairStatus,
          lastUpdated: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          assignedCollector: confirmForm.collectorId,
          notes: confirmForm.notes || repair.notes
        };
      }
      return repair;
    });

    setRepairs(updatedRepairs);
    setConfirmDialogOpen(false);
    toast({
      title: "Repair request confirmed",
      description: `Repair ${selectedRepair.id} has been confirmed and assigned to collector.`
    });
  };

  const submitRejectRepair = () => {
    if (!selectedRepair) return;

    const updatedRepairs = repairs.map(repair => {
      if (repair.id === selectedRepair.id) {
        return {
          ...repair,
          status: "rejected" as RepairStatus,
          lastUpdated: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          notes: rejectForm.reason || repair.notes
        };
      }
      return repair;
    });

    setRepairs(updatedRepairs);
    setRejectDialogOpen(false);
    toast({
      title: "Repair request rejected",
      description: `Repair ${selectedRepair.id} has been rejected.`
    });
  };

  const submitAssignCollector = () => {
    if (!selectedRepair) return;

    const updatedRepairs = repairs.map(repair => {
      if (repair.id === selectedRepair.id) {
        return {
          ...repair,
          lastUpdated: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          assignedCollector: confirmForm.collectorId,
          notes: confirmForm.notes || repair.notes
        };
      }
      return repair;
    });

    setRepairs(updatedRepairs);
    setAssignCollectorDialogOpen(false);
    toast({
      title: "Collector assigned",
      description: `Collector has been assigned to repair ${selectedRepair.id}.`
    });
  };

  const submitAssignFixer = () => {
    if (!selectedRepair) return;

    const updatedRepairs = repairs.map(repair => {
      if (repair.id === selectedRepair.id) {
        return {
          ...repair,
          lastUpdated: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          assignedFixer: assignFixerForm.fixerId
        };
      }
      return repair;
    });

    setRepairs(updatedRepairs);
    setAssignFixerDialogOpen(false);
    toast({
      title: "Fixer assigned",
      description: `Fixer has been assigned to repair ${selectedRepair.id}.`
    });
  };

  const submitCallClient = () => {
    if (!selectedRepair) return;

    const newStatus = callClientForm.accepted 
      ? "price_confirmed_in_repair" as RepairStatus
      : "price_rejected" as RepairStatus;

    const updatedRepairs = repairs.map(repair => {
      if (repair.id === selectedRepair.id) {
        return {
          ...repair,
          status: newStatus,
          lastUpdated: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          notes: (repair.notes || "") + "\n" + callClientForm.notes
        };
      }
      return repair;
    });

    setRepairs(updatedRepairs);
    setCallClientDialogOpen(false);
    toast({
      title: callClientForm.accepted ? "Repair price confirmed" : "Repair price rejected",
      description: callClientForm.accepted 
        ? `Client has approved the price for repair ${selectedRepair.id}.`
        : `Client has rejected the price for repair ${selectedRepair.id}.`
    });
  };

  const handleNotificationClick = (notification: any) => {
    const repair = repairs.find(r => r.id === notification.repairId);
    if (repair) {
      setSelectedRepair(repair);
      setDetailsOpen(true);
      
      // Mark notification as read
      setNotifications(
        notifications.map(n => 
          n.id === notification.id ? { ...n, isNew: false } : n
        )
      );
    }
  };

  // Filter repairs based on search query and status filter
  const filteredRepairs = repairs.filter(repair => {
    const matchesSearch = searchQuery === "" || 
      repair.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.deviceModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || repair.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: RepairStatus) => {
    switch (status) {
      case "pending_operator_review":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case "confirmed_awaiting_collection":
        return <Badge className="bg-blue-100 text-blue-800">Awaiting Collection</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "in_repair":
        return <Badge className="bg-purple-100 text-purple-800">In Repair</Badge>;
      case "awaiting_price_confirmation":
        return <Badge className="bg-orange-100 text-orange-800">Price Needs Confirmation</Badge>;
      case "price_confirmed_in_repair":
        return <Badge className="bg-indigo-100 text-indigo-800">In Repair (Price Confirmed)</Badge>;
      case "price_rejected":
        return <Badge className="bg-red-100 text-red-800">Price Rejected</Badge>;
      case "fixed_awaiting_delivery":
        return <Badge className="bg-green-100 text-green-800">Fixed & Awaiting Delivery</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusButtons = (repair: Repair) => {
    switch (repair.status) {
      case "pending_operator_review":
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleConfirmRepair(repair)}>
              <CheckCircle className="mr-1 h-4 w-4" />
              Confirm
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleRejectRepair(repair)}>
              <X className="mr-1 h-4 w-4" />
              Reject
            </Button>
          </div>
        );
      case "confirmed_awaiting_collection":
        return (
          <Button size="sm" variant="outline" disabled>
            <Truck className="mr-1 h-4 w-4" />
            Awaiting Collector
          </Button>
        );
      case "in_repair":
        return repair.assignedFixer ? (
          <Button size="sm" variant="outline" disabled>
            <Wrench className="mr-1 h-4 w-4" />
            In Progress
          </Button>
        ) : (
          <Button size="sm" onClick={() => handleAssignFixer(repair)}>
            <Wrench className="mr-1 h-4 w-4" />
            Assign Fixer
          </Button>
        );
      case "awaiting_price_confirmation":
        return (
          <Button size="sm" onClick={() => handleCallClient(repair)}>
            <Phone className="mr-1 h-4 w-4" />
            Call Client
          </Button>
        );
      case "fixed_awaiting_delivery":
        return (
          <Button size="sm" onClick={() => handleAssignCollector(repair)}>
            <Truck className="mr-1 h-4 w-4" />
            Assign Collector
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Operator Dashboard</h2>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold">{pendingCount}</div>
                <div className="ml-auto bg-yellow-100 p-2 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold">{inProgressCount}</div>
                <div className="ml-auto bg-blue-100 p-2 rounded-full">
                  <Wrench className="h-5 w-5 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold">{completedCount}</div>
                <div className="ml-auto bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search repairs..."
                className="pl-9"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-full md:w-48">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending_operator_review">Pending Review</SelectItem>
                <SelectItem value="confirmed_awaiting_collection">Awaiting Collection</SelectItem>
                <SelectItem value="in_repair">In Repair</SelectItem>
                <SelectItem value="awaiting_price_confirmation">Price Needs Confirmation</SelectItem>
                <SelectItem value="price_confirmed_in_repair">Price Confirmed</SelectItem>
                <SelectItem value="price_rejected">Price Rejected</SelectItem>
                <SelectItem value="fixed_awaiting_delivery">Fixed & Awaiting Delivery</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="repairs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="repairs">Repair Requests</TabsTrigger>
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {notifications.some(n => n.isNew) && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="repairs">
            <div className="grid gap-4">
              {filteredRepairs.length > 0 ? (
                filteredRepairs.map((repair) => (
                  <Card key={repair.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-4 md:p-6 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">Repair #{repair.id}</h3>
                                {getStatusBadge(repair.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Created: {repair.dateCreated} • Updated: {repair.lastUpdated}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <UserCircle className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm font-medium">{repair.clientName}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">{repair.clientPhone}</p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm mb-1">
                                <span className="font-medium">Device:</span> {repair.deviceType} - {repair.deviceModel}
                              </p>
                              <p className="text-sm line-clamp-2">
                                <span className="font-medium">Issue:</span> {repair.issue}
                              </p>
                            </div>
                          </div>
                          
                          {repair.price && (
                            <div className="mt-4 p-2 bg-green-50 rounded-md">
                              <p className="text-sm font-medium text-green-800">
                                Repair Price: ${repair.price}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-gray-50 p-4 md:p-6 flex flex-col justify-center gap-4 md:min-w-[200px]">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(repair)}
                          >
                            View Details
                          </Button>
                          
                          {getStatusButtons(repair)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <CardDescription>No repairs matching your filters</CardDescription>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    id={notification.id}
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    time={notification.time}
                    isNew={notification.isNew}
                    onClick={() => handleNotificationClick(notification)}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Bell className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">No notifications yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Repair Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Repair Details</DialogTitle>
            <DialogDescription>
              {selectedRepair?.id} - {selectedRepair?.deviceModel}
            </DialogDescription>
          </DialogHeader>
          {selectedRepair && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Client Name</Label>
                  <p>{selectedRepair.clientName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Phone</Label>
                  <p>{selectedRepair.clientPhone}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <p>{getStatusBadge(selectedRepair.status)}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Device</Label>
                  <p>{selectedRepair.deviceType} - {selectedRepair.deviceModel}</p>
                </div>
                {selectedRepair.assignedCollector && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Assigned Collector</Label>
                    <p>{collectors.find(c => c.id === selectedRepair.assignedCollector)?.name || selectedRepair.assignedCollector}</p>
                  </div>
                )}
                {selectedRepair.assignedFixer && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Assigned Fixer</Label>
                    <p>{fixers.find(f => f.id === selectedRepair.assignedFixer)?.name || selectedRepair.assignedFixer}</p>
                  </div>
                )}
                {selectedRepair.price !== undefined && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Repair Price</Label>
                    <p className="font-semibold">${selectedRepair.price}</p>
                  </div>
                )}
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Issue Description</Label>
                <p className="text-sm mt-1">{selectedRepair.issue}</p>
              </div>
              
              {selectedRepair.notes && (
                <div>
                  <Label className="text-sm text-muted-foreground">Notes</Label>
                  <p className="text-sm mt-1 whitespace-pre-line">{selectedRepair.notes}</p>
                </div>
              )}
              
              <div className="pt-4 flex justify-end gap-2">
                {getStatusButtons(selectedRepair)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Repair Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirm Repair Request</DialogTitle>
            <DialogDescription>
              Confirm this repair request and assign a collector to pick up the device.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="collectorId">Assign Collector</Label>
              <Select 
                value={confirmForm.collectorId} 
                onValueChange={(value) => setConfirmForm({...confirmForm, collectorId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a collector" />
                </SelectTrigger>
                <SelectContent>
                  {collectors.map((collector) => (
                    <SelectItem 
                      key={collector.id} 
                      value={collector.id}
                      disabled={!collector.available}
                    >
                      {collector.name} {!collector.available && "(Unavailable)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={confirmForm.notes}
                onChange={(e) => setConfirmForm({...confirmForm, notes: e.target.value})}
                placeholder="Add any notes for the collector"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitConfirmRepair}
              disabled={!confirmForm.collectorId}
            >
              Confirm & Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Repair Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Repair Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this repair request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                value={rejectForm.reason}
                onChange={(e) => setRejectForm({...rejectForm, reason: e.target.value})}
                placeholder="Explain why this repair request is being rejected"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={submitRejectRepair}
              disabled={!rejectForm.reason}
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Collector Dialog */}
      <Dialog open={assignCollectorDialogOpen} onOpenChange={setAssignCollectorDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Collector for Delivery</DialogTitle>
            <DialogDescription>
              Assign a collector to return the repaired device to the client.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="collectorId">Assign Collector</Label>
              <Select 
                value={confirmForm.collectorId} 
                onValueChange={(value) => setConfirmForm({...confirmForm, collectorId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a collector" />
                </SelectTrigger>
                <SelectContent>
                  {collectors.map((collector) => (
                    <SelectItem 
                      key={collector.id} 
                      value={collector.id}
                      disabled={!collector.available}
                    >
                      {collector.name} {!collector.available && "(Unavailable)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes for Collector (Optional)</Label>
              <Textarea
                id="notes"
                value={confirmForm.notes}
                onChange={(e) => setConfirmForm({...confirmForm, notes: e.target.value})}
                placeholder="Add any delivery instructions"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignCollectorDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitAssignCollector}
              disabled={!confirmForm.collectorId}
            >
              Assign Collector
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Fixer Dialog */}
      <Dialog open={assignFixerDialogOpen} onOpenChange={setAssignFixerDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Fixer</DialogTitle>
            <DialogDescription>
              Assign a technician to handle this repair.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fixerId">Assign Fixer</Label>
              <Select 
                value={assignFixerForm.fixerId} 
                onValueChange={(value) => setAssignFixerForm({...assignFixerForm, fixerId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a fixer" />
                </SelectTrigger>
                <SelectContent>
                  {fixers.map((fixer) => (
                    <SelectItem 
                      key={fixer.id} 
                      value={fixer.id}
                      disabled={!fixer.available}
                    >
                      {fixer.name} - {fixer.specialty} {!fixer.available && "(Unavailable)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignFixerDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitAssignFixer}
              disabled={!assignFixerForm.fixerId}
            >
              Assign Fixer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Call Client Dialog */}
      <Dialog open={callClientDialogOpen} onOpenChange={setCallClientDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Price Confirmation Call</DialogTitle>
            <DialogDescription>
              Call the client to confirm if they accept the repair price of ${selectedRepair?.price}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <Button 
                  className="h-16 w-16 rounded-full bg-green-100 hover:bg-green-200 text-green-800"
                  variant="ghost"
                  onClick={() => setCallClientForm({...callClientForm, accepted: true})}
                >
                  <CheckCircle className={`h-8 w-8 ${callClientForm.accepted ? 'text-green-600' : 'text-green-400'}`} />
                </Button>
                <p className="mt-2 text-sm font-medium">Accept</p>
              </div>
              <div className="text-center">
                <Button 
                  className="h-16 w-16 rounded-full bg-red-100 hover:bg-red-200 text-red-800"
                  variant="ghost"
                  onClick={() => setCallClientForm({...callClientForm, accepted: false})}
                >
                  <X className={`h-8 w-8 ${!callClientForm.accepted ? 'text-red-600' : 'text-red-400'}`} />
                </Button>
                <p className="mt-2 text-sm font-medium">Reject</p>
              </div>
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <p className="text-sm font-medium">Client Contact Information:</p>
              <p className="text-sm mt-1">{selectedRepair?.clientName}</p>
              <p className="text-sm font-medium mt-2">Phone:</p>
              <p className="text-sm">{selectedRepair?.clientPhone}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Call Notes</Label>
              <Textarea
                id="notes"
                value={callClientForm.notes}
                onChange={(e) => setCallClientForm({...callClientForm, notes: e.target.value})}
                placeholder="Add notes about the call"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCallClientDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitCallClient}
              disabled={!callClientForm.notes}
              variant={callClientForm.accepted ? "default" : "destructive"}
            >
              Confirm {callClientForm.accepted ? "Acceptance" : "Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OperatorDashboard;
