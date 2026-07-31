"use client";

export default function SignOffSection() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Sign Off</h2>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Employee Name
          </label>

          <input
            className="h-11 w-full rounded-lg border border-gray-300 px-4"
            placeholder="Employee"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Date</label>

          <input
            type="date"
            className="h-11 w-full rounded-lg border border-gray-300 px-4"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Manager Name</label>

          <input
            className="h-11 w-full rounded-lg border border-gray-300 px-4"
            placeholder="Manager"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Date</label>

          <input
            type="date"
            className="h-11 w-full rounded-lg border border-gray-300 px-4"
          />
        </div>
      </div>
    </div>
  );
}
