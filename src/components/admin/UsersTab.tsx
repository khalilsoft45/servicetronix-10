
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

interface UsersTabProps {
  users: User[];
  filteredUsers: User[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  newUserDialog: boolean;
  setNewUserDialog: (open: boolean) => void;
  handleDeleteUser: (id: number) => void;
}

const UsersTab = ({
  filteredUsers,
  searchQuery,
  setSearchQuery,
  newUserDialog,
  setNewUserDialog,
  handleDeleteUser
}: UsersTabProps) => {
  const { t } = useLanguage();

  return (
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
  );
};

export default UsersTab;
