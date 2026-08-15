import Link from "next/link";

export default function CurrentPhaseCard() {
  return (
    <div className="mt-8 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-5">
      <div>
        <h3 className="font-semibold text-blue-700">
          Current Phase: Self-Assessment
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          Click "Begin Self-Assessment" to open the full OKR appraisal form and
          enter your achieved values for each quarter.
        </p>
      </div>

      <Link
        className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        href="/employee/appraisal/self-assessment"
      >
        Begin Self-Assessment →
      </Link>
    </div>
  );
}
