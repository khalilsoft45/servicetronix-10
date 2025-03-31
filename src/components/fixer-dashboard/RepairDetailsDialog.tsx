
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Repair } from "@/types/repair";
import { useLanguage } from "@/context/LanguageContext";

interface RepairDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repair: Repair | null;
  getStatusBadge: (status: string) => JSX.Element;
}

const RepairDetailsDialog = ({ open, onOpenChange, repair, getStatusBadge }: RepairDetailsDialogProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('fixer.repair.details')}</DialogTitle>
          <DialogDescription>
            {repair?.id} - {repair?.deviceType}
          </DialogDescription>
        </DialogHeader>
        {repair && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">{t('fixer.client')}:</p>
                <p>{repair.clientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{t('fixer.status')}:</p>
                <p>{getStatusBadge(repair.status)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{t('fixer.assigned.date')}:</p>
                <p>{repair.dateAssigned}</p>
              </div>
              {repair.dateCompleted && (
                <div>
                  <p className="text-sm font-medium">{t('fixer.completion.date')}:</p>
                  <p>{repair.dateCompleted}</p>
                </div>
              )}
              {repair.estimatedCompletion && (
                <div>
                  <p className="text-sm font-medium">{t('fixer.estimated.completion')}:</p>
                  <p>{repair.estimatedCompletion}</p>
                </div>
              )}
              {repair.price !== null && (
                <div>
                  <p className="text-sm font-medium">{t('fixer.price')}:</p>
                  <p>${repair.price}</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium mb-1">{t('fixer.issue')}:</p>
              <p className="text-sm">{repair.issue}</p>
            </div>
            {repair.notes && (
              <div>
                <p className="text-sm font-medium mb-1">{t('fixer.notes')}:</p>
                <p className="text-sm">{repair.notes}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RepairDetailsDialog;
