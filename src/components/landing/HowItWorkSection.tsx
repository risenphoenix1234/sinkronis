"use client";

const steps = [
  {
    number: "01",
    title: "Set up your organisation",
    description:
      "Add your company profile, departments, roles, and invite your team. Takes under 10 minutes.",
    active: false,
  },
  {
    number: "02",
    title: "Manage daily operations",
    description:
      "Track attendance, raise invoices, approve leave, log expenses — all from one dashboard.",
    active: true,
  },
  {
    number: "03",
    title: "Get reports & insights",
    description:
      "Monthly payroll summaries, tax reports, attendance trends, and financial snapshots on demand.",
    active: false,
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-white px-6 py-24"
    >
      {/* Background circles */}
      <div className="absolute -right-56 top-0 hidden h-[700px] w-[700px] rounded-full border border-[#EEF4F9] lg:block" />
      <div className="absolute -right-44 top-16 hidden h-[560px] w-[560px] rounded-full border border-[#EEF4F9] lg:block" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2182C5]">
            Getting Started
          </p>

          <h2 className="mt-5 text-5xl font-bold text-slate-900">
            Up and running in minutes
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-500">
            No lengthy onboarding or consultants needed. Most teams are live the
            same day.
          </p>
        </div>

        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          {/* connector line */}
          <div className="absolute left-[30%] right-[30%] top-8 hidden h-px bg-[#E6EEF6] md:block" />

          {steps.map((step) => (
            <div
              key={step.number}
              className={`relative rounded-3xl p-10 transition-all ${
                step.active
                  ? "bg-gradient-to-br from-[#2F8BD7] to-[#1E6EC7] text-white shadow-xl"
                  : "border border-[#E8EEF5] bg-white shadow-sm"
              }`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full border text-xl font-bold ${
                  step.active
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-[#E8EEF5] bg-[#F8FBFE] text-[#2182C5]"
                }`}
              >
                {step.number}
              </div>

              <h3
                className={`mt-8 text-2xl font-bold ${
                  step.active ? "text-white" : "text-slate-900"
                }`}
              >
                {step.title}
              </h3>

              <p
                className={`mt-5 text-base leading-8 ${
                  step.active ? "text-white/85" : "text-slate-500"
                }`}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
