"use client";

import { Upload } from "lucide-react";
import { profile } from "@/data/employee/profile";

export default function ProfileHeader() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          {/* Avatar */}

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-600 text-xl font-extrabold text-white">
            {profile.initials}
          </div>

          {/* User Info */}

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {profile.fullName}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {profile.role} • {profile.employeeId}
            </p>

            <button className="mt-4 inline-flex items-center gap-2 rounded-lg border border-sky-200 px-4 py-2 text-sm font-medium text-sky-600 transition hover:bg-sky-50">
              <Upload size={16} />
              Upload Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
