"use client";

type PayeBand = {
  band: string;
  rate: string;
};

type CraGuide = {
  title: string;
  description: string;
};

const payeBands: PayeBand[] = [
  {
    band: "First ₦800,000",
    rate: "0%",
  },
  {
    band: "Next ₦2,200,000",
    rate: "15%",
  },
  {
    band: "Next ₦9,000,000",
    rate: "18%",
  },
  {
    band: "Next ₦13,000,000",
    rate: "21%",
  },
  {
    band: "Next ₦25,000,000",
    rate: "23%",
  },
  {
    band: "Above ₦50,000,000",
    rate: "25%",
  },
];

const craGuides: CraGuide[] = [
  {
    title: "CRA Component 1",
    description: "Higher of ₦200,000 or 1% of gross annual income",
  },
  {
    title: "CRA Component 2",
    description: "20% of gross annual income",
  },
  {
    title: "Total CRA",
    description: "Component 1 + Component 2",
  },
  {
    title: "Pension (Employee)",
    description: "8% of basic + housing + transport (deducted pre-tax)",
  },
  {
    title: "NHF Deduction",
    description: "2.5% of basic salary (deducted pre-tax)",
  },
];

export default function PayeBandsAndCra() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* =====================================================
            PAYE BANDS & RATES
        ====================================================== */}

        <div className="overflow-hidden rounded border border-[#E2E5E9] bg-white">
          {/* Header */}
          <div className="border-b border-dashed border-[#E1E4E8] px-5 py-4">
            <h2 className="text-base font-bold leading-6 text-[#263238]">
              PAYE Bands & Rates (2026)
            </h2>

            <p className="mt-1 text-sm font-medium leading-5 text-[#8290A3]">
              Applied after Consolidated Relief Allowance (CRA = Max(₦200k, 1%
              of gross) + 20% of gross)
            </p>
          </div>

          {/* Table */}
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_80px] border-b border-dashed border-[#E1E4E8] px-5 py-3">
              <span className="text-sm font-semibold text-[#8290A3]">Band</span>

              <span className="text-right text-sm font-semibold text-[#8290A3]">
                Rate
              </span>
            </div>

            {/* Table Rows */}
            {payeBands.map((item, index) => (
              <div
                key={item.band}
                className={`
                  grid
                  min-h-[45px]
                  grid-cols-[1fr_80px]
                  items-center
                  px-5
                  ${index % 2 === 0 ? "bg-white" : "bg-[#F3F4F8]"}
                `}
              >
                <span className="text-sm font-medium text-[#718096]">
                  {item.band}
                </span>

                <span className="text-right text-sm font-bold text-[#FF3838]">
                  {item.rate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================
            CRA CALCULATION GUIDE
        ====================================================== */}

        <div className="rounded border border-[#E2E5E9] bg-white px-5 py-5">
          {/* Title */}
          <h2 className="mb-4 text-base font-bold leading-6 text-[#263238]">
            CRA Calculation Guide
          </h2>

          {/* Guide Items */}
          <div className="space-y-3">
            {craGuides.map((item) => (
              <div
                key={item.title}
                className="
                  rounded
                  border
                  border-dashed
                  border-[#DCE1E7]
                  bg-[#F8F9FA]
                  px-3
                  py-3
                "
              >
                <h3 className="text-sm font-bold leading-5 text-[#263238]">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm font-medium leading-5 text-[#718096]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
