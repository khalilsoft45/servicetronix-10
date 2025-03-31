
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Repair } from "@/types/repair";
import { useLanguage } from "@/context/LanguageContext";

interface SetPriceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repair: Repair | null;
  priceForm: {
    price: string;
    estimatedCompletion: string;
    notes: string;
  };
  setPriceForm: React.Dispatch<React.SetStateAction<{
    price: string;
    estimatedCompletion: string;
    notes: string;
  }>>;
  onSubmit: () => void;
}

const SetPriceDialog = ({ 
  open, 
  onOpenChange, 
  repair, 
  priceForm, 
  setPriceForm, 
  onSubmit 
}: SetPriceDialogProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('fixer.set.repair.price')}</DialogTitle>
          <DialogDescription>
            {repair?.id} - {repair?.deviceType}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price">{t('fixer.price')} ($)</Label>
            <Input
              id="price"
              value={priceForm.price}
              onChange={(e) => setPriceForm({ ...priceForm, price: e.target.value })}
              type="number"
              min="0"
              step="0.01"
            />
            <p className="text-sm text-muted-foreground">Once set, this price cannot be changed later.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedCompletion">{t('fixer.estimated.completion.date')}</Label>
            <Input
              id="estimatedCompletion"
              value={priceForm.estimatedCompletion}
              onChange={(e) => setPriceForm({ ...priceForm, estimatedCompletion: e.target.value })}
              type="date"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">{t('fixer.repair.notes')}</Label>
            <Textarea
              id="notes"
              value={priceForm.notes}
              onChange={(e) => setPriceForm({ ...priceForm, notes: e.target.value })}
              placeholder={t('fixer.repair.notes.placeholder')}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('fixer.cancel')}
          </Button>
          <Button onClick={onSubmit} disabled={!priceForm.price || !priceForm.estimatedCompletion}>
            {t('fixer.confirm.price')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetPriceDialog;
