
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import RepairStatusCard from "@/components/dashboard/RepairStatusCard";
import NotificationItem, { NotificationType } from "@/components/dashboard/NotificationItem";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bell,
  User,
  Mail,
  Phone,
  MapPin,
  Lock
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
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Sample data for demonstration
const sampleRepairs = [
  {
    id: "REP-001",
    device: "MacBook Pro 2019",
    issue: "Screen not working properly, shows lines",
    status: "in_repair" as const,
    dateCreated: "12 Jun 2023",
    lastUpdated: "15 Jun 2023",
    assignedFixer: "John Smith",
  },
  {
    id: "REP-002",
    device: "iPhone 12",
    issue: "Battery draining too quickly",
    status: "completed" as const,
    dateCreated: "05 May 2023",
    lastUpdated: "10 May 2023",
    price: 85,
    fixerNotes: "Replaced battery and cleaned internal components to improve heat dissipation",
    assignedFixer: "Jane Doe",
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
  {
    id: "REP-005",
    device: "Dell XPS 13",
    issue: "Keyboard not responding correctly",
    status: "waiting_price_confirmation" as const,
    dateCreated: "18 Jun 2023",
    lastUpdated: "21 Jun 2023",
    price: 120,
    assignedFixer: "Mike Johnson",
  },
  {
    id: "REP-006",
    device: "Google Pixel 6",
    issue: "Camera not focusing properly",
    status: "repair_in_progress" as const,
    dateCreated: "15 Jun 2023",
    lastUpdated: "23 Jun 2023",
    price: 95,
    assignedFixer: "Sarah Williams",
  },
];

// Sample notifications
const sampleNotifications = [
  {
    id: "NOTIF-001",
    type: "info" as NotificationType,
    title: "Price Set for Your Repair",
    message: "The technician has set a price of $120 for your Dell XPS repair. Please confirm if you accept.",
    time: "2 hours ago",
    isNew: true,
    repairId: "REP-005"
  },
  {
    id: "NOTIF-002",
    type: "success" as NotificationType,
    title: "Repair Completed",
    message: "Your iPhone 12 has been successfully repaired and is ready for delivery.",
    time: "1 day ago",
    isNew: false,
    repairId: "REP-002"
  },
  {
    id: "NOTIF-003",
    type: "alert" as NotificationType,
    title: "Device Collection Scheduled",
    message: "A collector will pick up your Samsung Galaxy S21 tomorrow between 10 AM and 2 PM.",
    time: "3 days ago",
    isNew: false,
    repairId: "REP-003"
  }
];

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
});

// Password change schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  newPassword: z.string().min(6, {
    message: "New password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Confirm password must be at least 6 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [repairs] = useState(sampleRepairs);
  const [notifications] = useState(sampleNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newRepairForm, setNewRepairForm] = useState({
    deviceType: "",
    deviceModel: "",
    issue: "",
    additionalInfo: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [priceConfirmDialog, setPriceConfirmDialog] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("repairs");

  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "123-456-7890", // Default value for demo
      address: "123 Main St, Anytown, USA", // Default value for demo
    },
  });

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

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

  const handleNotificationClick = (notification: any) => {
    const repair = repairs.find(r => r.id === notification.repairId);
    if (repair && repair.status === "waiting_price_confirmation") {
      setSelectedRepair(repair);
      setPriceConfirmDialog(true);
    } else {
      toast({
        title: "Notification viewed",
        description: `You viewed notification about ${notification.repairId}`,
      });
    }
  };

  const handlePriceConfirm = (accept: boolean) => {
    toast({
      title: accept ? "Price accepted" : "Price rejected",
      description: accept 
        ? "The technician will proceed with the repair." 
        : "The device will be returned without repair.",
    });
    setPriceConfirmDialog(false);
  };

  const onProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const onPasswordSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    // In a real app, this would make an API call to update the password
    toast({
      title: "Password changed",
      description: "Your password has been changed successfully.",
    });
    passwordForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
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
  const inProgressCount = repairs.filter(r => [
    "in_repair", 
    "awaiting_collection", 
    "fixed_awaiting_delivery",
    "repair_in_progress",
    "price_confirmed_in_repair"
  ].includes(r.status as any)).length;
  const pendingCount = repairs.filter(r => [
    "pending_confirmation",
    "waiting_price_confirmation"
  ].includes(r.status as any)).length;

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
                <SelectItem value="waiting_price_confirmation">Waiting for Approval</SelectItem>
                <SelectItem value="repair_in_progress">Repair in Progress</SelectItem>
                <SelectItem value="price_confirmed_in_repair">In Repair (Price Confirmed)</SelectItem>
                <SelectItem value="fixed_awaiting_delivery">Fixed & Awaiting Delivery</SelectItem>
                <SelectItem value="repair_rejected">Repair Rejected</SelectItem>
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
        
        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="repairs">My Repairs</TabsTrigger>
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {notifications.some(n => n.isNew) && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></span>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="repairs" className="space-y-4">
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
                    price={repair.price}
                    fixerNotes={repair.fixerNotes}
                    assignedFixer={repair.assignedFixer}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-lg text-gray-500">No repairs found matching your filters.</p>
                </div>
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
          
          <TabsContent value="profile">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details and personal information.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <FormControl>
                                <Input className="pl-9" placeholder="Your name" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <FormControl>
                                <Input className="pl-9" placeholder="Your email" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <FormControl>
                                <Input className="pl-9" placeholder="Your phone number" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                              <FormControl>
                                <Textarea className="pl-9 min-h-[100px]" placeholder="Your address" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full">Save Changes</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <FormControl>
                                <Input className="pl-9" type="password" placeholder="Your current password" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <FormControl>
                                <Input className="pl-9" type="password" placeholder="Your new password" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <FormControl>
                                <Input className="pl-9" type="password" placeholder="Confirm your new password" {...field} />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full">Update Password</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Price Confirmation Dialog */}
      <Dialog open={priceConfirmDialog} onOpenChange={setPriceConfirmDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirm Repair Price</DialogTitle>
            <DialogDescription>
              The technician has set a price for your repair. Do you want to proceed?
            </DialogDescription>
          </DialogHeader>
          {selectedRepair && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Device</h4>
                  <p className="font-medium">{selectedRepair.device}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Issue</h4>
                  <p>{selectedRepair.issue}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Repair Price</h4>
                  <p className="text-xl font-bold text-green-700">${selectedRepair.price}</p>
                </div>
                {selectedRepair.assignedFixer && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Technician</h4>
                    <p>{selectedRepair.assignedFixer}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="sm:flex-1" 
              onClick={() => handlePriceConfirm(false)}
            >
              Reject
            </Button>
            <Button 
              className="sm:flex-1" 
              onClick={() => handlePriceConfirm(true)}
            >
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Dashboard;
