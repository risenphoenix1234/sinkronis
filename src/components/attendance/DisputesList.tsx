import { useState } from "react";
import { disputes } from "@/data/attendance";
import { DisputeCard } from "./DisputeCard";

export default function DisputesList() {
  const [filter, setFilter] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");

  const filteredDisputes = disputes.filter(
    (item) => filter === "All" || item.status === filter
  );

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg">
            Attendance Disputes
          </h2>

          <p className="text-sm text-slate-500">
            Employees raise disputes when attendance records
            don't match actual attendance.
          </p>
        </div>

        <div className="flex gap-2">
          {["All", "Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-4 py-2 rounded text-sm ${
                filter === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mt-5">
        {filteredDisputes.map((dispute) => (
          <DisputeCard
            key={dispute.id}
            dispute={dispute}
          />
        ))}
      </div>
    </div>
  );
}