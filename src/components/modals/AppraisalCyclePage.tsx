// app/appraisal/page.tsx

import { cycles } from "@/data/cycles";
import CycleCard from "../appraisal/CycleCard";

export default function AppraisalCyclePage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] space-y-6">
      {/* Cards */}
      <div className="mt-6 space-y-4">
        {cycles.map((cycle) => (
          <CycleCard key={cycle.id} cycle={cycle} />
        ))}
      </div>
    </div>
  );
}
