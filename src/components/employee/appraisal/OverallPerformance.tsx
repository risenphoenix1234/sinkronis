"use client";

export default function OverallPerformance() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Overall Performance Summary</h2>

      <textarea
        rows={6}
        placeholder="Provide an overall summary of the employee's performance..."
        className="mt-5 w-full rounded-lg border border-gray-300 p-4 outline-none focus:border-blue-500"
      />
    </div>
  );
}
