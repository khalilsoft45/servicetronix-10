
import RepairStatusCard from "@/components/dashboard/RepairStatusCard";
import { RepairStatus } from "@/types/repair";

interface RepairsListProps {
  repairs: {
    id: string;
    deviceType: string;
    issue: string;
    status: RepairStatus;
    dateAssigned: string;
    lastUpdated: string;
    price?: number;
    notes?: string;
    assignedFixer?: string;
  }[];
  showEmptyMessage?: boolean;
}

const RepairsList = ({ repairs, showEmptyMessage = true }: RepairsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repairs.length > 0 ? (
        repairs.map((repair) => (
          <RepairStatusCard
            key={repair.id}
            id={repair.id}
            device={repair.deviceType}
            issue={repair.issue}
            status={repair.status}
            dateCreated={repair.dateAssigned}
            lastUpdated={repair.lastUpdated}
            price={repair.price}
            fixerNotes={repair.notes}
            assignedFixer={repair.assignedFixer}
          />
        ))
      ) : (
        showEmptyMessage && (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-gray-500">No repairs found matching your filters.</p>
          </div>
        )
      )}
    </div>
  );
};

export default RepairsList;
