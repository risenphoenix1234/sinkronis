import StatusBadge from "../appraisal/StatusBadge";

export default function EmployeeCard() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F2FD] text-lg font-bold text-[#1677C8]">
            TA
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              Tunde Adeyemi
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Operations Lead · Operations · Manager: Chukwumeka Obi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-right">
            <StatusBadge text="Pending HR Approval" color="yellow" />

            <p className="mt-3 text-sm text-gray-500">
              Q2 2026 Review • Standard Performance Review
            </p>
          </div>

          <div className="border-l pl-8">
            <h1 className="text-5xl font-bold text-[#A16207]">63%</h1>

            <p className="mt-2 text-sm text-gray-500">Below Expectation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
