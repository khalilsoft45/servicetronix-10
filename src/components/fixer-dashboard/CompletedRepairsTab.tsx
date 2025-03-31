
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Repair } from "@/types/repair";
import { useLanguage } from "@/context/LanguageContext";
import CompletedRepairCard from "./CompletedRepairCard";

interface CompletedRepairsTabProps {
  filteredRepairs: Repair[];
  onViewDetails: (repair: Repair) => void;
}

const CompletedRepairsTab = ({ filteredRepairs, onViewDetails }: CompletedRepairsTabProps) => {
  const { t } = useLanguage();

  if (filteredRepairs.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredRepairs.map((repair) => (
        <CompletedRepairCard
          key={repair.id}
          repair={repair}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default CompletedRepairsTab;
