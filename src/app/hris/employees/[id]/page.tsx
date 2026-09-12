"use client";

import { useRouter } from "next/navigation";
import { FiEdit2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import { getEmployee, getEmployeeActivity } from "@/lib/api/hris";
import { EmployeeActivityRecord, GetEmployeeDetail } from "@/lib/api/types/hrisTypes";

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PROBATION: "Probation",
  EXITED: "Exited",
};
 
const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-emerald-50 text-emerald-700",
  PROBATION: "bg-amber-50 text-amber-700",
  EXITED: "bg-rose-50 text-rose-700",
};
 
function field(obj: Record<string, unknown>, key: string): string {
  const value = obj[key];
  return typeof value === "string" && value.trim() ? value : "—";
}

export default function EmployeeProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [employee, setEmployee] = useState<GetEmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activity, setActivity] = useState<EmployeeActivityRecord[]>([])
 
  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [detail, activityRes] = await Promise.all([
      getEmployee(params.id),
      getEmployeeActivity(params.id).catch(() => ({ data: [] as EmployeeActivityRecord[] })), // don't block profile load if this fails
    ]);
    setEmployee(detail);
    setActivity(activityRes.data);
    } catch (error) {
      console.error("getEmployee failed:", error);
      setLoadError(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Couldn't load this employee."
          : "Couldn't load this employee.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);
 
  if (loading) {
    return <div className="p-6 text-slate-500">Loading employee…</div>;
  }
 
  if (loadError) {
    return (
      <div className="p-6">
        <p className="text-sm text-rose-600">{loadError}</p>
        <button
          onClick={load}
          className="mt-3 text-sm font-medium text-sky-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }
 
  if (!employee) {
    return <div className="p-6 text-slate-500">Employee not found.</div>;
  }
 
  const { header, personalInformation, documents } = employee;
  const statusKey = header.status;
  const personal = personalInformation as Record<string, unknown>;
 
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
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-2xl font-bold text-sky-600 overflow-hidden">
                  {header.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={header.profileImage}
                      alt={header.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    header.name.charAt(0)
                  )}
                </div>
                <p className="border-l border-0.5 h-8 border-slate-500"></p>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    {header.name}
                  </h1>
                  {/* No email field on header — swap in personalInformation's
                     email once that section is populated for this account. */}
                  <p className="mt-0.5 text-sm text-slate-500">
                    {header.role}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  router.push(`/hris/employees/${employee.header.id}/edit`)
                }
                className="flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <FiEdit2 size={14} /> Edit
              </button>
            </div>
 
            {/* Stats */}
            <div className=" gap-4 border-t border-slate-100 pt-5">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold">Overview</h2>
                <p className="text-gray-500 text-xs">
                  Date Joined:{" "}
                  {new Date(header.joinedDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
{              //YET TO BE DETERMINED
}              
                {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3 ">
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
                      Working Hours
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
                      Task Completed
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      210{" "}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      -2 Since last month{" "}
                    </p>
                  </div>
                </div> */}
              </div>
            </div>

          {/* Work Details */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-3 border-b-2 border-slate-200 pb-4">
              <h2 className="text-base font-semibold text-slate-800">
                Work Details
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  STATUS_STYLES[statusKey] ?? "bg-slate-100 text-slate-600"
                }`}
              >
                {STATUS_LABEL[statusKey] ?? statusKey}
              </span>
              <span className="ml-auto text-sm text-slate-500">
                Employee ID:{" "}
                <span className="font-medium text-slate-800">
                  {header.employeeId}{"   "}
                  <span className="border border-slate-300 text-slate-500 p-1 rounded hover:bg-slate-100 cursor-pointer">
                    Hide
                  </span>
                </span>
              </span>
            </div>
 
            <div className="grid grid-cols-3 gap-y-5 gap-x-6 text-sm">
              {[
                { label: "Department", value: header.department?.name ?? "—" },
                { label: "Phone", value: header.phoneNumber || "—" },
                { label: "Personal email", value: field(personal, "personalEmail") },
                { label: "Nationality", value: field(personal, "nationality") },
                { label: "Date of Birth", value: field(personal, "dateOfBirth") },
                { label: "Marital Status", value: field(personal, "maritalStatus") },
                { label: "Gender", value: field(personal, "gender") },
                { label: "City", value: field(personal, "city") },
                { label: "State", value: field(personal, "state") },
                { label: "Work Mode", value: field(personal, "workMode") },
                { label: "Address", value: field(personal, "address") },
                { label: "Earnings", value: field(personal, "earnings") },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">
                    {f.label}
                  </p>
                  <p className="font-medium text-slate-800">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
 
          {/* Documents */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-800">
              Documents
            </h2>
            {documents.length === 0 ? (
              <p className="text-sm text-slate-400">No documents uploaded.</p>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
                  >
                    <span className="text-slate-700">{doc.fileName}</span>
                    <span className="text-xs text-slate-400">{doc.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

            {/* Employee Activity */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-800">
              Employee Activity
            </h2>
            {activity.length === 0 ? (
                  <p className="text-sm text-slate-400">No activity recorded yet.</p>
            ): <div className="space-y-4">
      {activity.map((entry) => (
        <div key={entry.id} className="flex items-start gap-3">
          <span className="mt-0.5 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-600">
            {entry.action.replace("HRIS_EMPLOYEE_", "").replace("_", " ")}
          </span>
          <div>
            <p className="text-xs text-slate-400">
              {new Date(entry.createdAt).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm text-slate-600">{entry.summary}</p>
          </div>
        </div>
      ))}
    </div>}
           </div>
        </div>
      </div>
    </section>
  );
}
