"use client";

import { Award } from "lucide-react";

type FeedbackItem = {
  question: string;
  employeeResponse: string;
  managerResponse: string;
};

const feedbackItems: FeedbackItem[] = [
  {
    question:
      "1. What is this employee's most significant contribution this period?",
    employeeResponse:
      "Resolved three operational bottlenecks and delivered our highest SLA compliance quarter yet.",
    managerResponse:
      "Tunde's process optimisation work is his strongest contribution this quarter.",
  },
  {
    question:
      "2. What is one key area where this employee should focus on improving?",
    employeeResponse:
      "Dealing with a complex vendor issue in May delayed one deliverable. Escalated and resolved within a week.",
    managerResponse:
      "Cross-team communication is an area to develop — he tends to stay siloed within his own team.",
  },
  {
    question:
      "3. What development opportunities do you recommend for this employee?",
    employeeResponse:
      "More visibility into cross-department project timelines so I can plan operations proactively.",
    managerResponse:
      "I recommend Tunde joins the quarterly cross-functional planning sessions and takes on a cross-team project in Q3.",
  },
];

export default function GrandTotalReflection() {
  return (
    <section className="w-full space-y-4">
      {/* Feedback Questions */}
      <div className="space-y-4">
        {feedbackItems.map((item) => (
          <div key={item.question} className="space-y-2">
            {/* Question */}
            <h3 className="text-[13px] font-semibold leading-5 text-[#1F2937]">
              {item.question}
            </h3>

            {/* Employee Response */}
            <div className="rounded-md border border-[#E1E7ED] bg-[#F8FAFC] px-3 py-2.5">
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                Employee Said
              </p>

              <p className="text-[11px] leading-[18px] text-[#64748B]">
                {item.employeeResponse}
              </p>
            </div>

            {/* Manager Response */}
            <div className="rounded-md border border-[#E1E7ED] bg-[#F8FAFC] px-3 py-2.5">
              <p className="text-[11px] leading-[18px] text-[#64748B]">
                {item.managerResponse}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Feedback + Recommendation */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr]">
        {/* Overall Feedback */}
        <div>
          <h3 className="mb-2 text-[13px] font-semibold text-[#1F2937]">
            Overall Feedback
          </h3>

          <div className="min-h-[60px] rounded-md border border-[#E1E7ED] bg-[#F8FAFC] px-3 py-3">
            <p className="text-[11px] leading-[18px] text-[#64748B]">
              Tunde is a dependable team member who meets expectations
              consistently. He would benefit from more proactive cross-team
              communication.
            </p>
          </div>
        </div>

        {/* Recommendation */}
        <div>
          <h3 className="mb-2 text-[13px] font-semibold text-[#1F2937]">
            Recommendation
          </h3>

          <span className="inline-flex items-center rounded-full bg-[#E0F2FE] px-3 py-1 text-[11px] font-medium text-[#1677C8]">
            On Track
          </span>
        </div>
      </div>

      {/* Final Score */}
      <div className="flex min-h-[70px] items-center rounded-md border border-[#E1E7ED] bg-[#F8FAFC] px-4 py-3">
        <div className="flex items-center gap-3">
          <Award size={22} strokeWidth={1.8} className="text-[#A16207]" />

          <div>
            <p className="text-[10px] font-medium text-[#94A3B8]">
              OKR Final Score (Q2)
            </p>

            <p className="mt-0.5 text-[17px] font-bold text-[#946B00]">
              63% — Below Expectation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
