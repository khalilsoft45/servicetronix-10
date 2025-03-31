
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Repair } from "@/types/repair";

interface CompleteRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repair: Repair | null;
  completeForm: {
    notes: string;
  };
  setCompleteForm: React.Dispatch<React.SetStateAction<{
    notes: string;
  }>>;
  onSubmit: () => void;
}

const CompleteRepairDialog = ({
  open,
  onOpenChange,
  repair,
  completeForm,
  setCompleteForm,
  onSubmit
}: CompleteRepairDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mark Repair as Complete</DialogTitle>
          <DialogDescription>
            {repair?.id} - {repair?.deviceType}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="completeNotes">Completion Notes</Label>
            <Textarea
              id="completeNotes"
              value={completeForm.notes}
              onChange={(e) => setCompleteForm({ ...completeForm, notes: e.target.value })}
              placeholder="Describe what was fixed and how"
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Once marked as complete, this repair will be finalized and moved to completed repairs.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Confirm Completion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteRepairDialog;
