"use client";

type TaxSummary = {
  id: number;
  initials: string;
  name: string;
  department: string;
  state: "Lagos" | "Rivers";
  irs: "LIRS" | "RIRS";
  tin: string;
  ytdGross: string;
  ytdPaye: string;
  effectiveRate: string;
};

const taxSummaryData: TaxSummary[] = [
  {
    id: 1,
    initials: "AO",
    name: "Amara Okafor",
    department: "Human Resources",
    state: "Lagos",
    irs: "LIRS",
    tin: "1234567-0001",
    ytdGross: "₦1,215,000",
    ytdPaye: "₦162,750",
    effectiveRate: "13.4%",
  },
  {
    id: 2,
    initials: "CA",
    name: "Chukwuemeka Adeyemi",
    department: "Finance",
    state: "Lagos",
    irs: "LIRS",
    tin: "1234567-0002",
    ytdGross: "₦1,504,000",
    ytdPaye: "₦213,902",
    effectiveRate: "14.2%",
  },
  {
    id: 3,
    initials: "TB",
    name: "Tunde Babatunde",
    department: "IT & Technology",
    state: "Lagos",
    irs: "LIRS",
    tin: "1234567-0004",
    ytdGross: "₦1,026,000",
    ytdPaye: "₦130,796",
    effectiveRate: "12.7%",
  },
  {
    id: 4,
    initials: "NE",
    name: "Ngozi Eze",
    department: "Sales & Marketing",
    state: "Rivers",
    irs: "RIRS",
    tin: "1234567-0005",
    ytdGross: "₦1,194,000",
    ytdPaye: "₦160,574",
    effectiveRate: "13.4%",
  },
];

export default function YtdTaxSummary() {
  return (
    <section className="w-full overflow-hidden rounded border border-[#E8EAF0] bg-white">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex min-h-[48px] items-center justify-between gap-4 border-b border-dashed border-[#E5E7EB] px-4 sm:px-5">
        <h2 className="text-sm font-bold tracking-tight text-[#263238]">
          Year-to-Date Tax Summary — 2026 (Jan–Jun)
        </h2>

        <div className="flex shrink-0 items-center gap-1 text-sm">
          <span className="font-medium text-[#667085]">Total YTD PAYE:</span>

          <span className="font-bold text-[#FF3131]">₦2,055,718</span>
        </div>
      </div>

      {/* =====================================================
          RESPONSIVE TABLE
      ====================================================== */}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse">
          {/* =================================================
              TABLE HEADER
          ================================================== */}

          <thead>
            <tr className="h-10 border-b border-dashed border-[#E5E7EB]">
              <th className="w-[23%] px-5 text-left text-sm font-semibold text-[#718096]">
                Employee
              </th>

              <th className="w-[16%] px-3 text-left text-sm font-semibold text-[#718096]">
                Department
              </th>

              <th className="w-[11%] px-3 text-left text-sm font-semibold text-[#718096]">
                State / IRS
              </th>

              <th className="w-[13%] px-3 text-left text-sm font-semibold text-[#718096]">
                TIN
              </th>

              <th className="w-[13%] px-3 text-left text-sm font-semibold text-[#718096]">
                YTD Gross
              </th>

              <th className="w-[11%] px-3 text-left text-sm font-semibold text-[#718096]">
                YTD PAYE
              </th>

              <th className="w-[13%] px-3 text-left text-sm font-semibold text-[#718096]">
                Effective Rate
              </th>
            </tr>
          </thead>

          {/* =================================================
              TABLE BODY
          ================================================== */}

          <tbody>
            {taxSummaryData.map((employee, index) => (
              <tr
                key={employee.id}
                className={`
                  h-16
                  border-b
                  border-[#edf0f3]
                  last:border-b-0
                  ${index % 2 === 0 ? "bg-white" : "bg-[#F5F6FA]"}
                `}
              >
                {/* EMPLOYEE */}

                <td className="px-5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-xs
                        font-bold
                        ${
                          employee.initials === "NE"
                            ? "bg-[#D8F5DE] text-[#329451]"
                            : "bg-[#E5F2FF] text-[#3182CE]"
                        }
                      `}
                    >
                      {employee.initials}
                    </div>

                    <span className="whitespace-nowrap text-sm font-semibold text-[#344054]">
                      {employee.name}
                    </span>
                  </div>
                </td>

                {/* DEPARTMENT */}

                <td className="px-3">
                  <span className="whitespace-nowrap text-sm font-medium text-[#667085]">
                    {employee.department}
                  </span>
                </td>

                {/* STATE / IRS */}

                <td className="px-3">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm font-medium text-[#344054]">
                      {employee.state}
                    </span>

                    <span
                      className={`
                        rounded-full
                        px-2
                        py-1
                        text-xs
                        font-semibold
                        ${
                          employee.irs === "LIRS"
                            ? "bg-[#E4F2FF] text-[#3182CE]"
                            : "bg-[#DDF5E1] text-[#329451]"
                        }
                      `}
                    >
                      {employee.irs}
                    </span>
                  </div>
                </td>

                {/* TIN */}

                <td className="px-3">
                  <span className="whitespace-nowrap font-mono text-xs font-medium tracking-wide text-[#667085]">
                    {employee.tin}
                  </span>
                </td>

                {/* YTD GROSS */}

                <td className="px-3">
                  <span className="whitespace-nowrap text-sm font-semibold text-[#263238]">
                    {employee.ytdGross}
                  </span>
                </td>

                {/* YTD PAYE */}

                <td className="px-3">
                  <span className="whitespace-nowrap text-sm font-bold text-[#FF3131]">
                    {employee.ytdPaye}
                  </span>
                </td>

                {/* EFFECTIVE RATE */}

                <td className="px-3">
                  <span className="inline-flex rounded-full bg-[#FFF3C9] px-2 py-1 text-xs font-semibold text-[#8B6914]">
                    {employee.effectiveRate}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
