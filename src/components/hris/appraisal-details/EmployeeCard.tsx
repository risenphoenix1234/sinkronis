import { AppraisalSummary, AppraisalEmployee } from "@/lib/api/types/hrisTypes";
import StatusBadge from "../appraisal/StatusBadge";

interface EmployeeCardProps {
  employee: AppraisalEmployee;
  appraisal: AppraisalSummary;
}

export default function EmployeeCard({
  employee,
  appraisal,
}: EmployeeCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F2FD] text-lg font-bold text-[#1677C8]">
            {employee.avatarInitials}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              {employee.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {employee.title} · {employee.department} · Manager:{" "}
              {employee.managerName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-right">
            <StatusBadge text={appraisal.statusLabel} color="yellow" />

            <p className="mt-3 text-sm text-gray-500">
              {appraisal.cycleTitle} • {appraisal.templateName}
            </p>
          </div>

          <div className="border-l pl-8">
            <h1 className="text-5xl font-bold text-[#A16207]">
              {appraisal.overallScorePercent}%
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {appraisal.overallRatingLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
