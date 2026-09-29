"use client";

import { useState } from "react";

interface GrandTotalProps {
  q1Score?: string;
  q2Score?: string;
  onMidYearChange?: (value: string) => void;
  onYearEndChange?: (value: string) => void;
}

export default function GrandTotal({
  q1Score = "--",
  q2Score = "--",
  onMidYearChange,
  onYearEndChange,
}: GrandTotalProps) {
  const [midYearRating, setMidYearRating] = useState("");
  const [yearEndRating, setYearEndRating] = useState("");

  const handleMidYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMidYearRating(e.target.value);
    onMidYearChange?.(e.target.value);
  };

  const handleYearEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYearEndRating(e.target.value);
    onYearEndChange?.(e.target.value);
  };

  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
      {/* Header */}

      <div className="grid grid-cols-3 bg-[#232B36] px-5 py-4 text-white">
        <div className="flex items-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider">
            Grand Total
          </h2>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400">Q1</p>

          <p className="mt-1 text-sm font-semibold">{q1Score}</p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400">Q2</p>

          <p className="mt-1 text-sm font-semibold">{q2Score}</p>
        </div>
      </div>

      {/* Body */}

      <div className="grid gap-5 p-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-600">
            Employee's Achieved Rating - Mid-Year
          </label>

          <input
            type="text"
            value={midYearRating}
            onChange={handleMidYearChange}
            placeholder="Enter rating / score..."
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-gray-600">
            Employee's Achieved Rating - Year End
          </label>

          <input
            type="text"
            value={yearEndRating}
            onChange={handleYearEndChange}
            placeholder="Enter rating / score..."
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>
    </div>
  );
}
