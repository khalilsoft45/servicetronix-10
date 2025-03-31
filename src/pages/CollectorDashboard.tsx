
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, Clock, CheckCircle2, AlertTriangle, Truck, MapPin, Phone as PhoneIcon, Info, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// Sample data for pickup requests
const pickupRequestsData = [
  {
    id: "REQ-001",
    clientName: "John Doe",
    clientPhone: "+1 (555) 123-4567",
    deviceType: "MacBook Pro 2019",
    issue: "Screen not working properly",
    pickupDate: "2023-06-24",
    address: "123 Main St, Apartment 4B, New York, NY 10001",
    status: "scheduled",
    notes: "Client will be available between 10 AM and 2 PM",
  },
  {
    id: "REQ-002",
    clientName: "Sarah Williams",
    clientPhone: "+1 (555) 987-6543",
    deviceType: "iPhone 12",
    issue: "Battery drains quickly",
    pickupDate: "2023-06-23",
    address: "456 Elm Avenue, Chicago, IL 60007",
    status: "scheduled",
    notes: "Apartment building with security desk. Notify client when arriving.",
  },
  {
    id: "REQ-003",
    clientName: "Michael Brown",
    clientPhone: "+1 (555) 444-5555",
    deviceType: "HP Laptop",
    issue: "Keyboard not working properly",
    pickupDate: "2023-06-23",
    address: "321 Pine Road, Seattle, WA 98101",
    status: "in_transit",
    notes: "Client has been notified, currently on the way to pickup",
  },
];

// Sample data for collected devices
const collectedDevicesData = [
  {
    id: "REQ-005",
    clientName: "Emily Davis",
    clientPhone: "+1 (555) 666-7777",
    deviceType: "iPad Pro 2021",
    issue: "Cracked screen",
    pickupDate: "2023-06-18",
    collectionDate: "2023-06-18",
    address: "654 Maple Drive, Austin, TX 78701",
    status: "collected",
    assignedFixer: "Robert Parker",
    notes: "Device has original packaging and charger included",
  },
  {
    id: "REQ-006",
    clientName: "Jessica Taylor",
    clientPhone: "+1 (555) 888-9999",
    deviceType: "Dell XPS Desktop",
    issue: "Computer randomly shuts down",
    pickupDate: "2023-06-17",
    collectionDate: "2023-06-17",
    address: "987 Cedar Street, Denver, CO 80201",
    status: "collected",
    assignedFixer: "David Johnson",
    notes: "Very heavy computer, required dolly for transport",
  },
];

const CollectorDashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [pickupRequests, setPickupRequests] = useState(pickupRequestsData);
  const [collectedDevices, setCollectedDevices] = useState(collectedDevicesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationNotes, setConfirmationNotes] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = (item: any) => {
    setCurrentItem(item);
    setDetailsOpen(true);
  };

  const handleMarkInTransit = (requestId: string) => {
    const updatedRequests = pickupRequests.map(req => {
      if (req.id === requestId) {
        return { ...req, status: "in_transit" };
      }
      return req;
    });

    setPickupRequests(updatedRequests);
    toast({
      title: "Status updated",
      description: `Request ${requestId} marked as in transit`,
    });
  };

  const handleConfirmCollection = (requestId: string) => {
    const request = pickupRequests.find(req => req.id === requestId);
    if (!request) return;

    setCurrentItem(request);
    setConfirmationNotes("");
    setConfirmationOpen(true);
  };

  const handleCompleteCollection = () => {
    if (!currentItem) return;

    // Move from pickup requests to collected devices
    const updatedRequests = pickupRequests.filter(req => req.id !== currentItem.id);
    
    const collectedDevice = {
      ...currentItem,
      status: "collected",
      collectionDate: new Date().toISOString().split('T')[0],
      notes: confirmationNotes || currentItem.notes,
    };

    setPickupRequests(updatedRequests);
    setCollectedDevices([collectedDevice, ...collectedDevices]);
    setConfirmationOpen(false);

    toast({
      title: "Collection confirmed",
      description: `Device ${currentItem.id} has been collected successfully`,
    });
  };

  // Filter data based on search query
  const filteredPickupRequests = pickupRequests.filter(req => {
    return (
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.deviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredCollectedDevices = collectedDevices.filter(device => {
    return (
      device.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.deviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
      case "in_transit":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In Transit</Badge>;
      case "collected":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Collected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t('collector.dashboard')}</h2>
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
              placeholder={t('collector.search.pickups')}
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
                <p className="text-sm font-medium">{pickupRequests.filter(r => r.status === "scheduled").length}</p>
                <p className="text-xs text-muted-foreground">{t('collector.scheduled')}</p>
              </div>
            </Card>
            <Card className="border p-2 px-3 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Truck className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{pickupRequests.filter(r => r.status === "in_transit").length}</p>
                <p className="text-xs text-muted-foreground">{t('collector.in.transit')}</p>
              </div>
            </Card>
            <Card className="border p-2 px-3 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{collectedDevices.length}</p>
                <p className="text-xs text-muted-foreground">{t('collector.collected')}</p>
              </div>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="pickup" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pickup">{t('collector.pickup.requests')}</TabsTrigger>
            <TabsTrigger value="collected">{t('collector.collected.devices')}</TabsTrigger>
          </TabsList>
          <TabsContent value="pickup" className="space-y-4">
            {filteredPickupRequests.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPickupRequests.map((request) => (
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
                          <span className="text-muted-foreground">{t('collector.pickup.id')}:</span>
                          <span className="font-medium">{request.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('collector.pickup.date')}:</span>
                          <span>{request.pickupDate}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <PhoneIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-sm truncate">{request.clientPhone}</span>
                        </div>
                        <div className="flex items-start text-sm mt-1">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground mt-1" />
                          <span className="text-sm line-clamp-2">{request.address}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(request)}
                        >
                          <Info className="h-4 w-4 mr-1" />
                          {t('collector.details')}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`tel:${request.clientPhone.replace(/\D/g, '')}`)}
                        >
                          <PhoneCall className="h-4 w-4" />
                        </Button>
                      </div>
                      {request.status === "scheduled" ? (
                        <Button 
                          size="sm" 
                          onClick={() => handleMarkInTransit(request.id)}
                        >
                          <Truck className="mr-1 h-4 w-4" />
                          {t('collector.start.transit')}
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleConfirmCollection(request.id)}
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          {t('collector.confirm.pickup')}
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
                    <Truck className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium">{t('collector.no.pickup.requests')}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('collector.no.pickup.description')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="collected" className="space-y-4">
            {filteredCollectedDevices.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCollectedDevices.map((device) => (
                  <Card key={device.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{device.deviceType}</CardTitle>
                          <CardDescription>{device.clientName}</CardDescription>
                        </div>
                        {getStatusBadge(device.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('collector.request.id')}:</span>
                          <span className="font-medium">{device.id}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('collector.collection.date')}:</span>
                          <span>{device.collectionDate}</span>
                        </div>
                        {device.assignedFixer && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('collector.assigned.to')}:</span>
                            <span>{device.assignedFixer}</span>
                          </div>
                        )}
                        <div className="flex items-start text-sm mt-1">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground mt-1" />
                          <span className="text-sm line-clamp-2">{device.address}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(device)}
                      >
                        <Info className="h-4 w-4 mr-1" />
                        {t('collector.view.details')}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium">{t('collector.no.collected.devices')}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('collector.no.collected.description')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('collector.item.details')}</DialogTitle>
            <DialogDescription>
              {currentItem?.id} - {currentItem?.deviceType}
            </DialogDescription>
          </DialogHeader>
          {currentItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">{t('collector.client')}:</p>
                  <p>{currentItem.clientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t('collector.status')}:</p>
                  <p>{getStatusBadge(currentItem.status)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t('collector.phone')}:</p>
                  <p>{currentItem.clientPhone}</p>
                </div>
                {currentItem.pickupDate && (
                  <div>
                    <p className="text-sm font-medium">{t('collector.pickup.date')}:</p>
                    <p>{currentItem.pickupDate}</p>
                  </div>
                )}
                {currentItem.collectionDate && (
                  <div>
                    <p className="text-sm font-medium">{t('collector.collected.date')}:</p>
                    <p>{currentItem.collectionDate}</p>
                  </div>
                )}
                {currentItem.assignedFixer && (
                  <div>
                    <p className="text-sm font-medium">{t('collector.assigned.fixer')}:</p>
                    <p>{currentItem.assignedFixer}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium mb-1">{t('collector.address')}:</p>
                <p className="text-sm">{currentItem.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">{t('collector.issue')}:</p>
                <p className="text-sm">{currentItem.issue}</p>
              </div>
              {currentItem.notes && (
                <div>
                  <p className="text-sm font-medium mb-1">{t('collector.notes')}:</p>
                  <p className="text-sm">{currentItem.notes}</p>
                </div>
              )}
              {currentItem.status !== "collected" && (
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`tel:${currentItem.clientPhone.replace(/\D/g, '')}`)}
                  >
                    <PhoneCall className="mr-2 h-4 w-4" />
                    {t('collector.call.client')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(currentItem.address)}`, '_blank')}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {t('collector.open.maps')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('collector.confirm.collection')}</DialogTitle>
            <DialogDescription>
              {t('collector.confirm.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {currentItem && (
              <div className="space-y-2">
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="font-medium">{currentItem.deviceType}</p>
                  <p className="text-sm">{currentItem.clientName} - {currentItem.id}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t('collector.collection.notes')}:</p>
                  <Textarea
                    value={confirmationNotes}
                    onChange={(e) => setConfirmationNotes(e.target.value)}
                    placeholder={t('collector.notes.placeholder')}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmationOpen(false)}
            >
              {t('collector.cancel')}
            </Button>
            <Button
              onClick={handleCompleteCollection}
            >
              {t('collector.confirm.collection')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectorDashboard;
