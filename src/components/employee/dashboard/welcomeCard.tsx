"use client";

import { DashboardEmployee } from "@/lib/api/types/employeeTypes";

interface Props {
  employee: DashboardEmployee;
  currentDate: string;
}

export default function WelcomeCard({ employee, currentDate }: Props) {
  const formattedDate = new Date(currentDate).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 p-8 text-white shadow">
      <div className="flex flex-col justify-between gap-8 md:flex-row">
        <div>
          <h2 className="text-3xl font-bold">
            Good morning, {employee.firstName} 👋
          </h2>

          <p className="mt-4 text-sm text-blue-100">
            {employee.role.name} • {employee.department.name}
          </p>

          <p className="mt-1 text-sm text-blue-100">{formattedDate}</p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-sm text-blue-100">Employee ID</p>
          <h3 className="mt-1 text-3xl font-bold">{employee.employeeId}</h3>
          <p className="mt-2 text-sm text-blue-100">{employee.branch.name}</p>
        </div>
      </div>
    </div>
  );
}
