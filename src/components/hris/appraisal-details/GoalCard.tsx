// components/appraisal-details/GoalCard.tsx

import RatingScale from "./RatingScale";


interface Props {
  title: string;
  description: string;
  target: string;
  employeeScore: number;
  managerScore: number;
  employeeLabel: string;
  managerLabel: string;
  status: string;
}

export default function GoalCard({
  title,
  description,
  target,
  employeeScore,
  managerScore,
  employeeLabel,
  managerLabel,
  status,
}: Props) {
  const statusColor =
    status === "Completed"
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex justify-between">
        <div>
          <h4 className="font-semibold text-slate-800">{title}</h4>

          <p className="mt-2 text-sm text-slate-500">{description}</p>

          <p className="mt-2 text-sm text-slate-500">
            ✓ New process launched and all managers trained by end of Q2.
          </p>

          <p className="mt-2 text-sm text-slate-500">Target: {target}</p>
        </div>

        <span
          className={`h-fit rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-wide text-slate-400">
            EMPLOYEE
          </p>

          <RatingScale rating={employeeScore} label={employeeLabel} />

          <p className="mt-3 text-sm text-slate-500">
            Launched the new checklist and trained all 12 managers.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold tracking-wide text-slate-400">
            MANAGER
          </p>

          <RatingScale rating={managerScore} label={managerLabel} />

          <p className="mt-3 text-sm text-slate-500">
            Well executed. Minor refinements still needed for remote onboarding.
          </p>
        </div>
      </div>
    </div>
  );
}
