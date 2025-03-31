
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Edit, Trash, User, Settings, Wrench, Phone, Truck } from "lucide-react";

// Sample data for users table
const sampleUsers = [
  { id: 1, name: "Admin User", email: "admin@sala7li.com", role: "admin", active: true },
  { id: 2, name: "Fixer User", email: "fixer@sala7li.com", role: "fixer", active: true },
  { id: 3, name: "Operator User", email: "operator@sala7li.com", role: "operator", active: true },
  { id: 4, name: "Collector User", email: "collector@sala7li.com", role: "collector", active: true },
  { id: 5, name: "John Doe", email: "john@example.com", role: "client", active: true },
  { id: 6, name: "Jane Smith", email: "jane@example.com", role: "client", active: true },
];

// Sample data for repairs table
const sampleRepairs = [
  { id: "REP-001", client: "John Doe", device: "MacBook Pro", issue: "Screen issue", status: "pending", assignedTo: "" },
  { id: "REP-002", client: "Jane Smith", device: "iPhone 12", issue: "Battery problem", status: "in_repair", assignedTo: "Fixer User" },
  { id: "REP-003", client: "Alex Johnson", device: "Samsung TV", issue: "No power", status: "awaiting_collection", assignedTo: "Collector User" },
  { id: "REP-004", client: "Sarah Lee", device: "iPad Pro", issue: "Cracked screen", status: "completed", assignedTo: "Fixer User" },
];

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [users, setUsers] = useState(sampleUsers);
  const [repairs, setRepairs] = useState(sampleRepairs);
  const [searchQuery, setSearchQuery] = useState("");
  const [newUserDialog, setNewUserDialog] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setNewUserForm((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleAddUser = () => {
    // In a real application, this would make an API call
    const newUser = {
      id: users.length + 1,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      active: true,
    };

    setUsers([...users, newUser]);
    setNewUserDialog(false);
    setNewUserForm({
      name: "",
      email: "",
      password: "",
      role: "client",
    });

    toast({
      title: "User added successfully",
      description: `${newUserForm.name} has been added as a ${newUserForm.role}`,
    });
  };

  const handleDeleteUser = (id: number) => {
    // In a real application, this would make an API call
    setUsers(users.filter(user => user.id !== id));

    toast({
      title: "User deleted",
      description: "The user has been removed from the system",
    });
  };

  const handleAssignRepair = (repairId: string, assignee: string) => {
    // In a real application, this would make an API call
    setRepairs(repairs.map(repair => {
      if (repair.id === repairId) {
        return {
          ...repair,
          assignedTo: assignee,
          status: assignee ? "in_repair" : repair.status,
        };
      }
      return repair;
    }));

    toast({
      title: "Repair assigned",
      description: `Repair ${repairId} has been assigned to ${assignee}`,
    });
  };

  const handleUpdateRepairStatus = (repairId: string, status: string) => {
    // In a real application, this would make an API call
    setRepairs(repairs.map(repair => {
      if (repair.id === repairId) {
        return {
          ...repair,
          status,
        };
      }
      return repair;
    }));

    toast({
      title: "Status updated",
      description: `Repair ${repairId} status changed to ${status}`,
    });
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter repairs based on search query
  const filteredRepairs = repairs.filter(repair => 
    repair.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
    repair.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repair.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t('admin.dashboard')}</h2>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <Link to="/">
              <Button>{t('app.back.home')}</Button>
            </Link>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t('admin.overview')}</TabsTrigger>
            <TabsTrigger value="users">{t('admin.user.management')}</TabsTrigger>
            <TabsTrigger value="repairs">{t('admin.repair.management')}</TabsTrigger>
            <TabsTrigger value="settings">{t('admin.settings')}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('admin.total.users')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">{t('admin.user.count')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('admin.active.repairs')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {repairs.filter(r => r.status !== 'completed').length}
                  </div>
                  <p className="text-xs text-muted-foreground">{t('admin.repair.active.count')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('admin.completed.repairs')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {repairs.filter(r => r.status === 'completed').length}
                  </div>
                  <p className="text-xs text-muted-foreground">{t('admin.repair.completed.count')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('admin.system.status')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{t('admin.system.online')}</div>
                  <p className="text-xs text-muted-foreground">{t('admin.system.uptime')}</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>{t('admin.recent.activity')}</CardTitle>
                  <CardDescription>{t('admin.activity.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>{t('admin.new.repair.request')}</span>
                      <span className="text-muted-foreground">10 min ago</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>{t('admin.user.logged.in')}</span>
                      <span className="text-muted-foreground">45 min ago</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>{t('admin.repair.completed')}</span>
                      <span className="text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>{t('admin.new.user.registered')}</span>
                      <span className="text-muted-foreground">Yesterday</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>{t('admin.quick.actions')}</CardTitle>
                  <CardDescription>{t('admin.actions.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Dialog open={newUserDialog} onOpenChange={setNewUserDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="outline">
                        <User className="mr-2 h-4 w-4" />
                        {t('admin.add.new.user')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('admin.add.new.user')}</DialogTitle>
                        <DialogDescription>{t('admin.add.user.description')}</DialogDescription>
                      </DialogHeader>
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t('auth.name')}</Label>
                          <Input
                            id="name"
                            name="name"
                            value={newUserForm.name}
                            onChange={handleUserFormChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t('auth.email')}</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={newUserForm.email}
                            onChange={handleUserFormChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">{t('auth.password')}</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            value={newUserForm.password}
                            onChange={handleUserFormChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">{t('admin.user.role')}</Label>
                          <Select value={newUserForm.role} onValueChange={handleRoleChange}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('admin.select.role')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">{t('auth.role.admin')}</SelectItem>
                              <SelectItem value="fixer">{t('auth.role.fixer')}</SelectItem>
                              <SelectItem value="operator">{t('auth.role.operator')}</SelectItem>
                              <SelectItem value="collector">{t('auth.role.collector')}</SelectItem>
                              <SelectItem value="client">{t('auth.role.customer')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </form>
                      <DialogFooter>
                        <Button type="button" onClick={handleAddUser}>{t('admin.add.user')}</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button className="w-full" variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    {t('admin.system.settings')}
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Wrench className="mr-2 h-4 w-4" />
                    {t('admin.manage.repairs')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.user.management')}</CardTitle>
                <CardDescription>{t('admin.manage.users.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={t('admin.search.users')}
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Dialog open={newUserDialog} onOpenChange={setNewUserDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('admin.add.user')}
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('admin.user.name')}</TableHead>
                        <TableHead>{t('admin.user.email')}</TableHead>
                        <TableHead>{t('admin.user.role')}</TableHead>
                        <TableHead>{t('admin.user.status')}</TableHead>
                        <TableHead className="text-right">{t('admin.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                              user.role === 'fixer' ? 'bg-blue-100 text-blue-800' : 
                              user.role === 'operator' ? 'bg-green-100 text-green-800' : 
                              user.role === 'collector' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.active ? t('admin.active') : t('admin.inactive')}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="repairs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.repair.management')}</CardTitle>
                <CardDescription>{t('admin.manage.repairs.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={t('admin.search.repairs')}
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('admin.repair.id')}</TableHead>
                        <TableHead>{t('admin.client')}</TableHead>
                        <TableHead>{t('admin.device')}</TableHead>
                        <TableHead>{t('admin.issue')}</TableHead>
                        <TableHead>{t('admin.status')}</TableHead>
                        <TableHead>{t('admin.assigned.to')}</TableHead>
                        <TableHead className="text-right">{t('admin.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRepairs.map((repair) => (
                        <TableRow key={repair.id}>
                          <TableCell className="font-medium">{repair.id}</TableCell>
                          <TableCell>{repair.client}</TableCell>
                          <TableCell>{repair.device}</TableCell>
                          <TableCell>{repair.issue}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              repair.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              repair.status === 'in_repair' ? 'bg-blue-100 text-blue-800' : 
                              repair.status === 'awaiting_collection' ? 'bg-purple-100 text-purple-800' : 
                              repair.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {repair.status.replace('_', ' ')}
                            </span>
                          </TableCell>
                          <TableCell>{repair.assignedTo || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Select 
                                onValueChange={(value) => handleUpdateRepairStatus(repair.id, value)}
                                defaultValue={repair.status}
                              >
                                <SelectTrigger className="h-8 w-32">
                                  <SelectValue placeholder={t('admin.update.status')} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">{t('admin.status.pending')}</SelectItem>
                                  <SelectItem value="awaiting_collection">{t('admin.status.awaiting')}</SelectItem>
                                  <SelectItem value="in_repair">{t('admin.status.in.repair')}</SelectItem>
                                  <SelectItem value="completed">{t('admin.status.completed')}</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select 
                                onValueChange={(value) => handleAssignRepair(repair.id, value)}
                                defaultValue={repair.assignedTo}
                              >
                                <SelectTrigger className="h-8 w-32">
                                  <SelectValue placeholder={t('admin.assign')} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">{t('admin.unassigned')}</SelectItem>
                                  <SelectItem value="Fixer User">{t('admin.fixer.user')}</SelectItem>
                                  <SelectItem value="Collector User">{t('admin.collector.user')}</SelectItem>
                                  <SelectItem value="Operator User">{t('admin.operator.user')}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.site.settings')}</CardTitle>
                <CardDescription>{t('admin.manage.site.settings')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">{t('admin.site.name')}</Label>
                  <Input id="siteName" defaultValue="Sala7li" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">{t('admin.site.logo')}</Label>
                  <div className="flex items-center gap-2">
                    <Input id="logo" type="file" />
                    <Button variant="outline">{t('admin.upload')}</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">{t('admin.primary.color')}</Label>
                  <div className="flex items-center gap-2">
                    <Input id="primaryColor" defaultValue="#9b87f5" />
                    <div className="w-10 h-10 rounded-full bg-sala7li-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about">{t('admin.about.text')}</Label>
                  <textarea
                    id="about"
                    className="w-full min-h-[100px] p-2 border border-input rounded-md resize-y"
                    defaultValue="Sala7li is a platform connecting clients with repair technicians."
                  />
                </div>
                <Button>{t('admin.save.settings')}</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
