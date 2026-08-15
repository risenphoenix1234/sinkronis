"use client";

import {
  ArrowLeft,
  Check,
  Shield,
  Target,
  ClipboardList,
  ThumbsUp,
} from "lucide-react";

export default function EmployeeReview() {
  const progress = [
    {
      title: "Goal Setting",
      completed: true,
      active: false,
    },
    {
      title: "Self-Assessment",
      completed: true,
      active: false,
    },
    {
      title: "Manager Review",
      completed: true,
      active: false,
    },
    {
      title: "HR Approval",
      completed: false,
      active: true,
    },
    {
      title: "Acknowledgement",
      completed: false,
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="space-y-6">
        {/* Back */}

        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft size={18} />
          Back to Reviews
        </button>

        {/* Employee Header */}

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            {/* Left */}

            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-[#2F80ED]">
                TA
              </div>

              <div>
                <h2 className="text-3xl font-bold text-slate-800">
                  Tunde Adeyemi
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Operations Lead · Operations · Manager: Chukwuemeka Obi
                </p>
              </div>
            </div>

            {/* Right */}

            <div className="flex items-center gap-10">
              <div className="text-right">
                <span className="rounded-full bg-yellow-100 px-4 py-2 text-xs font-semibold text-yellow-800">
                  Pending HR Approval
                </span>

                <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
                  <span>Q2 2026 Review</span>

                  <span>•</span>

                  <span>Standard Performance Review</span>
                </div>
              </div>

              <div className="border-l border-slate-200 pl-8 text-center">
                <h1 className="text-5xl font-bold text-yellow-700">63%</h1>

                <p className="mt-2 text-sm text-slate-500">Below Expectation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}

        <div className="rounded-xl border border-slate-200 bg-white px-10 py-8">
          <div className="flex items-center">
            {progress.map((step, index) => (
              <div key={step.title} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2
                    ${
                      step.completed
                        ? "border-green-700 bg-green-700 text-white"
                        : step.active
                          ? "border-[#2F80ED] bg-[#2F80ED] text-white"
                          : "border-slate-200 bg-slate-100 text-slate-400"
                    }`}
                  >
                    {step.completed ? (
                      <Check size={18} />
                    ) : step.active ? (
                      <Shield size={18} />
                    ) : (
                      <ThumbsUp size={18} />
                    )}
                  </div>

                  <span
                    className={`mt-3 text-sm font-medium ${
                      step.active
                        ? "text-[#2F80ED]"
                        : step.completed
                          ? "text-green-700"
                          : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {index !== progress.length - 1 && (
                  <div
                    className={`mx-5 mb-8 h-[3px] flex-1 rounded-full ${
                      index < 3 ? "bg-green-700" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="rounded-xl border border-slate-200 bg-white">
          {/* Header */}

          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <Target size={18} className="text-[#2F80ED]" />

              <h3 className="text-xl font-semibold">Goals</h3>
            </div>

            <span className="rounded-full bg-green-100 px-4 py-1 text-xs font-semibold text-green-700">
              Locked
            </span>
          </div>

          {/* Goal Card begins here */}

          <div className="p-6">
            <div className="rounded-xl border border-slate-200 bg-gray-50 p-4">
              {/* Top */}

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    Process Optimisation Initiative
                  </h3>

                  <p className="mt-3 text-sm text-slate-500">
                    Identify and eliminate 3 operational inefficiencies.
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    ✓ 3 documented bottlenecks resolved with measurable time
                    savings.
                  </p>

                  <p className="mt-3 text-sm text-slate-500">
                    Target: 30 Jun 2026
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-700">
                  Completed
                </span>
              </div>

              <div className="my-8 border-b border-slate-200" />

              {/* Rating Columns */}

              <div className="grid gap-16 lg:grid-cols-2">
                {/* Employee */}

                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Employee
                  </p>

                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((item) => (
                      <button
                        key={item}
                        className="flex h-10 w-10 items-center justify-center rounded bg-[#2F80ED] text-sm font-semibold text-white"
                      >
                        {item}
                      </button>
                    ))}

                    <button className="flex h-10 w-10 items-center justify-center rounded border border-slate-200 bg-white text-slate-500">
                      5
                    </button>

                    <span className="ml-3 text-sm font-semibold text-[#2F80ED]">
                      Exceeds Expectations
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-slate-500">
                    Identified and resolved 3 bottlenecks, saving ~5 hrs/week.
                  </p>
                </div>

                {/* Manager */}

                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Manager
                  </p>

                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((item) => (
                      <button
                        key={item}
                        className="flex h-10 w-10 items-center justify-center rounded bg-[#2F80ED] text-sm font-semibold text-white"
                      >
                        {item}
                      </button>
                    ))}

                    {[4, 5].map((item) => (
                      <button
                        key={item}
                        className="flex h-10 w-10 items-center justify-center rounded border border-slate-200 bg-white text-slate-500"
                      >
                        {item}
                      </button>
                    ))}

                    <span className="ml-3 text-sm font-semibold text-[#2F80ED]">
                      Meets Expectations
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-slate-500">
                    Good outcome but took longer than expected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Self Assessment */}

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <ClipboardList size={18} className="text-yellow-600" />

              <h3 className="text-xl font-semibold">Self-Assessment</h3>
            </div>

            <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-700">
              Submitted
            </span>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-500">
                Quarter:
              </span>

              <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
                Q1
              </button>

              <button className="rounded-full bg-[#2F80ED] px-4 py-2 text-sm font-semibold text-white">
                Q2
              </button>

              <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
                Q3
              </button>

              <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
                Q4
              </button>
            </div>
          </div>
          {/* Divider */}
          <div className="my-8 border-t border-slate-200" />

          {/* Self Assessment Content */}

          <div className="space-y-6 p-6">
            {/* Employee Comments */}

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                Employee Self Assessment
              </h4>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="leading-7 text-slate-600">
                  During Q2, I successfully identified three major operational
                  bottlenecks and implemented improvements that reduced manual
                  effort across the operations team. These optimizations saved
                  approximately five hours of work every week while improving
                  turnaround time for customer requests. I also collaborated
                  closely with stakeholders to ensure all improvements were
                  adopted successfully.
                </p>
              </div>
            </div>

            {/* Manager Feedback */}

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                Manager Review
              </h4>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="leading-7 text-slate-600">
                  Strong contribution throughout the quarter. The optimisation
                  initiative delivered measurable operational improvements. Some
                  project milestones slipped due to changing priorities, however
                  the final outcome met expectations.
                </p>
              </div>
            </div>

            {/* Ratings */}

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-200 p-6">
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Employee Rating
                </p>

                <h2 className="mt-3 text-4xl font-bold text-[#2F80ED]">4.0</h2>

                <p className="mt-2 text-sm text-[#2F80ED] font-medium">
                  Exceeds Expectations
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-6">
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Manager Rating
                </p>

                <h2 className="mt-3 text-4xl font-bold text-green-700">3.0</h2>

                <p className="mt-2 text-sm text-green-700 font-medium">
                  Meets Expectations
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-6">
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Overall Score
                </p>

                <h2 className="mt-3 text-4xl font-bold text-yellow-600">63%</h2>

                <p className="mt-2 text-sm font-medium text-yellow-700">
                  Below Expectation
                </p>
              </div>
            </div>

            {/* HR Approval */}

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#2F80ED]">
                    HR Approval
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    This appraisal is currently awaiting HR approval. Once
                    reviewed, the employee will receive a notification to
                    acknowledge the completed appraisal.
                  </p>
                </div>

                <button className="rounded-lg bg-[#2F80ED] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                  Review Appraisal
                </button>
              </div>
            </div>
            {/* Bottom Action Buttons */}

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </button>

              <button
                type="button"
                className="rounded-lg border border-[#2F80ED] bg-white px-6 py-3 text-sm font-medium text-[#2F80ED] transition hover:bg-blue-50"
              >
                Save Progress
              </button>

              <button
                type="button"
                className="rounded-lg bg-[#2F80ED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Submit to HR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
