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
    <section id="how-it-works" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#2182C5]">
            Getting Started
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Up and running in minutes
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-500">
            No lengthy onboarding or consultants needed. Most teams are live
            the same day.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`rounded-2xl p-8 ${
                step.active
                  ? "bg-[#2182C5]"
                  : "border border-slate-100 bg-slate-50"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                  step.active
                    ? "bg-white text-[#2182C5]"
                    : "bg-white text-[#2182C5]"
                }`}
              >
                {step.number}
              </span>

              <h3
                className={`mt-5 text-lg font-semibold ${
                  step.active ? "text-white" : "text-slate-900"
                }`}
              >
                {step.title}
              </h3>

              <p
                className={`mt-3 text-sm leading-relaxed ${
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