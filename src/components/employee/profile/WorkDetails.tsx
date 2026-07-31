"use client";

import { profile } from "@/data/employee/profile";
import ProfileCard from "./ProfileCard";

export default function WorkDetails() {
  const details = [
    { label: "Employee ID", value: profile.work.employeeId },
    { label: "Pension ID", value: profile.work.pensionId },
    { label: "Tax ID", value: profile.work.taxId },
    { label: "Status", value: profile.work.status },
    { label: "Department", value: profile.work.department },
    { label: "Position", value: profile.work.position },
    { label: "Manager", value: profile.work.manager },
    { label: "Location", value: profile.work.location },
    { label: "Start Date", value: profile.work.startDate },
    { label: "Employment Type", value: profile.work.employmentType },
    { label: "Work Mode", value: profile.work.workMode },
    { label: "Earnings", value: profile.work.earnings },
  ];

  return (
    <ProfileCard title="Work Details">
      <div className="grid gap-6 sm:grid-cols-2">
        {details.map((item) => (
          <div key={item.label}>
            <p className="text-xs tracking-wide text-gray-400">
              {item.label}
            </p>

            <p className="mt-2 text-sm font-medium text-gray-800">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </ProfileCard>
  );
}
