// components/ReviewsTable.tsx

import { reviews } from "@/data/hris/reviews";
import StatusBadge from "../ui/StatusBadge";

export default function ReviewsTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-white text-left text-xs text-[#667085]">
            <th className="px-6 py-4">Employee</th>
            <th className="px-6 py-4">Department</th>
            <th className="px-6 py-4">Cycle</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Score</th>
            <th className="px-6 py-4">Rating</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map((review) => (
            <tr key={review.id} className="border-b border-gray-100 text-sm">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                    {review.initials}
                  </div>

                  <div>
                    <p className="font-medium text-[#101828]">{review.name}</p>

                    <p className="text-xs text-[#667085]">{review.role}</p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 text-[#475467]">{review.department}</td>

              <td className="px-6 py-4 text-[#475467]">{review.cycle}</td>

              <td className="px-6 py-4">
                <StatusBadge status={review.status} />
              </td>

              <td className="px-6 py-4 font-medium text-green-600">
                {review.score || "—"}
              </td>

              <td className="px-6 py-4 text-[#175CD3]">
                {review.rating || "—"}
              </td>

              <td className="px-6 py-4">
                <button
                  className={`rounded-md px-4 py-2 text-xs font-medium ${
                    review.action === "Approve"
                      ? "bg-purple-600 text-white"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {review.action}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
