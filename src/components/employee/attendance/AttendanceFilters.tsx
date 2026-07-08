"use client";

import { FiCalendar, FiDownloadCloud, FiSearch } from "react-icons/fi";

export default function AttendanceFilters() {
  return (
    <div className="mt-10 flex items-center justify-between">
      <div className="relative w-[350px]">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

        <input
          placeholder="Search by name, role, department..."
          className="h-12 w-full rounded-lg border border-gray-200 pl-11 outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button className="flex h-12 items-center gap-2 rounded-lg border border-gray-200 px-5">
          <FiCalendar />
          May 19, 2025
        </button>

        <button className="flex h-12 items-center gap-2 rounded-lg border border-gray-200 px-5">
          Export CSV
          <FiDownloadCloud />
        </button>
      </div>
    </div>
  );
}
