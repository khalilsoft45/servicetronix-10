
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Settings, Wrench } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

interface OverviewTabProps {
  users: any[];
  repairs: any[];
  newUserDialog: boolean;
  setNewUserDialog: (open: boolean) => void;
  newUserForm: {
    name: string;
    email: string;
    password: string;
    role: string;
  };
  handleUserFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (value: string) => void;
  handleAddUser: () => void;
}

const OverviewTab = ({
  users,
  repairs,
  newUserDialog,
  setNewUserDialog,
  newUserForm,
  handleUserFormChange,
  handleRoleChange,
  handleAddUser
}: OverviewTabProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default OverviewTab;
