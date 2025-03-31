
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Repair } from "@/types/repair";
import { useLanguage } from "@/context/LanguageContext";

interface CompletedRepairCardProps {
  repair: Repair;
  onViewDetails: (repair: Repair) => void;
}

const CompletedRepairCard = ({ repair, onViewDetails }: CompletedRepairCardProps) => {
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
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
          onClick={() => onViewDetails(repair)}
        >
          {t('fixer.view.details')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompletedRepairCard;
