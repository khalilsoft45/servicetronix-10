
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
import { Search, Clock, CheckCircle2, AlertTriangle, Wrench, X, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

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

const FixerDashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [assignedRepairs, setAssignedRepairs] = useState(assignedRepairsData);
  const [completedRepairs, setCompletedRepairs] = useState(completedRepairsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [repairDetails, setRepairDetails] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [priceForm, setPriceForm] = useState({
    price: "",
    estimatedCompletion: "",
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

  const handlePriceSubmit = () => {
    const updatedRepairs = assignedRepairs.map(repair => {
      if (repair.id === repairDetails.id) {
        return {
          ...repair,
          price: parseFloat(priceForm.price),
          estimatedCompletion: priceForm.estimatedCompletion,
          notes: priceForm.notes,
          status: "in_progress",
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

  const handleMarkComplete = (repairId: string) => {
    // Find the repair to mark as complete
    const repairToComplete = assignedRepairs.find(repair => repair.id === repairId);
    if (!repairToComplete) return;

    // Remove from assigned repairs
    setAssignedRepairs(assignedRepairs.filter(repair => repair.id !== repairId));

    // Add to completed repairs with today's date
    setCompletedRepairs([
      {
        ...repairToComplete,
        status: "completed",
        dateCompleted: new Date().toISOString().split('T')[0],
      },
      ...completedRepairs,
    ]);

    toast({
      title: "Repair marked as complete",
      description: `Repair ${repairId} has been marked as completed.`,
    });
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
      case "completed":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Completed</Badge>;
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
            <Card className="border p-2 px-3 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {assignedRepairs.filter(r => r.status === "waiting_for_parts").length}
                </p>
                <p className="text-xs text-muted-foreground">{t('fixer.waiting')}</p>
              </div>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="assigned" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assigned">{t('fixer.assigned.repairs')}</TabsTrigger>
            <TabsTrigger value="completed">{t('fixer.completed.repairs')}</TabsTrigger>
          </TabsList>
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
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleMarkComplete(repair.id)}
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          {t('fixer.mark.complete')}
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
    </div>
  );
};

export default FixerDashboard;
