
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useToast } from "@/components/ui/use-toast";

// Import our new components
import OverviewTab from "@/components/admin/OverviewTab";
import UsersTab from "@/components/admin/UsersTab";
import RepairsTab from "@/components/admin/RepairsTab";
import SettingsTab from "@/components/admin/SettingsTab";

const sampleUsers = [
  { id: 1, name: "Admin User", email: "admin@sala7li.com", role: "admin", active: true },
  { id: 2, name: "Fixer User", email: "fixer@sala7li.com", role: "fixer", active: true },
  { id: 3, name: "Operator User", email: "operator@sala7li.com", role: "operator", active: true },
  { id: 4, name: "Collector User", email: "collector@sala7li.com", role: "collector", active: true },
  { id: 5, name: "John Doe", email: "john@example.com", role: "client", active: true },
  { id: 6, name: "Jane Smith", email: "jane@example.com", role: "client", active: true },
];

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
    setUsers(users.filter(user => user.id !== id));

    toast({
      title: "User deleted",
      description: "The user has been removed from the system",
    });
  };

  const handleAssignRepair = (repairId: string, assignee: string) => {
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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          
          <TabsContent value="overview">
            <OverviewTab
              users={users}
              repairs={repairs}
              newUserDialog={newUserDialog}
              setNewUserDialog={setNewUserDialog}
              newUserForm={newUserForm}
              handleUserFormChange={handleUserFormChange}
              handleRoleChange={handleRoleChange}
              handleAddUser={handleAddUser}
            />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersTab
              users={users}
              filteredUsers={filteredUsers}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              newUserDialog={newUserDialog}
              setNewUserDialog={setNewUserDialog}
              handleDeleteUser={handleDeleteUser}
            />
          </TabsContent>
          
          <TabsContent value="repairs">
            <RepairsTab
              filteredRepairs={filteredRepairs}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleUpdateRepairStatus={handleUpdateRepairStatus}
              handleAssignRepair={handleAssignRepair}
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
