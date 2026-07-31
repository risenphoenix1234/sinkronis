export default function EmployeeInfoCard() {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-12">
        <Info title="Employee Name" value="Aaron Brown" />

        <Info title="Supervisor" value="Dudumeni Ovie" />

        <Info title="Department" value="HR Manager" />

        <Info title="Designation" value="Chief People Officer" />

        <Info title="Unit" value="Human Resources" />

        <Info title="Review Period" value="Jan - Mar 2026" />
      </div>
    </div>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{title}</p>

      <p className="mt-1 font-semibold text-gray-800">{value}</p>
    </div>
  );
}
