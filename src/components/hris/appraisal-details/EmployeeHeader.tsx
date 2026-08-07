
export default function EmployeeHeader() {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
            AN
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">Amara Nwosu</h2>

            <p className="mt-1 text-sm text-slate-500">
              HR Manager · Human Resources · Manager: Chukwuemeka Obi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-right">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Acknowledged
            </span>

            <p className="mt-3 text-xs text-slate-400">
              Q2 2026 Review · Standard Performance Review
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-4xl font-bold text-green-700">83%</h2>

            <p className="text-xs text-slate-500">Exceeds Expectations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
