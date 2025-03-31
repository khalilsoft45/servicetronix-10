
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, CheckCircle2, Clock, Wrench } from "lucide-react";
import { Repair } from "@/types/repair";
import { useLanguage } from "@/context/LanguageContext";

interface RepairCardProps {
  repair: Repair;
  onViewDetails: (repair: Repair) => void;
  onSetPrice: (repair: Repair) => void;
  onCompleteRepair: (repair: Repair) => void;
}

const RepairCard = ({ repair, onViewDetails, onSetPrice, onCompleteRepair }: RepairCardProps) => {
  const { t } = useLanguage();

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
          onClick={() => onViewDetails(repair)}
        >
          {t('fixer.view.details')}
        </Button>
        
        {repair.status === "assigned" ? (
          <Button 
            size="sm" 
            onClick={() => onSetPrice(repair)}
          >
            <DollarSign className="mr-1 h-4 w-4" />
            {t('fixer.set.price')}
          </Button>
        ) : repair.status === "in_progress" ? (
          <Button 
            size="sm" 
            onClick={() => onCompleteRepair(repair)}
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
            onClick={() => onViewDetails(repair)}
          >
            <Wrench className="mr-1 h-4 w-4" />
            {t('fixer.view.details')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RepairCard;
