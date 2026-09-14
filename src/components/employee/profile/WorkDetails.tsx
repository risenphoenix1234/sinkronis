// components/employee/profile/WorkDetails.tsx
"use client";

import { formatDate, formatMoney, resourceName } from "@/lib/format";
import ProfileCard from "./ProfileCard";
import { WorkDetailsData } from "@/lib/api/employee";

export default function WorkDetails({ data }: { data: WorkDetailsData }) {
  const details = [
    { label: "Employee ID", value: data.employeeId },
    { label: "Pension ID", value: data.pensionId },
    { label: "Tax ID", value: data.taxId },
    { label: "Status", value: data.status },
    { label: "Department", value: resourceName(data.department) },
    { label: "Position", value: resourceName(data.position) },
    { label: "Manager", value: resourceName(data.manager) },
    { label: "Branch", value: resourceName(data.branch) },
    { label: "Start Date", value: formatDate(data.startDate) },
    { label: "Employment Type", value: data.employmentType },
    { label: "Work Mode", value: data.workMode },
    {
      label: "Earnings",
      value: formatMoney(data.earnings.amount, data.earnings.currency),
    },
  ];

  return (
    <ProfileCard title="Work Details">
      <div className="grid gap-6 sm:grid-cols-2">
        {details.map((item) => (
          <div key={item.label}>
            <p className="text-xs tracking-wide text-gray-400">{item.label}</p>
            <p className="mt-2 text-sm font-medium text-gray-800">
              {item.value || "—"}
            </p>
          </div>
        ))}
      </div>
    </ProfileCard>
  );
}
