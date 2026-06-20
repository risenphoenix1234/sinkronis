// components/appraisal/CycleOverview.tsx

export default function CycleOverview() {
  return (
    <div className="mt-6 rounded-lg border bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">
            Active Cycle: Q2 2026 Review
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Deadline: 15 July 2026 · Template: Standard Performance Review
          </p>
        </div>

        <button className="text-sm font-medium text-blue-600">
          View all →
        </button>
      </div>

      <div className="mt-6">
        <div className="h-2 rounded-full bg-slate-100">
          <div className="h-2 w-[17%] rounded-full bg-green-600" />
        </div>

        <p className="mt-2 text-xs text-slate-500">1 of 6 acknowledged (17%)</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-5">
        <StatusBox
          count="1"
          label="Goals Proposed"
          bg="bg-yellow-50"
          color="text-yellow-700"
        />

        <StatusBox
          count="0"
          label="Self-Assessment Open"
          bg="bg-yellow-50"
          color="text-yellow-700"
        />

        <StatusBox
          count="1"
          label="Under Manager Review"
          bg="bg-purple-50"
          color="text-purple-700"
        />

        <StatusBox
          count="1"
          label="Pending HR Approval"
          bg="bg-yellow-50"
          color="text-yellow-700"
        />

        <StatusBox
          count="1"
          label="Acknowledged"
          bg="bg-green-50"
          color="text-green-700"
        />
      </div>
    </div>
  );
}

function StatusBox({
  count,
  label,
  bg,
  color,
}: {
  count: string;
  label: string;
  bg: string;
  color: string;
}) {
  return (
    <div className={`rounded-md p-4 ${bg}`}>
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
      <p className="mt-2 text-xs text-slate-500">{label}</p>
    </div>
  );
}
