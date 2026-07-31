"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const problems = [
  {
    icon: "/problem-1.png",
    title: "HR data scattered everywhere",
    description:
      "Attendance in a logbook at the entrance, appraisal forms in a folder under the table, leave requests done verbally.",
  },
  {
    icon: "/problem-2.png",
    title: "Finance tools that don't talk",
    description:
      "Invoice number generated based on vibes, remittances not accurate, expenses on excel sheet.",
  },
  {
    icon: "/problem-3.png",
    title: "No single source of truth",
    description:
      "When leadership asks for a business update, it takes days to compile the numbers.",
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-[#C7E2F5] bg-[#F5FAFE] px-5 py-2">
          <div className="mr-2 h-[6px] w-[6px] rounded-full bg-[#2388D0]" />
          <span className="text-sm font-semibold uppercase tracking-wider text-[#2388D0]">
            The Problem
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-5 text-4xl font-bold text-slate-900 sm:text-5xl">
          Sound familiar?
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-500">
          Most businesses in Nigeria are running on a patchwork of tools,
          spreadsheets, and WhatsApp groups.
        </p>

        {/* Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="rounded-2xl border border-slate-100 bg-white p-8 text-left shadow-sm"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50">
                <Image
                  src={problem.icon}
                  alt={problem.title}
                  width={40}
                  height={40}
                />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                {problem.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Pill */}
        <div className="mt-12 flex justify-center">
         <div className="mt-10 flex justify-center">
  <span className="inline-flex items-center gap-2 rounded-full border border-[#2182C5]/30 bg-[#2182C5]/10 px-5 py-2.5 text-sm font-medium text-[#2182C5]">
    <CheckCircle2 className="h-4 w-4" />
    Sinkronis solves all three through one platform.
  </span>
</div>
        </div>
      </div>
    </section>
  );
}