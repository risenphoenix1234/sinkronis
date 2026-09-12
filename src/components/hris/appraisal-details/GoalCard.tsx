import { Goal } from "@/lib/api/types/hrisTypes";
import StatusBadge from "../appraisal/StatusBadge";
import RatingScale from "./RatingScale";

interface GoalCardProps {
  goal: Goal;
}

const STATUS_LABEL: Record<Goal["status"], string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export default function GoalCard({ goal }: GoalCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{goal.title}</h2>

          <p className="mt-2 text-gray-500">{goal.description}</p>

          <p className="mt-2 text-[#7A8DA8]">✓ {goal.successCriteria}</p>

          <p className="mt-2 text-sm text-gray-500">
            Target:{" "}
            {new Date(goal.targetDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <StatusBadge text={STATUS_LABEL[goal.status]} />
      </div>

      <hr className="my-8" />

      <div className="grid grid-cols-2 gap-20">
        <div>
          <RatingScale
            title="Employee"
            selected={goal.employeeRating ?? 0}
            subtitle={goal.employeeRatingLabel ?? ""}
          />

          {goal.employeeComment && (
            <p className="mt-4 text-gray-600">{goal.employeeComment}</p>
          )}
        </div>

        <div>
          <RatingScale
            title="Manager"
            selected={goal.managerRating ?? 0}
            subtitle={goal.managerRatingLabel ?? ""}
          />

          {goal.managerComment && (
            <p className="mt-4 text-gray-600">{goal.managerComment}</p>
          )}
        </div>
      </div>
    </div>
  );
}
