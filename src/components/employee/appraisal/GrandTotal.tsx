"use client";

interface Props {
  score: number;
}

export default function GrandTotal({ score }: Props) {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Grand Total</h3>

          <p className="mt-1 text-sm text-gray-500">
            Overall Performance Score
          </p>
        </div>

        <div className="text-right">
          <h2 className="text-5xl font-bold text-green-600">{score}%</h2>

          <span className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            Meets Expectations
          </span>
        </div>
      </div>
    </div>
  );
}
