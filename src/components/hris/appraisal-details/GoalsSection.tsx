// components/appraisal-details/GoalsSection.tsx

import GoalCard from "./GoalCard";

export default function GoalsSection() {
  return (
    <div className="rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h3 className="font-semibold text-slate-800">Goals</h3>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          Locked
        </span>
      </div>

      <div className="space-y-4 p-4">
        <GoalCard
          title="Implement New Onboarding Process"
          description="Redesign onboarding to reduce time-to-productivity by at least 20%."
          target="30 Jun 2026"
          employeeScore={5}
          managerScore={4}
          employeeLabel="Outstanding"
          managerLabel="Exceeds Expectations"
          status="Completed"
        />

        <GoalCard
          title="Reduce Staff Turnover by 10%"
          description="Develop retention strategies for high-risk employee segments."
          target="30 Jun 2026"
          employeeScore={3}
          managerScore={3}
          employeeLabel="Meets Expectations"
          managerLabel="Meets Expectations"
          status="In Progress"
        />
      </div>
    </div>
  );
}
