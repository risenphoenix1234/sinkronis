"use client";

import { useRouter } from "next/navigation";
import { staticEmployees } from "@/data/hris/employees";
import { FiEdit2 } from "react-icons/fi";

const statusStyles = {
  Confirmed: "bg-emerald-50 text-emerald-700",
  Probation: "bg-amber-50 text-amber-700",
  Exited: "bg-rose-50 text-rose-700",
};

export default function EmployeeProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const employee = staticEmployees.find((e) => e.id === params.id);

  if (!employee)
    return <div className="p-6 text-slate-500">Employee not found.</div>;

  return (
    <section className="space-y-6 p-6">
      <button
        onClick={() => router.push("/hris/employees")}
        className="text-sm text-slate-500 hover:text-sky-600"
      >
        ← Back to Employees
      </button>

      <div className="flex gap-6">
        {/* Main profile */}
        <div className="flex-1 space-y-5">
          {/* Header card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-2xl font-bold text-sky-600">
                  {employee.name.charAt(0)}
                </div>
                <p className="border-l border-0.5 h-8 border-slate-500"></p>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    {employee.name}
                  </h1>
                  <p className="text-sm text-slate-500">{employee.email}</p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {employee.role}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  router.push(`/hris/employees/${employee.id}/edit`)
                }
                className="flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <FiEdit2 size={14} /> Edit
              </button>
            </div>

            {/* Stats */}
            <div className=" gap-4 border-t border-slate-100 pt-5">
              <div className="mb-4">
                <h2 className="text-3xl font-semibold">Overview</h2>
                <p className="text-gray-500 text-xs">
                  Date Joined: 13 May 2021
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3 ">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Attendance
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    14/16
                  </p>
                  <p className="text-xs text-sky-600 mt-2">
                    +2 Since last month
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Appraisal
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    2780 <span className="text-xs text-slate-400">H</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    +1 Since last month
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Appraisals
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    210{" "}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    -2 Since last month{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Work Details */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-3 border-b-2 border-slate-200 pb-4">
              <h2 className="text-base font-semibold text-slate-800">
                Work Details
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[employee.status]}`}
              >
                {employee.status}
              </span>
              <span className="ml-auto text-sm text-slate-500">
                Employee ID:{" "}
                <span className="font-medium text-slate-800">
                  {employee.employeeID}{"   "}
                  <span className="border border-slate-300 text-slate-500 p-1 rounded hover:bg-slate-100 cursor-pointer">
                    Hide
                  </span>
                </span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-y-5 gap-x-6 text-sm">
              {[
                { label: "Department", value: employee.department },
                { label: "Phone", value: employee.contact },
                { label: "Personal email", value: employee.personalEmail },
                { label: "Nationality", value: employee.nationality },
                { label: "Date of Birth", value: employee.dob },
                { label: "Marital Status", value: employee.maritalStatus },
                { label: "Gender", value: employee.gender },
                { label: "City", value: employee.city },
                { label: "State", value: employee.state },
                { label: "Work Mode", value: employee.workMode },
                { label: "Address", value: employee.address },
                { label: "Earnings", value: employee.earning },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">
                    {field.label}
                  </p>
                  <p className="font-medium text-slate-800">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Activity */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-800">
              Employee Activity
            </h2>
            <div className="space-y-4">
              {[
                {
                  type: "Check Out",
                  color: "text-rose-600 bg-rose-50",
                  time: "Today at 05:00 pm",
                  desc: "The employee has completed their work for the day.",
                },
                {
                  type: "Approved",
                  color: "text-emerald-600 bg-emerald-50",
                  time: "4 May 2026 at 10:00 am",
                  desc: "The task was approved for performance.",
                },
                {
                  type: "Check In",
                  color: "text-sky-600 bg-sky-50",
                  time: "4 May 2026 at 09:00 am",
                  desc: "The employee has clocked in to begin their work day.",
                },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${activity.color}`}
                  >
                    {activity.type}
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                    <p className="text-sm text-slate-600">{activity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
