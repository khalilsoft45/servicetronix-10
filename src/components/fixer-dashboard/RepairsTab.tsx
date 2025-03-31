
import { Card, CardContent } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { Repair } from "@/types/repair";
import { useLanguage } from "@/context/LanguageContext";
import RepairCard from "./RepairCard";

interface RepairsTabProps {
  filteredRepairs: Repair[];
  onViewDetails: (repair: Repair) => void;
  onSetPrice: (repair: Repair) => void;
  onCompleteRepair: (repair: Repair) => void;
}

const RepairsTab = ({ filteredRepairs, onViewDetails, onSetPrice, onCompleteRepair }: RepairsTabProps) => {
  const { t } = useLanguage();

  if (filteredRepairs.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredRepairs.map((repair) => (
        <RepairCard
          key={repair.id}
          repair={repair}
          onViewDetails={onViewDetails}
          onSetPrice={onSetPrice}
          onCompleteRepair={onCompleteRepair}
        />
      ))}
    </div>
  );
};

export default RepairsTab;
