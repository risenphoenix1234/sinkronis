// src/app/hris/employees/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  createEmployee,
  getDepartments,
  getEmployees,
} from "@/lib/api/hris";
import {
  CreateEmployeePayload,
  Department,
  Employee,
  LifecycleStatus,
  OperationalStatus,
  WorkMode,
} from "@/types/hris";

const emptyForm: CreateEmployeePayload = {
  employeeId: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  departmentId: "",
  position: "",
  joinedDate: new Date().toISOString().slice(0, 10),
  lifecycleStatus: "PROBATION",
  operationalStatus: "ACTIVE",
  workMode: "ONSITE",
  monthlySalary: 0,
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateEmployeePayload>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [employeesRes, departmentsRes] = await Promise.all([
        getEmployees(),
        getDepartments().catch(() => ({ data: [] as Department[] })), // don't block on this
      ]);
      setEmployees(employeesRes.data);
      setDepartments(departmentsRes.data);
    } catch (err: any) {
      setLoadError(
        err.response?.data?.message || "Couldn't load employees. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateField = <K extends keyof CreateEmployeePayload>(
    key: K,
    value: CreateEmployeePayload[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      await createEmployee({
        ...form,
        joinedDate: new Date(form.joinedDate).toISOString(),
      });
      setForm(emptyForm);
      setShowForm(false);
      await loadData();
    } catch (err: any) {
      setSubmitError(
        err.response?.data?.message || "Couldn't add this employee. Check the details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#1F2937]">Employees</h1>
            <p className="mt-1 text-[14px] text-[#667085]">
              {loading ? "Loading roster…" : `${employees.length} ${employees.length === 1 ? "person" : "people"} on record`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="flex h-[44px] items-center justify-center rounded-lg bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] px-5 font-semibold text-white transition hover:opacity-90"
          >
            {showForm ? "Cancel" : "Add employee"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-2xl border border-[#E5E9F0] bg-white p-8"
          >
            <h2 className="mb-6 text-[18px] font-semibold text-[#1F2937]">
              New employee
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Employee ID">
                <input
                  required
                  value={form.employeeId}
                  onChange={(e) => updateField("employeeId", e.target.value)}
                  placeholder="EMP-001"
                  className={inputClass}
                />
              </Field>

              <Field label="Position">
                <input
                  required
                  value={form.position}
                  onChange={(e) => updateField("position", e.target.value)}
                  placeholder="Software Engineer"
                  className={inputClass}
                />
              </Field>

              <Field label="First name">
                <input
                  required
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Last name">
                <input
                  required
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Email">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="jane.doe@company.com"
                  className={inputClass}
                />
              </Field>

              <Field label="Phone number">
                <input
                  required
                  value={form.phoneNumber}
                  onChange={(e) => updateField("phoneNumber", e.target.value)}
                  placeholder="+2348012345678"
                  className={inputClass}
                />
              </Field>

              <Field label="Department">
                {departments.length > 0 ? (
                  <select
                    required
                    value={form.departmentId}
                    onChange={(e) => updateField("departmentId", e.target.value)}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select a department
                    </option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    required
                    value={form.departmentId}
                    onChange={(e) => updateField("departmentId", e.target.value)}
                    placeholder="Department ID"
                    className={inputClass}
                  />
                )}
              </Field>

              <Field label="Joined date">
                <input
                  required
                  type="date"
                  value={form.joinedDate}
                  onChange={(e) => updateField("joinedDate", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Lifecycle status">
                <select
                  value={form.lifecycleStatus}
                  onChange={(e) =>
                    updateField("lifecycleStatus", e.target.value as LifecycleStatus)
                  }
                  className={inputClass}
                >
                  <option value="PROBATION">Probation</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ON_LEAVE">On leave</option>
                  <option value="TERMINATED">Terminated</option>
                </select>
              </Field>

              <Field label="Operational status">
                <select
                  value={form.operationalStatus}
                  onChange={(e) =>
                    updateField("operationalStatus", e.target.value as OperationalStatus)
                  }
                  className={inputClass}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </Field>

              <Field label="Work mode">
                <select
                  value={form.workMode}
                  onChange={(e) => updateField("workMode", e.target.value as WorkMode)}
                  className={inputClass}
                >
                  <option value="ONSITE">Onsite</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </Field>

              <Field label="Monthly salary">
                <input
                  required
                  type="number"
                  min={0}
                  value={form.monthlySalary}
                  onChange={(e) => updateField("monthlySalary", Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
            </div>

            {submitError && (
              <p className="mt-4 text-[13px] text-red-500">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex h-[48px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto sm:px-8"
            >
              {submitting ? "Adding…" : "Add employee"}
            </button>
          </form>
        )}

        <div className="rounded-2xl border border-[#E5E9F0] bg-white">
          {loading ? (
            <p className="p-8 text-[14px] text-[#667085]">Loading…</p>
          ) : loadError ? (
            <div className="p-8">
              <p className="text-[14px] text-red-500">{loadError}</p>
              <button
                type="button"
                onClick={loadData}
                className="mt-3 text-[13px] font-medium text-[#2388D0] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : employees.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[14px] text-[#667085]">
                No employees yet. Add the first person on your team.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#E5E9F0] text-[12px] uppercase tracking-wide text-[#98A2B3]">
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Position</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Work mode</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-[#E5E9F0] last:border-0">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#1F2937]">
                        {emp.firstName} {emp.lastName}
                      </div>
                      <div className="text-[13px] text-[#667085]">{emp.email}</div>
                    </td>
                    <td className="px-6 py-4 text-[#344054]">{emp.position}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={emp.lifecycleStatus} />
                    </td>
                    <td className="px-6 py-4 text-[#344054]">{emp.workMode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-[#344054]">
        {label}
      </label>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: LifecycleStatus }) {
  const styles: Record<LifecycleStatus, string> = {
    ACTIVE: "bg-[#ECFDF3] text-[#027A48]",
    PROBATION: "bg-[#FFFAEB] text-[#B54708]",
    ON_LEAVE: "bg-[#EFF8FF] text-[#175CD3]",
    TERMINATED: "bg-[#FEF3F2] text-[#B42318]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#E5E9F0] px-4 py-3 text-[15px] text-[#1F2937] outline-none transition focus:border-[#2388D0] focus:ring-2 focus:ring-[#2388D0]/15";
