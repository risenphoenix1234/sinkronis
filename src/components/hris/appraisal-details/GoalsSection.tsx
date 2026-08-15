"use client";

import { Target } from "lucide-react";

type Rating = {
  score: number;
  label: string;
  comment: string;
};

type Goal = {
  title: string;
  description: string;
  keyResult: string;
  target: string;
  status: "Completed" | "In Progress";
  employee: Rating;
  manager: Rating;
};

const goals: Goal[] = [
  {
    title: "Implement New Onboarding Process",
    description:
      "Redesign onboarding to reduce time-to-productivity by at least 20%.",
    keyResult: "✓ New process launched and all managers trained by end of Q2.",
    target: "30 Jun 2026",
    status: "Completed",
    employee: {
      score: 5,
      label: "Outstanding",
      comment: "Launched the new checklist and trained all 12 managers.",
    },
    manager: {
      score: 4,
      label: "Exceeds Expectations",
      comment:
        "Well executed. Minor refinements still needed for remote onboarding.",
    },
  },
  {
    title: "Reduce Staff Turnover by 10%",
    description:
      "Develop retention strategies for high-risk employee segments.",
    keyResult:
      "✓ Voluntary turnover rate falls by at least 10% vs Q1 baseline.",
    target: "30 Jun 2026",
    status: "In Progress",
    employee: {
      score: 3,
      label: "Meets Expectations",
      comment: "Turnover reduced by 7%, on track for target.",
    },
    manager: {
      score: 3,
      label: "Meets Expectations",
      comment: "Good progress. Continued focus needed in Q3.",
    },
  },
];

function Rating({ title, rating }: { title: string; rating: Rating }) {
  return (
    <div className="flex-1">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: 5 }, (_, index) => {
          const score = index + 1;
          const active = score <= rating.score;

          return (
            <span
              key={score}
              className={`flex h-[30px] w-[30px] items-center justify-center rounded-[3px] text-xs font-semibold ${
                active
                  ? "bg-[#2388D0] text-white"
                  : "bg-[#F5F7FA] text-slate-500"
              }`}
            >
              {score}
            </span>
          );
        })}

        <span className="ml-2 text-[11px] font-medium text-[#2388D0]">
          {rating.label}
        </span>
      </div>

      <p className="mt-2 text-[11px] leading-4 text-slate-500">
        {rating.comment}
      </p>
    </div>
  );
}

function GoalCard({ goal }: { goal: Goal }) {
  return (
    <div className="rounded-md border border-[#E3E8EF] bg-[#FAFBFC] p-4">
      {/* Goal header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[13px] font-semibold text-[#1F2937]">
            {goal.title}
          </h3>

          <p className="mt-2 text-[11px] text-slate-500">{goal.description}</p>

          <p className="mt-2 text-[11px] text-slate-400">{goal.keyResult}</p>

          <p className="mt-1 text-[11px] text-slate-400">
            Target: {goal.target}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold ${
            goal.status === "Completed"
              ? "bg-[#D9F5DE] text-[#188038]"
              : "bg-[#E3F1FC] text-[#1677C8]"
          }`}
        >
          {goal.status}
        </span>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-dashed border-[#E1E5EA]" />

      {/* Ratings */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Rating title="Employee" rating={goal.employee} />
        <Rating title="Manager" rating={goal.manager} />
      </div>
    </div>
  );
}

export default function GoalsSection() {
  return (
    <section className="rounded-md border border-[#E3E8EF] bg-white">
      {/* Section header */}
      <div className="flex items-center justify-between border-b border-[#E3E8EF] px-5 py-4">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-[#2388D0]" />

          <h2 className="text-[13px] font-semibold text-[#1F2937]">Goals</h2>
        </div>

        <span className="rounded-full bg-[#D9F5DE] px-3 py-1 text-[10px] font-semibold text-[#188038]">
          Locked
        </span>
      </div>

      {/* Goals */}
      <div className="space-y-3 p-5">
        {goals.map((goal) => (
          <GoalCard key={goal.title} goal={goal} />
        ))}
      </div>
    </section>
  );
}
