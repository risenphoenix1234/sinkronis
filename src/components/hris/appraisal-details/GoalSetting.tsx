"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Check,
  FileText,
  Shield,
  Target,
  ThumbsUp,
  UserRound,
  X,
  Plus,
} from "lucide-react";

type Goal = {
  id: number;
  title: string;
  description: string;
  keyResult: string;
  status: "Not Started" | "In Progress" | "Completed";
};

const initialGoals: Goal[] = [
  {
    id: 1,
    title: "Improve Customer satisfaction",
    description: "Everything needs to be accomplished",
    keyResult: "When i am done",
    status: "Not Started",
  },
];

const steps = [
  {
    title: "Goal Setting",
    icon: Target,
    active: true,
  },
  {
    title: "Self-Assessment",
    icon: FileText,
  },
  {
    title: "Manager Review",
    icon: UserRound,
  },
  {
    title: "HR Approval",
    icon: Shield,
  },
  {
    title: "Acknowledgment",
    icon: ThumbsUp,
  },
];

export default function GoalSetting() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const removeGoal = (id: number) => {
    setGoals((current) => current.filter((goal) => goal.id !== id));
  };

  const addGoal = () => {
    const newGoal: Goal = {
      id: Date.now(),
      title: "New Goal",
      description: "Everything needs to be accomplished",
      keyResult: "When I am done",
      status: "Not Started",
    };

    setGoals((current) => [...current, newGoal]);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-3 py-2 text-[#1F2937] md:px-6">
      <div className="mx-auto max-w-[1400px] space-y-4">
        {/* Back */}
        <button
          type="button"
          className="flex items-center gap-1 text-[12px] font-medium text-[#667085] hover:text-[#2388D0]"
        >
          <ArrowLeft size={13} />
          Back to Reviews
        </button>

        {/* Employee Card */}
        <section className="rounded-sm border border-[#E3E8EF] bg-white">
          <div className="flex flex-col justify-between gap-5 px-6 py-4 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E3F2FD] text-[13px] font-bold text-[#2388D0]">
                BO
              </div>

              <div>
                <h1 className="text-[15px] font-bold text-[#1F2937]">
                  Babatunde Okafor
                </h1>

                <p className="mt-1 text-[11px] text-[#667085]">
                  Support Specialist · Customer Support · Manager: Ngozi Eze
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-1 md:items-end">
              <span className="rounded-full bg-[#F3F5F7] px-3 py-1 text-[10px] font-medium text-[#98A2B3]">
                Not Started
              </span>

              <p className="text-[10px] text-[#98A2B3]">
                Q2 2026 Review
                <span className="mx-2">·</span>
                Standard Performance Review
              </p>
            </div>
          </div>
        </section>

        {/* Progress Stepper */}
        <section className="rounded-sm border border-[#E3E8EF] bg-white px-5 py-5 md:px-12">
          <div className="flex items-start">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <div key={step.title} className="flex flex-1 items-start">
                  <div className="flex min-w-0 flex-col items-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                        step.active
                          ? "border-[#2388D0] bg-[#2388D0] text-white"
                          : "border-[#E7ECF1] bg-[#F5F7F9] text-[#B5BEC9]"
                      }`}
                    >
                      <Icon size={15} />
                    </div>

                    <span
                      className={`mt-2 whitespace-nowrap text-[10px] ${
                        step.active
                          ? "font-semibold text-[#2388D0]"
                          : "text-[#98A2B3]"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>

                  {!isLast && (
                    <div className="mx-2 mt-[18px] h-px flex-1 bg-[#E7ECF1]" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Goals Section */}
        <section className="overflow-hidden rounded-sm border border-[#2388D0] bg-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#DCEAF7] bg-[#F1F8FF] px-5 py-4">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-[#2388D0]" />

              <h2 className="text-[13px] font-bold text-[#1F2937]">Goals</h2>
            </div>

            <span className="text-[10px] font-medium text-[#98A2B3]">
              Awaiting Manager Input
            </span>
          </div>

          <div className="p-5">
            {/* Instruction */}
            <div className="rounded-sm border border-[#C8E0F7] bg-[#F1F8FF] px-3 py-3">
              <p className="text-[11px] text-[#2388D0]">
                Propose goals for Babatunde for this appraisal cycle. Add at
                least one goal then submit for employee confirmation.
              </p>
            </div>

            {/* Goal list */}
            <div className="mt-3 space-y-3">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="rounded-sm border border-dashed border-[#DCE2E8] bg-[#FBFCFD] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[12px] font-semibold text-[#1F2937]">
                        {goal.title}
                      </h3>

                      <p className="mt-2 text-[11px] text-[#667085]">
                        {goal.description}
                      </p>

                      <p className="mt-2 flex items-center gap-1 text-[10px] text-[#98A2B3]">
                        <Check size={11} />
                        {goal.keyResult}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-[#F3F5F7] px-3 py-1 text-[10px] font-medium text-[#98A2B3]">
                        {goal.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeGoal(goal.id)}
                        className="text-[#98A2B3] transition hover:text-red-500"
                        aria-label="Remove goal"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Goal */}
            <button
              type="button"
              onClick={addGoal}
              className="mt-3 flex h-8 w-full items-center justify-center gap-1 rounded-sm border border-dashed border-[#9AC7EA] text-[11px] font-medium text-[#2388D0] transition hover:bg-[#F1F8FF]"
            >
              <Plus size={14} />
              Add Goal
            </button>

            {/* Submit */}
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                disabled={goals.length === 0}
                className="rounded-sm bg-[#2388D0] px-5 py-3 text-[12px] font-semibold text-white transition hover:bg-[#1677C8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit Goals for Employee Confirmation
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
