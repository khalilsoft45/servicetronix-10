
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Clock, CheckCircle2, AlertTriangle, Wrench, X, DollarSign, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import NotificationItem, { NotificationType } from "@/components/dashboard/NotificationItem";

// Sample assigned repairs data
const assignedRepairsData = [
  {
    id: "REP-001",
    clientName: "John Doe",
    deviceType: "MacBook Pro 2020",
    issue: "Screen not working, shows lines across the display when turned on.",
    status: "assigned",
    dateAssigned: "2023-06-15",
    estimatedCompletion: "",
    price: null,
    notes: "",
  },
  {
    id: "REP-002",
    clientName: "Jane Smith",
    deviceType: "iPhone 13",
    issue: "Battery drains extremely quickly, even when not in use.",
    status: "in_progress",
    dateAssigned: "2023-06-12",
    estimatedCompletion: "2023-06-18",
    price: 85,
    notes: "Ordered replacement battery, should arrive tomorrow.",
  },
  {
    id: "REP-003",
    clientName: "Michael Wilson",
    deviceType: "Samsung Galaxy S22",
    issue: "Cracked screen needs replacement.",
    status: "waiting_for_parts",
    dateAssigned: "2023-06-10",
    estimatedCompletion: "2023-06-20",
    price: 150,
    notes: "Waiting for replacement screen to arrive from supplier.",
  },
  {
    id: "REP-007",
    clientName: "Sarah Johnson",
    deviceType: "HP Spectre x360",
    issue: "Laptop not powering on at all.",
    status: "assigned",
    dateAssigned: "2023-06-16",
    estimatedCompletion: "",
    price: null,
    notes: "",
  },
  {
    id: "REP-008",
    clientName: "Robert Davis",
    deviceType: "iPad Air 2022",
    issue: "Touch screen unresponsive in certain areas.",
    status: "waiting_client_approval",
    dateAssigned: "2023-06-14",
    estimatedCompletion: "2023-06-19",
    price: 110,
    notes: "Need to replace touch digitizer.",
  },
];

// Sample completed repairs data
const completedRepairsData = [
  {
    id: "REP-004",
    clientName: "Emily Johnson",
    deviceType: "Dell XPS 15",
    issue: "Keyboard not responding to certain keys.",
    status: "completed",
    dateAssigned: "2023-05-28",
    dateCompleted: "2023-06-02",
    price: 120,
    notes: "Replaced keyboard assembly.",
  },
  {
    id: "REP-005",
    clientName: "Robert Brown",
    deviceType: "iPad Pro 2021",
    issue: "Charging port damaged.",
    status: "completed",
    dateAssigned: "2023-06-05",
    dateCompleted: "2023-06-08",
    price: 90,
    notes: "Replaced charging port and tested with multiple cables.",
  },
];

// Sample notifications
const sampleNotifications = [
  {
    id: "NOTIF-001",
    type: "info" as NotificationType,
    title: "New Repair Assigned",
    message: "You've been assigned to repair HP Spectre x360 (REP-007).",
    time: "1 hour ago",
    isNew: true,
    repairId: "REP-007"
  },
  {
    id: "NOTIF-002",
    type: "success" as NotificationType,
    title: "Repair Price Approved",
    message: "The client has approved the price for REP-002. You can proceed with the repair.",
    time: "3 hours ago",
    isNew: true,
    repairId: "REP-002"
  },
  {
    id: "NOTIF-003",
    type: "warning" as NotificationType,
    title: "Repair Price Rejected",
    message: "The client has rejected the price for iPad repair. The device will be returned.",
    time: "1 day ago",
    isNew: false,
    repairId: "REP-008"
  }
];

const FixerDashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [assignedRepairs, setAssignedRepairs] = useState(assignedRepairsData);
  const [completedRepairs, setCompletedRepairs] = useState(completedRepairsData);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [repairDetails, setRepairDetails] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [priceForm, setPriceForm] = useState({
    price: "",
    estimatedCompletion: "",
    notes: "",
  });
  const [completeForm, setCompleteForm] = useState({
    notes: "",
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = (repair: any) => {
    setRepairDetails(repair);
    setDetailsOpen(true);
  };

  const handleSetPrice = (repair: any) => {
    setRepairDetails(repair);
    setPriceForm({
      price: repair.price ? String(repair.price) : "",
      estimatedCompletion: repair.estimatedCompletion || "",
      notes: repair.notes || "",
    });
    setPriceDialogOpen(true);
  };

  const handleCompleteRepair = (repair: any) => {
    setRepairDetails(repair);
    setCompleteForm({
      notes: repair.notes || "",
    });
    setCompleteDialogOpen(true);
  };

  const handlePriceSubmit = () => {
    const updatedRepairs = assignedRepairs.map(repair => {
      if (repair.id === repairDetails.id) {
        return {
          ...repair,
          price: parseFloat(priceForm.price),
          estimatedCompletion: priceForm.estimatedCompletion,
          notes: priceForm.notes,
          status: "waiting_client_approval",
        };
      }
      return repair;
    });

    setAssignedRepairs(updatedRepairs);
    setPriceDialogOpen(false);
    toast({
      title: "Price set successfully",
      description: `Price for repair ${repairDetails.id} has been set to $${priceForm.price}`,
    });
  };

  const handleCompleteSubmit = () => {
    // Find the repair to mark as complete
    const repairToComplete = assignedRepairs.find(repair => repair.id === repairDetails.id);
    if (!repairToComplete) return;

    // Remove from assigned repairs
    setAssignedRepairs(assignedRepairs.filter(repair => repair.id !== repairDetails.id));

    // Add to completed repairs with today's date
    setCompletedRepairs([
      {
        ...repairToComplete,
        status: "completed",
        dateCompleted: new Date().toISOString().split('T')[0],
        notes: completeForm.notes,
      },
      ...completedRepairs,
    ]);

    setCompleteDialogOpen(false);
    toast({
      title: "Repair marked as complete",
      description: `Repair ${repairDetails.id} has been marked as completed.`,
    });
  };

  const handleNotificationClick = (notification: any) => {
    const repair = [...assignedRepairs, ...completedRepairs].find(r => r.id === notification.repairId);
    if (repair) {
      setRepairDetails(repair);
      setDetailsOpen(true);
      
      // Mark notification as read
      setNotifications(
        notifications.map(n => 
          n.id === notification.id ? { ...n, isNew: false } : n
        )
      );
    }
  };

  const filteredAssignedRepairs = assignedRepairs.filter(repair => {
    return (
      repair.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.deviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.issue.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredCompletedRepairs = completedRepairs.filter(repair => {
    return (
      repair.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.deviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.issue.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getStatusBadge = (status: string) => {
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

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t('fixer.dashboard')}</h2>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <Link to="/">
              <Button>{t('app.back.home')}</Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t('fixer.search.repairs')}
              className="pl-9"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex space-x-2">
            <Card className="border p-2 px-3 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{assignedRepairs.length}</p>
                <p className="text-xs text-muted-foreground">{t('fixer.assigned')}</p>
              </div>
            </Card>
            <Card className="border p-2 px-3 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{completedRepairs.length}</p>
                <p className="text-xs text-muted-foreground">{t('fixer.completed')}</p>
              </div>
            </Card>
            <Card className="border p-2 px-3 flex items-center space-x-2 relative">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Bell className="h-4 w-4 text-purple-600" />
              </div>
              {notifications.some(n => n.isNew) && (
                <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></div>
              )}
              <div>
                <p className="text-sm font-medium">{notifications.length}</p>
                <p className="text-xs text-muted-foreground">Notifications</p>
              </div>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="assigned" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assigned">{t('fixer.assigned.repairs')}</TabsTrigger>
            <TabsTrigger value="completed">{t('fixer.completed.repairs')}</TabsTrigger>
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {notifications.some(n => n.isNew) && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Assigned Repairs Tab */}
          <TabsContent value="assigned" className="space-y-4">
            {filteredAssignedRepairs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAssignedRepairs.map((repair) => (
                  <Card key={repair.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{repair.deviceType}</CardTitle>
                          <CardDescription>{repair.clientName}</CardDescription>
                        </div>
                        {getStatusBadge(repair.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('fixer.repair.id')}:</span>
                          <span className="font-medium">{repair.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('fixer.assigned.date')}:</span>
                          <span>{repair.dateAssigned}</span>
                        </div>
                        {repair.price && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('fixer.price')}:</span>
                            <span className="font-medium">${repair.price}</span>
                          </div>
                        )}
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground mb-1">{t('fixer.issue')}:</p>
                          <p className="text-sm line-clamp-2">{repair.issue}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(repair)}
                      >
                        {t('fixer.view.details')}
                      </Button>
                      
                      {repair.status === "assigned" ? (
                        <Button 
                          size="sm" 
                          onClick={() => handleSetPrice(repair)}
                        >
                          <DollarSign className="mr-1 h-4 w-4" />
                          {t('fixer.set.price')}
                        </Button>
                      ) : repair.status === "in_progress" ? (
                        <Button 
                          size="sm" 
                          onClick={() => handleCompleteRepair(repair)}
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          {t('fixer.mark.complete')}
                        </Button>
                      ) : repair.status === "waiting_client_approval" ? (
                        <Button size="sm" variant="outline" disabled>
                          <Clock className="mr-1 h-4 w-4" />
                          Awaiting Response
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant={repair.status === "waiting_for_parts" ? "outline" : "default"}
                          onClick={() => handleViewDetails(repair)}
                        >
                          <Wrench className="mr-1 h-4 w-4" />
                          {t('fixer.view.details')}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                    <Wrench className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium">{t('fixer.no.repairs.found')}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('fixer.no.repairs.description')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed Repairs Tab */}
          <TabsContent value="completed" className="space-y-4">
            {filteredCompletedRepairs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCompletedRepairs.map((repair) => (
                  <Card key={repair.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{repair.deviceType}</CardTitle>
                          <CardDescription>{repair.clientName}</CardDescription>
                        </div>
                        {getStatusBadge(repair.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('fixer.repair.id')}:</span>
                          <span className="font-medium">{repair.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('fixer.completion.date')}:</span>
                          <span>{repair.dateCompleted}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('fixer.price')}:</span>
                          <span className="font-medium">${repair.price}</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground mb-1">{t('fixer.issue')}:</p>
                          <p className="text-sm line-clamp-2">{repair.issue}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(repair)}
                      >
                        {t('fixer.view.details')}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium">{t('fixer.no.completed.repairs')}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('fixer.no.completed.description')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Notifications Tab */}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('fixer.repair.details')}</DialogTitle>
            <DialogDescription>
              {repairDetails?.id} - {repairDetails?.deviceType}
            </DialogDescription>
          </DialogHeader>
          {repairDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">{t('fixer.client')}:</p>
                  <p>{repairDetails.clientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t('fixer.status')}:</p>
                  <p>{getStatusBadge(repairDetails.status)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t('fixer.assigned.date')}:</p>
                  <p>{repairDetails.dateAssigned}</p>
                </div>
                {repairDetails.dateCompleted && (
                  <div>
                    <p className="text-sm font-medium">{t('fixer.completion.date')}:</p>
                    <p>{repairDetails.dateCompleted}</p>
                  </div>
                )}
                {repairDetails.estimatedCompletion && (
                  <div>
                    <p className="text-sm font-medium">{t('fixer.estimated.completion')}:</p>
                    <p>{repairDetails.estimatedCompletion}</p>
                  </div>
                )}
                {repairDetails.price !== null && (
                  <div>
                    <p className="text-sm font-medium">{t('fixer.price')}:</p>
                    <p>${repairDetails.price}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium mb-1">{t('fixer.issue')}:</p>
                <p className="text-sm">{repairDetails.issue}</p>
              </div>
              {repairDetails.notes && (
                <div>
                  <p className="text-sm font-medium mb-1">{t('fixer.notes')}:</p>
                  <p className="text-sm">{repairDetails.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Set Price Dialog */}
      <Dialog open={priceDialogOpen} onOpenChange={setPriceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('fixer.set.repair.price')}</DialogTitle>
            <DialogDescription>
              {repairDetails?.id} - {repairDetails?.deviceType}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">{t('fixer.price')} ($)</Label>
              <Input
                id="price"
                value={priceForm.price}
                onChange={(e) => setPriceForm({ ...priceForm, price: e.target.value })}
                type="number"
                min="0"
                step="0.01"
              />
              <p className="text-sm text-muted-foreground">Once set, this price cannot be changed later.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedCompletion">{t('fixer.estimated.completion.date')}</Label>
              <Input
                id="estimatedCompletion"
                value={priceForm.estimatedCompletion}
                onChange={(e) => setPriceForm({ ...priceForm, estimatedCompletion: e.target.value })}
                type="date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">{t('fixer.repair.notes')}</Label>
              <Textarea
                id="notes"
                value={priceForm.notes}
                onChange={(e) => setPriceForm({ ...priceForm, notes: e.target.value })}
                placeholder={t('fixer.repair.notes.placeholder')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPriceDialogOpen(false)}>
              {t('fixer.cancel')}
            </Button>
            <Button onClick={handlePriceSubmit} disabled={!priceForm.price || !priceForm.estimatedCompletion}>
              {t('fixer.confirm.price')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Complete Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Mark Repair as Complete</DialogTitle>
            <DialogDescription>
              {repairDetails?.id} - {repairDetails?.deviceType}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="completeNotes">Completion Notes</Label>
              <Textarea
                id="completeNotes"
                value={completeForm.notes}
                onChange={(e) => setCompleteForm({ ...completeForm, notes: e.target.value })}
                placeholder="Describe what was fixed and how"
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Once marked as complete, this repair will be finalized and moved to completed repairs.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteSubmit}>
              Confirm Completion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FixerDashboard;
