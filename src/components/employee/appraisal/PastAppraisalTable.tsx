"use client";

import { Eye } from "lucide-react";
import { useState } from "react";
import ViewMyAppraisal from "./viewMyAppraisal";
import RatingBadge from "./RatingBadge";

type PastAppraisal = {
  cycle: string;
  period: string;
  score: string;
  rating: string;
  completedDate: string;
};

const pastAppraisals: PastAppraisal[] = [
  {
    cycle: "Cycle 1",
    period: "Jan - Jun 2024",
    score: "92",
    rating: "Excellent",
    completedDate: "2024-06-30",
  },
  {
    cycle: "Cycle 2",
    period: "Jul - Dec 2023",
    score: "88",
    rating: "Very Good",
    completedDate: "2023-12-31",
  },
];

export default function PastAppraisalTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mt-6 rounded-xl border bg-white">
      <div className="border-b p-6 font-semibold">Past Appraisals</div>

      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th className="p-5">Cycle</th>
            <th>Period</th>
            <th>Final Score</th>
            <th>Rating</th>
            <th>Date Completed</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {pastAppraisals.map((item) => (
            <tr key={item.cycle} className="border-t hover:bg-gray-50">
              <td className="p-5 font-medium">{item.cycle}</td>
              <td>{item.period}</td>
              <td>{item.score}</td>
              <td>
                <RatingBadge rating={item.rating} />
              </td>
              <td>{item.completedDate}</td>
              <td>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1 text-blue-600"
                >
                  <Eye size={16} />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ViewMyAppraisal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
