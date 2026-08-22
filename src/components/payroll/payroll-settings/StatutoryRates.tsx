const taxRates = [
  { label: "First ₦300,000", rate: "7%" },
  { label: "Next ₦300,000", rate: "11%" },
  { label: "Next ₦500,000", rate: "15%" },
  { label: "Next ₦500,000", rate: "19%" },
  { label: "Next ₦1,600,000", rate: "21%" },
  { label: "Above ₦3,200,000", rate: "24%" },
  { label: "CRA Relief", rate: "Max(₦200k, 1%) + 20%" },
];

const pensionRates = [
  {
    label: "Employee Contribution",
    value: "8% of (Basic + Housing + Transport)",
  },
  {
    label: "Employer Contribution",
    value: "10% of (Basic + Housing + Transport)",
  },
  {
    label: "Pensionable Earnings",
    value: "Basic + Housing + Transport",
  },
  {
    label: "Remittance Deadline",
    value: "7th of following month",
  },
];

const nhfRates = [
  {
    label: "Employee Contribution",
    value: "2.5% of Basic Salary",
  },
  {
    label: "Remittance",
    value: "Monthly to Federal Mortgage Bank",
  },
];

const nsitfRates = [
  {
    label: "Employer Contribution",
    value: "1% of Gross Salary",
  },
  {
    label: "Frequency",
    value: "Monthly",
  },
];

type RateRowProps = {
  label: string;
  value: string;
  last?: boolean;
};

function RateRow({ label, value, last = false }: RateRowProps) {
  return (
    <div
      className={[
        "grid grid-cols-[1fr_1fr] min-h-[48px] items-center px-5 sm:px-6",
        !last ? "border-b border-dotted border-slate-200" : "",
      ].join(" ")}
    >
      <div className="text-sm text-slate-600">{label}</div>

      <div className="text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}

type SectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function RateSection({ title, description, children }: SectionProps) {
  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="px-5 py-4 sm:px-6">
        <h2 className="text-sm font-semibold text-slate-800 sm:text-base">
          {title}
        </h2>

        <p className="mt-1.5 text-sm leading-5 text-slate-500">{description}</p>
      </div>

      <div>{children}</div>
    </section>
  );
}

function AlternatingRows({
  rows,
}: {
  rows: { label: string; value: string }[];
}) {
  return (
    <div>
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={[
            index % 2 === 0 ? "bg-white" : "bg-slate-100/80",
            index !== rows.length - 1
              ? "border-b border-dotted border-slate-200"
              : "",
          ].join(" ")}
        >
          <RateRow
            label={row.label}
            value={row.value}
            last={index === rows.length - 1}
          />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto space-y-6">
        {/* Page heading */}
        <header className="mb-7">
          <h1 className="text-xl font-semibold tracking-tight text-slate-800">
            Statutory Rates
          </h1>

          <p className="mt-2 text-sm leading-5 text-slate-500">
            Current statutory contribution rates as prescribed by Nigerian law.
          </p>
        </header>

        <div className="space-y-5">
          {/* PAYE */}
          <RateSection
            title="PAYE Income Tax (FIRS)"
            description="Pay As You Earn — deducted from employee and remitted to FIRS monthly."
          >
            <div>
              {taxRates.map((row, index) => (
                <div
                  key={row.label}
                  className={[
                    "grid grid-cols-[1fr_1fr] min-h-[48px] items-center px-5 sm:px-6",
                    index % 2 === 0 ? "bg-white" : "bg-slate-100/80",
                    index !== taxRates.length - 1
                      ? "border-b border-dotted border-slate-200"
                      : "",
                  ].join(" ")}
                >
                  <div className="text-sm text-slate-600">{row.label}</div>

                  <div className="text-center text-sm font-semibold text-slate-800">
                    {row.rate}
                  </div>
                </div>
              ))}
            </div>
          </RateSection>

          {/* Pension */}
          <RateSection
            title="Pension (PENCOM)"
            description="Contributory pension scheme — both employee and employer contribute."
          >
            <AlternatingRows rows={pensionRates} />
          </RateSection>

          {/* NHF */}
          <RateSection
            title="National Housing Fund (NHF)"
            description="Federal Mortgage Bank contribution deducted from employee."
          >
            <AlternatingRows rows={nhfRates} />
          </RateSection>

          {/* NSITF */}
          <RateSection
            title="NSITF (Work Injuries)"
            description="Nigeria Social Insurance Trust Fund — employer-only contribution."
          >
            <AlternatingRows rows={nsitfRates} />
          </RateSection>
        </div>
      </div>
    </main>
  );
}
