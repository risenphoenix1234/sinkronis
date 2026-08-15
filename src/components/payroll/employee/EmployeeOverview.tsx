type DetailRowProps = {
  label: string;
  value: string;
};

type PayRowProps = {
  label: string;
  value: string;
  valueClassName?: string;
  bold?: boolean;
};

const personalDetails = [
  {
    label: "Employee ID",
    value: "CS-004",
  },
  {
    label: "Email",
    value: "a.nwachukwu@sinkronis.com",
  },
  {
    label: "Phone",
    value: "+234 803 100 0007",
  },
  {
    label: "Join Date",
    value: "2022-02-28",
  },
  {
    label: "Tax State",
    value: "Lagos",
  },
  {
    label: "Tax Status",
    value: "Permanent — PAYE",
  },
  {
    label: "Bank",
    value: "Zenith Bank — 2109876543",
  },
  {
    label: "TIN",
    value: "1234567-0007",
  },
  {
    label: "Pension PIN",
    value: "PENI00078901",
  },
  {
    label: "PFA",
    value: "Leadway Pension",
  },
  {
    label: "NHF No.",
    value: "NHF/007/2022",
  },
];

const paySummary = [
  {
    label: "Basic Salary",
    value: "₦180,000",
  },
  {
    label: "Housing Allowance",
    value: "₦36,000",
  },
  {
    label: "Transport Allowance",
    value: "₦18,000",
  },
  {
    label: "Other Allowance",
    value: "₦9,000",
  },
];

const deductions = [
  {
    label: "PAYE",
    value: "(₦13,177)",
    className: "text-[#EF4444]",
  },
  {
    label: "Employee Pension (8%)",
    value: "(₦18,720)",
    className: "text-[#A16207]",
  },
  {
    label: "NHF (2.5%)",
    value: "(₦4,500)",
    className: "text-[#9333EA]",
  },
];

export default function EmployeeOverview() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_1fr]">
      {/* PERSONAL DETAILS */}

      <section className="rounded border border-[#E5E7EB] bg-white">
        <div className="px-5 py-5 sm:px-6">
          <h2 className="text-base font-semibold text-[#263342]">
            Personal Details
          </h2>

          <div className="mt-4">
            {personalDetails.map((item) => (
              <DetailRow
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        </div>
      </section>

      {/* MONTHLY PAY SUMMARY */}

      <section className="rounded border border-[#E5E7EB] bg-white">
        <div className="px-5 py-5 sm:px-6">
          <h2 className="text-base font-semibold text-[#263342]">
            Monthly Pay Summary
          </h2>

          <div className="mt-4">
            {paySummary.map((item) => (
              <PayRow key={item.label} label={item.label} value={item.value} />
            ))}

            <PayRow
              label="Gross Salary"
              value="₦243,000"
              bold
              valueClassName="text-[#1683D8]"
            />

            {deductions.map((item) => (
              <PayRow
                key={item.label}
                label={item.label}
                value={item.value}
                valueClassName={item.className}
              />
            ))}

            <PayRow
              label="Net Pay"
              value="₦206,603"
              bold
              valueClassName="text-[#15803D]"
            />

           

            <div className="mt-4 border-t border-[#F2F4F7] pt-3">
              <p className="text-[11px] text-[#98A2B3]">
                Employer Contributions (not deducted)
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#667085]">
                <span>
                  Pension (10%):
                  <strong className="ml-1 font-semibold text-[#A16207]">
                    ₦23,400
                  </strong>
                </span>

                <span className="text-[#D0D5DD]">|</span>

                <span>
                  NSITF (1%):
                  <strong className="ml-1 font-semibold text-[#A16207]">
                    ₦2,430
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-center border-b border-dashed border-[#E5E7EB] py-2.5 last:border-b-0 sm:grid-cols-[130px_1fr]">
      <span className="text-xs font-medium text-[#98A2B3] sm:text-sm">
        {label}
      </span>

      <span className="text-right text-xs font-medium text-[#263342] sm:text-sm">
        {value}
      </span>
    </div>
  );
}

function PayRow({
  label,
  value,
  valueClassName = "text-[#263342]",
  bold = false,
}: PayRowProps) {
  return (
    <div
      className={`flex items-center justify-between border-b border-dashed border-[#E5E7EB] py-2.5 ${
        bold ? "font-semibold" : ""
      }`}
    >
      <span
        className={`text-xs sm:text-sm ${
          bold ? "text-[#52647A]" : "text-[#667085]"
        }`}
      >
        {label}
      </span>

      <span
        className={`text-xs sm:text-sm ${
          bold ? "font-bold" : "font-medium"
        } ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}
