
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
import { useToast } from "@/components/ui/use-toast";
import { Search, Phone, Calendar, CheckCircle2, X, Info, User, Phone as PhoneIcon, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Sample data for new requests
const newRequestsData = [
  {
    id: "REQ-001",
    clientName: "John Doe",
    clientPhone: "+1 (555) 123-4567",
    deviceType: "MacBook Pro 2019",
    issue: "Screen not working properly, shows lines when turned on.",
    dateSubmitted: "2023-06-22",
    address: "123 Main St, Apartment 4B, New York, NY 10001",
    status: "pending",
  },
  {
    id: "REQ-002",
    clientName: "Sarah Williams",
    clientPhone: "+1 (555) 987-6543",
    deviceType: "iPhone 12",
    issue: "Battery drains extremely quickly. Needs to be charged multiple times per day.",
    dateSubmitted: "2023-06-21",
    address: "456 Elm Avenue, Chicago, IL 60007",
    status: "pending",
  },
  {
    id: "REQ-003",
    clientName: "David Johnson",
    clientPhone: "+1 (555) 222-3333",
    deviceType: "Samsung Smart TV",
    issue: "No power. TV won't turn on even when plugged into different outlets.",
    dateSubmitted: "2023-06-20",
    address: "789 Oak Street, Miami, FL 33101",
    status: "pending",
  },
];

// Sample data for confirmed requests
const confirmedRequestsData = [
  {
    id: "REQ-004",
    clientName: "Michael Brown",
    clientPhone: "+1 (555) 444-5555",
    deviceType: "HP Laptop",
    issue: "Keyboard not working properly. Several keys unresponsive.",
    dateSubmitted: "2023-06-18",
    dateConfirmed: "2023-06-19",
    address: "321 Pine Road, Seattle, WA 98101",
    scheduledPickup: "2023-06-23",
    assignedCollector: "James Wilson",
    status: "confirmed",
  },
  {
    id: "REQ-005",
    clientName: "Emily Davis",
    clientPhone: "+1 (555) 666-7777",
    deviceType: "iPad Pro 2021",
    issue: "Cracked screen needs replacement. Touch still works but display is damaged.",
    dateSubmitted: "2023-06-17",
    dateConfirmed: "2023-06-18",
    address: "654 Maple Drive, Austin, TX 78701",
    scheduledPickup: "2023-06-24",
    assignedCollector: "Robert Miller",
    status: "confirmed",
  },
  {
    id: "REQ-006",
    clientName: "Jessica Taylor",
    clientPhone: "+1 (555) 888-9999",
    deviceType: "Dell XPS Desktop",
    issue: "Computer randomly shuts down during use. Possibly overheating.",
    dateSubmitted: "2023-06-16",
    dateConfirmed: "2023-06-17",
    address: "987 Cedar Street, Denver, CO 80201",
    scheduledPickup: "2023-06-22",
    assignedCollector: "James Wilson",
    status: "picked_up",
  },
];

// Sample collectors data
const collectorsData = [
  { id: 1, name: "James Wilson", available: true },
  { id: 2, name: "Robert Miller", available: true },
  { id: 3, name: "Thomas Anderson", available: false },
];

const OperatorDashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [newRequests, setNewRequests] = useState(newRequestsData);
  const [confirmedRequests, setConfirmedRequests] = useState(confirmedRequestsData);
  const [collectors] = useState(collectorsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<any>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmForm, setConfirmForm] = useState({
    pickupDate: "",
    collectorId: "",
    notes: "",
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = (request: any) => {
    setCurrentRequest(request);
    setDetailsOpen(true);
  };

  const handlePrepareConfirm = (request: any) => {
    setCurrentRequest(request);
    setConfirmForm({
      pickupDate: "",
      collectorId: "",
      notes: "",
    });
    setConfirmDialogOpen(true);
  };

  const handleConfirmRequest = () => {
    // Get collector name
    const collector = collectors.find(c => c.id === parseInt(confirmForm.collectorId));
    if (!collector) {
      toast({
        title: "Error",
        description: "Please select a valid collector",
        variant: "destructive",
      });
      return;
    }

    // Update request lists
    const updatedNewRequests = newRequests.filter(req => req.id !== currentRequest.id);
    const confirmedRequest = {
      ...currentRequest,
      status: "confirmed",
      dateConfirmed: new Date().toISOString().split('T')[0],
      scheduledPickup: confirmForm.pickupDate,
      assignedCollector: collector.name,
      notes: confirmForm.notes,
    };

    setNewRequests(updatedNewRequests);
    setConfirmedRequests([confirmedRequest, ...confirmedRequests]);
    setConfirmDialogOpen(false);

    toast({
      title: "Request confirmed",
      description: `Request ${currentRequest.id} has been confirmed and assigned to ${collector.name}`,
    });
  };

  const handleRejectRequest = (requestId: string) => {
    setNewRequests(newRequests.filter(req => req.id !== requestId));
    toast({
      title: "Request rejected",
      description: `Request ${requestId} has been rejected`,
    });
  };

  const handleMarkAsPickedUp = (requestId: string) => {
    const updatedConfirmedRequests = confirmedRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: "picked_up",
          pickupDate: new Date().toISOString().split('T')[0],
        };
      }
      return req;
    });

    setConfirmedRequests(updatedConfirmedRequests);
    toast({
      title: "Request updated",
      description: `Request ${requestId} has been marked as picked up`,
    });
  };

  // Filter data based on search query
  const filteredNewRequests = newRequests.filter(req => {
    return (
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.deviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.issue.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredConfirmedRequests = confirmedRequests.filter(req => {
    return (
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.deviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.assignedCollector && req.assignedCollector.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Confirmed</Badge>;
      case "picked_up":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Picked Up</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t('operator.dashboard')}</h2>
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
              placeholder={t('operator.search.requests')}
              className="pl-9"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex space-x-2">
            <Card className="border p-2 px-3 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Phone className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{newRequests.length}</p>
                <p className="text-xs text-muted-foreground">{t('operator.new')}</p>
              </div>
            </Card>
            <Card className="border p-2 px-3 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{confirmedRequests.filter(r => r.status === "confirmed").length}</p>
                <p className="text-xs text-muted-foreground">{t('operator.scheduled')}</p>
              </div>
            </Card>
            <Card className="border p-2 px-3 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{confirmedRequests.filter(r => r.status === "picked_up").length}</p>
                <p className="text-xs text-muted-foreground">{t('operator.picked.up')}</p>
              </div>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="new" className="space-y-4">
          <TabsList>
            <TabsTrigger value="new">{t('operator.new.requests')}</TabsTrigger>
            <TabsTrigger value="confirmed">{t('operator.confirmed.requests')}</TabsTrigger>
          </TabsList>
          <TabsContent value="new" className="space-y-4">
            {filteredNewRequests.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredNewRequests.map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{request.deviceType}</CardTitle>
                          <CardDescription>{request.clientName}</CardDescription>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('operator.request.id')}:</span>
                          <span className="font-medium">{request.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('operator.date.submitted')}:</span>
                          <span>{request.dateSubmitted}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <PhoneIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-sm truncate">{request.clientPhone}</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground mb-1">{t('operator.issue')}:</p>
                          <p className="text-sm line-clamp-2">{request.issue}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between gap-2 pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(request)}
                      >
                        <Info className="h-4 w-4 mr-1" />
                        {t('operator.details')}
                      </Button>
                      <div className="flex gap-1">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handlePrepareConfirm(request)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          {t('operator.confirm')}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center mb-3">
                    <Phone className="h-6 w-6 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-medium">{t('operator.no.new.requests')}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('operator.no.new.description')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="confirmed" className="space-y-4">
            {filteredConfirmedRequests.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredConfirmedRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{request.deviceType}</CardTitle>
                          <CardDescription>{request.clientName}</CardDescription>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('operator.request.id')}:</span>
                          <span className="font-medium">{request.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('operator.scheduled.pickup')}:</span>
                          <span>{request.scheduledPickup}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('operator.collector')}:</span>
                          <span>{request.assignedCollector}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <PhoneIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-sm truncate">{request.clientPhone}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(request)}
                      >
                        <Info className="h-4 w-4 mr-1" />
                        {t('operator.details')}
                      </Button>
                      {request.status === "confirmed" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleMarkAsPickedUp(request.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          {t('operator.mark.picked.up')}
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
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium">{t('operator.no.confirmed.requests')}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('operator.no.confirmed.description')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Request Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('operator.request.details')}</DialogTitle>
            <DialogDescription>
              {currentRequest?.id} - {currentRequest?.deviceType}
            </DialogDescription>
          </DialogHeader>
          {currentRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">{t('operator.client')}:</p>
                  <p>{currentRequest.clientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t('operator.status')}:</p>
                  <p>{getStatusBadge(currentRequest.status)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t('operator.phone')}:</p>
                  <p>{currentRequest.clientPhone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t('operator.date.submitted')}:</p>
                  <p>{currentRequest.dateSubmitted}</p>
                </div>
                {currentRequest.dateConfirmed && (
                  <div>
                    <p className="text-sm font-medium">{t('operator.date.confirmed')}:</p>
                    <p>{currentRequest.dateConfirmed}</p>
                  </div>
                )}
                {currentRequest.scheduledPickup && (
                  <div>
                    <p className="text-sm font-medium">{t('operator.scheduled.pickup')}:</p>
                    <p>{currentRequest.scheduledPickup}</p>
                  </div>
                )}
                {currentRequest.assignedCollector && (
                  <div>
                    <p className="text-sm font-medium">{t('operator.assigned.collector')}:</p>
                    <p>{currentRequest.assignedCollector}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium mb-1">{t('operator.address')}:</p>
                <p className="text-sm">{currentRequest.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">{t('operator.issue')}:</p>
                <p className="text-sm">{currentRequest.issue}</p>
              </div>
              {currentRequest.notes && (
                <div>
                  <p className="text-sm font-medium mb-1">{t('operator.notes')}:</p>
                  <p className="text-sm">{currentRequest.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Request Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('operator.confirm.request')}</DialogTitle>
            <DialogDescription>
              {currentRequest?.id} - {currentRequest?.deviceType}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pickupDate">{t('operator.pickup.date')}</Label>
              <Input
                id="pickupDate"
                type="date"
                value={confirmForm.pickupDate}
                onChange={(e) => setConfirmForm({ ...confirmForm, pickupDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collector">{t('operator.assign.collector')}</Label>
              <Select
                value={confirmForm.collectorId}
                onValueChange={(value) => setConfirmForm({ ...confirmForm, collectorId: value })}
              >
                <SelectTrigger id="collector">
                  <SelectValue placeholder={t('operator.select.collector')} />
                </SelectTrigger>
                <SelectContent>
                  {collectors
                    .filter(c => c.available)
                    .map(collector => (
                      <SelectItem key={collector.id} value={collector.id.toString()}>
                        {collector.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">{t('operator.additional.notes')}</Label>
              <Textarea
                id="notes"
                value={confirmForm.notes}
                onChange={(e) => setConfirmForm({ ...confirmForm, notes: e.target.value })}
                placeholder={t('operator.notes.placeholder')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              {t('operator.cancel')}
            </Button>
            <Button
              onClick={handleConfirmRequest}
              disabled={!confirmForm.pickupDate || !confirmForm.collectorId}
            >
              {t('operator.confirm.assignment')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OperatorDashboard;
