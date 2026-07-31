export default function SelfAssessmentHeader() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Self-Assessment Form</h1>

      <p className="mt-2 text-sm text-gray-500">
        Q1 2026 Review • Completed 15 Apr 2026
      </p>

      <div className="mt-5 rounded-md border border-blue-200 bg-blue-50 px-4 py-3">
        <p className="text-sm text-blue-700">
          Self-assessment is open. Enter your submitted data before your
          supervisor reviews the evaluation.
        </p>
      </div>
    </div>
  );
}
