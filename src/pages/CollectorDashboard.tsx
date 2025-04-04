
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, CheckCircle, MapPin, Phone, Clock, ArrowRight, Calendar, UserCircle, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import NotificationItem, { NotificationType } from "@/components/dashboard/NotificationItem";

// Types
type AssignmentStatus = 
  | "pending_pickup" 
  | "on_the_way_pickup" 
  | "picked_up" 
  | "delivered_to_repair" 
  | "pending_delivery" 
  | "on_the_way_delivery" 
  | "delivered_to_client" 
  | "completed";

interface Assignment {
  id: string;
  repairId: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  deviceType: string;
  deviceModel: string;
  status: AssignmentStatus;
  dateAssigned: string;
  timeWindow?: string;
  notes?: string;
  isDelivery: boolean;
}

// Sample data
const sampleAssignments: Assignment[] = [
  {
    id: "ASSIGN-001",
    repairId: "REP-003",
    clientName: "Michael Wilson",
    clientPhone: "+1 555-222-3333",
    clientAddress: "123 Main St, Apt 4B, New York, NY 10001",
    deviceType: "Phone",
    deviceModel: "Samsung Galaxy S21",
    status: "pending_pickup",
    dateAssigned: "2023-06-20",
    timeWindow: "10:00 AM - 2:00 PM",
    notes: "Client will be home all day. The building has a doorman.",
    isDelivery: false
  },
  {
    id: "ASSIGN-002",
    repairId: "REP-006",
    clientName: "Sarah Davis",
    clientPhone: "+1 555-666-9999",
    clientAddress: "456 Park Ave, Brooklyn, NY 11201",
    deviceType: "Phone",
    deviceModel: "Google Pixel 6",
    status: "pending_delivery",
    dateAssigned: "2023-06-25",
    timeWindow: "1:00 PM - 5:00 PM",
    notes: "Please call 10 minutes before arrival. The device has been repaired and ready for delivery.",
    isDelivery: true
  },
  {
    id: "ASSIGN-003",
    repairId: "REP-001",
    clientName: "John Doe",
    clientPhone: "+1 555-123-4567",
    clientAddress: "789 Broadway, Manhattan, NY 10003",
    deviceType: "Laptop",
    deviceModel: "MacBook Pro 2019",
    status: "delivered_to_repair",
    dateAssigned: "2023-06-15",
    isDelivery: false
  },
  {
    id: "ASSIGN-004",
    repairId: "REP-002",
    clientName: "Jane Smith",
    clientPhone: "+1 555-987-6543",
    clientAddress: "321 5th Ave, Queens, NY 11106",
    deviceType: "Phone",
    deviceModel: "iPhone 12",
    status: "delivered_to_client",
    dateAssigned: "2023-06-10",
    isDelivery: true
  }
];

// Sample notifications
const sampleNotifications = [
  {
    id: "NOTIF-001",
    type: "info" as NotificationType,
    title: "New Pickup Assignment",
    message: "You have been assigned to pick up a Samsung Galaxy S21 from Michael Wilson.",
    time: "2 hours ago",
    isNew: true,
    assignmentId: "ASSIGN-001"
  },
  {
    id: "NOTIF-002",
    type: "info" as NotificationType,
    title: "New Delivery Assignment",
    message: "You have been assigned to deliver a repaired Google Pixel 6 to Sarah Davis.",
    time: "5 hours ago",
    isNew: true,
    assignmentId: "ASSIGN-002"
  },
  {
    id: "NOTIF-003",
    type: "success" as NotificationType,
    title: "Assignment Completed",
    message: "Your delivery of the iPhone 12 has been marked as completed.",
    time: "2 days ago",
    isNew: false,
    assignmentId: "ASSIGN-004"
  }
];

const CollectorDashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>(sampleAssignments);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    notes: "",
    newStatus: "" as AssignmentStatus | "",
  });

  const activeAssignments = assignments.filter(a => 
    !["delivered_to_client", "completed"].includes(a.status)
  );
  
  const completedAssignments = assignments.filter(a => 
    ["delivered_to_client", "completed"].includes(a.status)
  );

  const pickupAssignments = activeAssignments.filter(a => !a.isDelivery);
  const deliveryAssignments = activeAssignments.filter(a => a.isDelivery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setDetailsOpen(true);
  };

  const handleUpdateStatus = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setUpdateForm({
      notes: "",
      newStatus: getNextStatus(assignment.status),
    });
    setUpdateStatusDialogOpen(true);
  };

  const getNextStatus = (currentStatus: AssignmentStatus): AssignmentStatus => {
    switch (currentStatus) {
      case "pending_pickup":
        return "on_the_way_pickup";
      case "on_the_way_pickup":
        return "picked_up";
      case "picked_up":
        return "delivered_to_repair";
      case "pending_delivery":
        return "on_the_way_delivery";
      case "on_the_way_delivery":
        return "delivered_to_client";
      default:
        return currentStatus;
    }
  };

  const getStatusLabel = (status: AssignmentStatus): string => {
    switch (status) {
      case "pending_pickup":
        return "Pending Pickup";
      case "on_the_way_pickup":
        return "On the Way to Pickup";
      case "picked_up":
        return "Picked Up";
      case "delivered_to_repair":
        return "Delivered to Repair Center";
      case "pending_delivery":
        return "Pending Delivery";
      case "on_the_way_delivery":
        return "On the Way to Deliver";
      case "delivered_to_client":
        return "Delivered to Client";
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: AssignmentStatus): string => {
    switch (status) {
      case "pending_pickup":
        return "bg-yellow-100 text-yellow-800";
      case "on_the_way_pickup":
        return "bg-blue-100 text-blue-800";
      case "picked_up":
        return "bg-green-100 text-green-800";
      case "delivered_to_repair":
        return "bg-indigo-100 text-indigo-800";
      case "pending_delivery":
        return "bg-purple-100 text-purple-800";
      case "on_the_way_delivery":
        return "bg-blue-100 text-blue-800";
      case "delivered_to_client":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUpdateSubmit = () => {
    if (!selectedAssignment || !updateForm.newStatus) return;

    const updatedAssignments = assignments.map(assignment => {
      if (assignment.id === selectedAssignment.id) {
        return {
          ...assignment,
          status: updateForm.newStatus,
          notes: updateForm.notes 
            ? (assignment.notes ? `${assignment.notes}\n${updateForm.notes}` : updateForm.notes)
            : assignment.notes
        };
      }
      return assignment;
    });

    setAssignments(updatedAssignments);
    setUpdateStatusDialogOpen(false);
    toast({
      title: "Status updated",
      description: `Assignment status updated to ${getStatusLabel(updateForm.newStatus)}.`
    });
  };

  const handleNotificationClick = (notification: any) => {
    const assignment = assignments.find(a => a.id === notification.assignmentId);
    if (assignment) {
      setSelectedAssignment(assignment);
      setDetailsOpen(true);
      
      // Mark notification as read
      setNotifications(
        notifications.map(n => 
          n.id === notification.id ? { ...n, isNew: false } : n
        )
      );
    }
  };

  // Filter assignments based on search query
  const filteredPickups = pickupAssignments.filter(assignment => {
    return searchQuery === "" ||
      assignment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.deviceModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.repairId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredDeliveries = deliveryAssignments.filter(assignment => {
    return searchQuery === "" ||
      assignment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.deviceModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.repairId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredCompleted = completedAssignments.filter(assignment => {
    return searchQuery === "" ||
      assignment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.deviceModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.repairId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusBadge = (status: AssignmentStatus) => {
    return <Badge className={getStatusColor(status)}>{getStatusLabel(status)}</Badge>;
  };

  const getButtonLabel = (status: AssignmentStatus): string => {
    switch (status) {
      case "pending_pickup":
        return "Start Pickup";
      case "on_the_way_pickup":
        return "Mark as Picked Up";
      case "picked_up":
        return "Mark as Delivered to Shop";
      case "pending_delivery":
        return "Start Delivery";
      case "on_the_way_delivery":
        return "Mark as Delivered";
      default:
        return "Update Status";
    }
  };

  const canUpdateStatus = (status: AssignmentStatus): boolean => {
    return ![
      "delivered_to_repair", 
      "delivered_to_client", 
      "completed"
    ].includes(status);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Collector Dashboard</h2>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Pickups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold">{pickupAssignments.length}</div>
                <div className="ml-auto bg-blue-100 p-2 rounded-full">
                  <ArrowRight className="h-5 w-5 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-2xl font-bold">{deliveryAssignments.length}</div>
                <div className="ml-auto bg-purple-100 p-2 rounded-full">
                  <ArrowRight className="h-5 w-5 transform rotate-180 text-purple-700" />
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
                <div className="text-2xl font-bold">{completedAssignments.length}</div>
                <div className="ml-auto bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search assignments..."
              className="pl-9"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <Tabs defaultValue="pickups" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pickups">Pickups</TabsTrigger>
            <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {notifications.some(n => n.isNew) && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pickups">
            <div className="grid gap-4">
              {filteredPickups.length > 0 ? (
                filteredPickups.map((assignment) => (
                  <Card key={assignment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-4 md:p-6 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">Assignment #{assignment.id}</h3>
                                {getStatusBadge(assignment.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Repair ID: {assignment.repairId} • Assigned: {assignment.dateAssigned}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <UserCircle className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm font-medium">{assignment.clientName}</p>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">{assignment.clientPhone}</p>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                <p className="text-sm">{assignment.clientAddress}</p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm mb-2">
                                <span className="font-medium">Device:</span> {assignment.deviceType} - {assignment.deviceModel}
                              </p>
                              
                              {assignment.timeWindow && (
                                <div className="flex items-center gap-2 mb-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <p className="text-sm">{assignment.timeWindow}</p>
                                </div>
                              )}
                              
                              {assignment.notes && (
                                <p className="text-sm line-clamp-2">
                                  <span className="font-medium">Notes:</span> {assignment.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 md:p-6 flex flex-col justify-center gap-4 md:min-w-[200px]">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(assignment)}
                          >
                            View Details
                          </Button>
                          
                          {canUpdateStatus(assignment.status) && (
                            <Button 
                              size="sm"
                              onClick={() => handleUpdateStatus(assignment)}
                            >
                              {getButtonLabel(assignment.status)}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <CardDescription>No pickup assignments found</CardDescription>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="deliveries">
            <div className="grid gap-4">
              {filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((assignment) => (
                  <Card key={assignment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-4 md:p-6 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">Assignment #{assignment.id}</h3>
                                {getStatusBadge(assignment.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Repair ID: {assignment.repairId} • Assigned: {assignment.dateAssigned}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <UserCircle className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm font-medium">{assignment.clientName}</p>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">{assignment.clientPhone}</p>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                <p className="text-sm">{assignment.clientAddress}</p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm mb-2">
                                <span className="font-medium">Device:</span> {assignment.deviceType} - {assignment.deviceModel}
                              </p>
                              
                              {assignment.timeWindow && (
                                <div className="flex items-center gap-2 mb-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <p className="text-sm">{assignment.timeWindow}</p>
                                </div>
                              )}
                              
                              {assignment.notes && (
                                <p className="text-sm line-clamp-2">
                                  <span className="font-medium">Notes:</span> {assignment.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 md:p-6 flex flex-col justify-center gap-4 md:min-w-[200px]">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(assignment)}
                          >
                            View Details
                          </Button>
                          
                          {canUpdateStatus(assignment.status) && (
                            <Button 
                              size="sm"
                              onClick={() => handleUpdateStatus(assignment)}
                            >
                              {getButtonLabel(assignment.status)}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <CardDescription>No delivery assignments found</CardDescription>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid gap-4">
              {filteredCompleted.length > 0 ? (
                filteredCompleted.map((assignment) => (
                  <Card key={assignment.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">Assignment #{assignment.id}</CardTitle>
                          <CardDescription>Repair ID: {assignment.repairId}</CardDescription>
                        </div>
                        {getStatusBadge(assignment.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm mb-1 font-medium">{assignment.clientName}</p>
                          <p className="text-sm">{assignment.deviceType} - {assignment.deviceModel}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">Assigned: {assignment.dateAssigned}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm line-clamp-1">{assignment.clientAddress}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(assignment)}
                        className="w-full"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <CardDescription>No completed assignments found</CardDescription>
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

      {/* Assignment Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Assignment Details</DialogTitle>
            <DialogDescription>
              {selectedAssignment?.id} - {selectedAssignment?.isDelivery ? "Delivery" : "Pickup"}
            </DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Repair ID</p>
                  <p className="font-medium">{selectedAssignment.repairId}</p>
                </div>
                {getStatusBadge(selectedAssignment.status)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Client</Label>
                  <p>{selectedAssignment.clientName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Phone</Label>
                  <p>{selectedAssignment.clientPhone}</p>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Label className="text-sm text-muted-foreground">Address</Label>
                  <p>{selectedAssignment.clientAddress}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Device</Label>
                  <p>{selectedAssignment.deviceType} - {selectedAssignment.deviceModel}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Date Assigned</Label>
                  <p>{selectedAssignment.dateAssigned}</p>
                </div>
                {selectedAssignment.timeWindow && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Time Window</Label>
                    <p>{selectedAssignment.timeWindow}</p>
                  </div>
                )}
              </div>
              
              {selectedAssignment.notes && (
                <div>
                  <Label className="text-sm text-muted-foreground">Notes</Label>
                  <p className="text-sm mt-1 whitespace-pre-line">{selectedAssignment.notes}</p>
                </div>
              )}
              
              <div className="pt-4 flex justify-end gap-2">
                {canUpdateStatus(selectedAssignment.status) && (
                  <Button onClick={() => handleUpdateStatus(selectedAssignment)}>
                    {getButtonLabel(selectedAssignment.status)}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={updateStatusDialogOpen} onOpenChange={setUpdateStatusDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Assignment Status</DialogTitle>
            <DialogDescription>
              Update the status of assignment #{selectedAssignment?.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium">Current Status</Label>
              <p className="text-sm mt-1">{selectedAssignment ? getStatusLabel(selectedAssignment.status) : ""}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">New Status</Label>
              <p className="text-sm mt-1 font-semibold">{updateForm.newStatus ? getStatusLabel(updateForm.newStatus) : ""}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={updateForm.notes}
                onChange={(e) => setUpdateForm({...updateForm, notes: e.target.value})}
                placeholder="Add any notes about this status update"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateSubmit}
              disabled={!updateForm.newStatus}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectorDashboard;
