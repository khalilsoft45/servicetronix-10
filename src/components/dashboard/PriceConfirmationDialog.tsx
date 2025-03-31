
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RepairWithPrice {
  id: string;
  device: string;
  issue: string;
  price?: number;
  assignedFixer?: string;
}

interface PriceConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRepair: RepairWithPrice | null;
  onConfirm: (accept: boolean) => void;
}

const PriceConfirmationDialog = ({
  open,
  onOpenChange,
  selectedRepair,
  onConfirm,
}: PriceConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm Repair Price</DialogTitle>
          <DialogDescription>
            The technician has set a price for your repair. Do you want to proceed?
          </DialogDescription>
        </DialogHeader>
        {selectedRepair && (
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Device</h4>
                <p className="font-medium">{selectedRepair.device}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Issue</h4>
                <p>{selectedRepair.issue}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Repair Price</h4>
                <p className="text-xl font-bold text-green-700">${selectedRepair.price}</p>
              </div>
              {selectedRepair.assignedFixer && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Technician</h4>
                  <p>{selectedRepair.assignedFixer}</p>
                </div>
              )}
            </div>
          </div>
        )}
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="sm:flex-1" 
            onClick={() => onConfirm(false)}
          >
            Reject
          </Button>
          <Button 
            className="sm:flex-1" 
            onClick={() => onConfirm(true)}
          >
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriceConfirmationDialog;
