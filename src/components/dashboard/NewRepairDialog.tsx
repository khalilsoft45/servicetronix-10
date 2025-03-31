
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface NewRepairFormData {
  deviceType: string;
  deviceModel: string;
  issue: string;
  additionalInfo: string;
}

interface NewRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: NewRepairFormData;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const NewRepairDialog = ({
  open,
  onOpenChange,
  onSubmit,
  formData,
  onFormChange,
}: NewRepairDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Request a New Repair</DialogTitle>
            <DialogDescription>
              Fill out the details of your device and issue. Our team will contact you to arrange a pickup.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="deviceType">Device Type</Label>
              <Select
                name="deviceType"
                value={formData.deviceType}
                onValueChange={(value) => onFormChange({
                  target: { name: "deviceType", value }
                } as any)}
                required
              >
                <SelectTrigger id="deviceType">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="deviceModel">Device Model</Label>
              <Input
                id="deviceModel"
                name="deviceModel"
                placeholder="e.g. MacBook Pro 2019, iPhone 12"
                value={formData.deviceModel}
                onChange={onFormChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="issue">Issue Description</Label>
              <Textarea
                id="issue"
                name="issue"
                placeholder="Describe the problem with your device"
                value={formData.issue}
                onChange={onFormChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                placeholder="Any additional details that might help our technicians"
                value={formData.additionalInfo}
                onChange={onFormChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRepairDialog;
