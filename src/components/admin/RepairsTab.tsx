
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Repair {
  id: string;
  client: string;
  device: string;
  issue: string;
  status: string;
  assignedTo: string;
}

interface RepairsTabProps {
  filteredRepairs: Repair[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleUpdateRepairStatus: (repairId: string, status: string) => void;
  handleAssignRepair: (repairId: string, assignee: string) => void;
}

const RepairsTab = ({
  filteredRepairs,
  searchQuery,
  setSearchQuery,
  handleUpdateRepairStatus,
  handleAssignRepair
}: RepairsTabProps) => {
  const { t } = useLanguage();

  return (
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
                          <SelectItem value="unassigned">{t('admin.unassigned')}</SelectItem>
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
  );
};

export default RepairsTab;
