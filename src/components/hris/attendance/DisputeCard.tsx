import { AttendanceDispute } from "@/types/hris/attendance";
import { useState } from "react";
import ApproveDisputeModal from "../../modals/Hris/ApproveDisputeModal";
import StatusBadge from "@/components/ui/StatusBadge";

interface CardProps {
  dispute: AttendanceDispute;
}

export function DisputeCard({ dispute }: CardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white border rounded-lg p-5">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{dispute.id}</h3>
            <StatusBadge status={dispute.status} />

            <span className="px-2 py-1 text-xs rounded bg-slate-100">
              {dispute.issue}
            </span>
            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
              {dispute.date}
            </span>
          </div>

          <p className="mt-3 font-medium">
            {dispute.employeeName}
            <span className="text-slate-500 text-sm ml-1">
              ({dispute.employeeId} · {dispute.department})
            </span>
          </p>

          <p className="text-sm text-slate-600 mt-2">{dispute.description}</p>

          <div className="flex gap-6 mt-4 text-sm">
            {dispute.claimedClockIn && (
              <span className="text-green-600">
                ↳ Claimed In: {dispute.claimedClockIn}
              </span>
            )}

            {dispute.claimedClockOut && (
              <span className="text-red-500">
                ↳ Claimed Out: {dispute.claimedClockOut}
              </span>
            )}
          </div>

          {dispute.resolution && (
            <div className="mt-4 border-t pt-3">
              <p className="text-sm">
                <strong>Resolution:</strong> {dispute.resolution}
              </p>
            </div>
          )}
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-400">{dispute.createdAt}</p>

          {dispute.status === "Pending" && (
            <div className="flex gap-2 mt-6">
              <button className="px-4 py-2 rounded bg-red-50 text-red-600 border">
                Reject
              </button>

              <button
                className="px-4 py-2 rounded bg-green-50 text-green-600 border"
                onClick={() => setShowModal(true)}
              >
                Approve
              </button>
            </div>
          )}
          <ApproveDisputeModal
            isOpen={showModal}
            dispute={dispute}
            onClose={() => setShowModal(false)}
            onSubmit={(data) => {
              console.log(data);

              setShowModal(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
