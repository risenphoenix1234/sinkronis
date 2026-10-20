// src/app/hris/leave-settings/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2, Plus, RefreshCw, X } from "lucide-react";
import {
  createLeaveType,
  getEmployeeLeaveBalances,
  getEmployees,
  getLeaveTypes,
  provisionEmployeeLeaveBalances,
  setEmployeeLeaveEntitlement,
  updateLeaveType,
} from "@/lib/api/hris";
import type {
  EmployeeLeaveBalance,
  EmployeeLeaveBalancesData,
  LeaveType,
} from "@/lib/api/hris";

type Tab = "types" | "entitlements";

type EmployeeOption = { id: string; name: string; employeeId: string };

function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (Array.isArray(data?.validationErrors) && data.validationErrors.length > 0) {
      const joined = data.validationErrors
        .map((v: { message?: string }) => v.message)
        .filter(Boolean)
        .join(", ");
      if (joined) return joined;
    }
    if (data?.message) return data.message;
  }
  return fallback;
}

const inputClass =
  "mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:bg-slate-50";

export default function LeaveSettingsPage() {
  const [tab, setTab] = useState<Tab>("types");

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [typesError, setTypesError] = useState<string | null>(null);

  const loadTypes = useCallback(async () => {
    setTypesLoading(true);
    setTypesError(null);
    try {
      setLeaveTypes(await getLeaveTypes());
    } catch (err) {
      setTypesError(getErrorMessage(err, "Could not load leave types."));
    } finally {
      setTypesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  return (
    <div className="flex h-screen bg-[#F7F8FA]">
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-800">Leave Setup</h1>
            <p className="mt-1 text-xs text-slate-500">
              Create leave types, then set how many days each employee gets. Employees
              can only request leave once they have a balance for it.
            </p>
          </div>

          <div className="mb-4 flex gap-2">
            {(
              [
                { value: "types", label: "Leave Types" },
                { value: "entitlements", label: "Employee Entitlements" },
              ] as { value: Tab; label: string }[]
            ).map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setTab(item.value)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  tab === item.value
                    ? "border-sky-600 bg-sky-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === "types" ? (
            <LeaveTypesPanel
              leaveTypes={leaveTypes}
              loading={typesLoading}
              error={typesError}
              reload={loadTypes}
            />
          ) : (
            <EntitlementsPanel leaveTypes={leaveTypes} typesLoading={typesLoading} />
          )}
        </div>
      </div>
    </div>
  );
}

function LeaveTypesPanel({
  leaveTypes,
  loading,
  error,
  reload,
}: {
  leaveTypes: LeaveType[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}) {
  const [modal, setModal] = useState<{ mode: "create" } | { mode: "edit"; item: LeaveType } | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [allowance, setAllowance] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const openCreate = () => {
    setModal({ mode: "create" });
    setCode("");
    setName("");
    setAllowance("");
    setFormError(null);
  };

  const openEdit = (item: LeaveType) => {
    setModal({ mode: "edit", item });
    setCode(item.code);
    setName(item.name);
    setAllowance(String(item.annualAllowance));
    setFormError(null);
  };

  const closeModal = () => {
    if (saving) return;
    setModal(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;

    const trimmedName = name.trim();
    const days = Number(allowance);
    if (modal.mode === "create" && !code.trim()) {
      setFormError("Code is required.");
      return;
    }
    if (!trimmedName) {
      setFormError("Name is required.");
      return;
    }
    if (allowance.trim() === "" || Number.isNaN(days) || days < 0) {
      setFormError("Enter a valid number of days.");
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      if (modal.mode === "create") {
        await createLeaveType({
          code: code.trim().toUpperCase().replace(/\s+/g, "_"),
          name: trimmedName,
          annualAllowance: days,
        });
        toast.success("Leave type created. Set employee entitlements to make it available.");
      } else {
        await updateLeaveType(modal.item.id, {
          name: trimmedName,
          annualAllowance: days,
        });
        toast.success("Leave type updated.");
      }
      setModal(null);
      await reload();
    } catch (err) {
      const message = getErrorMessage(err, "Could not save this leave type.");
      setFormError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item: LeaveType) => {
    setTogglingId(item.id);
    try {
      await updateLeaveType(item.id, { active: !item.active });
      toast.success(item.active ? "Leave type deactivated." : "Leave type activated.");
      await reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not change the status."));
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
        >
          <Plus size={15} />
          Add Leave Type
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-xs">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-left text-xs font-medium text-slate-500">
              <th className="px-4 py-4">Name</th>
              <th className="px-4 py-4">Code</th>
              <th className="px-4 py-4">Annual allowance</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4" />
            </tr>
          </thead>
          <tbody>
            {loading && leaveTypes.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-slate-500">
                  Loading leave types...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <p className="text-sm font-medium text-red-600">{error}</p>
                  <button
                    type="button"
                    onClick={reload}
                    className="mt-2 text-sm font-medium text-sky-600 underline"
                  >
                    Try again
                  </button>
                </td>
              </tr>
            ) : leaveTypes.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-slate-500">
                  No leave types yet. Add one to get started.
                </td>
              </tr>
            ) : (
              leaveTypes.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-4 text-sm font-medium text-slate-800">{item.name}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{item.code}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {item.annualAllowance} days
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        item.active
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleActive(item)}
                        disabled={togglingId === item.id}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        {item.active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={submit} className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                {modal.mode === "create" ? "Add Leave Type" : "Edit Leave Type"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500">Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={modal.mode === "edit" || saving}
                  placeholder="e.g. ANNUAL_LEAVE"
                  className={inputClass}
                />
                {modal.mode === "create" && (
                  <p className="mt-1 text-xs text-slate-400">
                    The code can&apos;t be changed after it&apos;s created.
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving}
                  placeholder="e.g. Annual Leave"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">
                  Annual allowance (days)
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.5"
                  value={allowance}
                  onChange={(e) => setAllowance(e.target.value)}
                  disabled={saving}
                  placeholder="e.g. 20"
                  className={inputClass}
                />
              </div>
            </div>

            {formError && <p className="mt-3 text-sm text-red-600">{formError}</p>}

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
              >
                {saving && <Loader2 size={15} className="animate-spin" />}
                {modal.mode === "create" ? "Create" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function EntitlementsPanel({
  leaveTypes,
  typesLoading,
}: {
  leaveTypes: LeaveType[];
  typesLoading: boolean;
}) {
  const currentYear = new Date().getFullYear();

  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  const [employeeId, setEmployeeId] = useState("");
  const [year, setYear] = useState(currentYear);

  const [data, setData] = useState<EmployeeLeaveBalancesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [provisioning, setProvisioning] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await getEmployees({ limit: 100 });
        if (!active) return;
        setEmployees(
          list.map((emp) => ({ id: emp.id, name: emp.name, employeeId: emp.employeeId })),
        );
      } catch (err) {
        if (active) setEmployeesError(getErrorMessage(err, "Could not load employees."));
      } finally {
        if (active) setEmployeesLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const loadBalances = useCallback(async () => {
    if (!employeeId) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setData(await getEmployeeLeaveBalances(employeeId, year));
      setDrafts({});
    } catch (err) {
      setError(getErrorMessage(err, "Could not load leave balances."));
    } finally {
      setLoading(false);
    }
  }, [employeeId, year]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  const rows = useMemo(() => {
    const balances = data?.balances ?? [];
    const byType = new Map<string, EmployeeLeaveBalance>();
    balances.forEach((b) => byType.set(b.leaveType.id, b));

    const result: {
      key: string;
      leaveTypeId: string;
      name: string;
      code: string;
      allowance: number | null;
      balance: EmployeeLeaveBalance | null;
    }[] = [];

    leaveTypes
      .filter((lt) => lt.active || byType.has(lt.id))
      .forEach((lt) => {
        result.push({
          key: lt.id,
          leaveTypeId: lt.id,
          name: lt.name,
          code: lt.code,
          allowance: lt.annualAllowance,
          balance: byType.get(lt.id) ?? null,
        });
        byType.delete(lt.id);
      });

    byType.forEach((b) => {
      result.push({
        key: b.leaveType.id,
        leaveTypeId: b.leaveType.id,
        name: b.leaveType.name,
        code: b.leaveType.code,
        allowance: null,
        balance: b,
      });
    });

    return result;
  }, [data, leaveTypes]);

  const missingTypeIds = rows.filter((r) => !r.balance && r.allowance !== null).map((r) => r.leaveTypeId);

  const save = async (leaveTypeId: string, value: string) => {
    const entitlement = Number(value);
    if (value.trim() === "" || Number.isNaN(entitlement) || entitlement < 0) {
      toast.warning("Enter a valid number of days.");
      return;
    }
    setSavingId(leaveTypeId);
    try {
      await setEmployeeLeaveEntitlement(employeeId, leaveTypeId, { year, entitlement });
      toast.success("Entitlement saved.");
      await loadBalances();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save this entitlement."));
    } finally {
      setSavingId(null);
    }
  };

  const provision = async () => {
    if (missingTypeIds.length === 0) return;
    setProvisioning(true);
    try {
      await provisionEmployeeLeaveBalances(employeeId, missingTypeIds);
      toast.success("Balances created from each leave type's annual allowance.");
      await loadBalances();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not provision balances."));
    } finally {
      setProvisioning(false);
    }
  };

  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-500">Employee</label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            disabled={employeesLoading}
            className={inputClass}
          >
            <option value="">
              {employeesLoading ? "Loading employees..." : "Select an employee"}
            </option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.employeeId})
              </option>
            ))}
          </select>
          {employeesError && <p className="mt-1 text-xs text-red-600">{employeesError}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className={inputClass}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!employeeId ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Pick an employee to see and set their leave entitlements.
        </div>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              {data?.availability === "NOT_CONFIGURED"
                ? "No balances are set up for this employee yet."
                : "Used and pending days count against the entitlement, so it can't be set below them."}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={loadBalances}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              {year === currentYear && missingTypeIds.length > 0 && (
                <button
                  type="button"
                  onClick={provision}
                  disabled={provisioning || loading}
                  className="flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
                >
                  {provisioning && <Loader2 size={14} className="animate-spin" />}
                  Provision missing balances
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-xs">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-left text-xs font-medium text-slate-500">
                  <th className="px-4 py-4">Leave type</th>
                  <th className="px-4 py-4">Entitlement (days)</th>
                  <th className="px-4 py-4">Used</th>
                  <th className="px-4 py-4">Pending</th>
                  <th className="px-4 py-4">Available</th>
                  <th className="px-4 py-4" />
                </tr>
              </thead>
              <tbody>
                {(loading && !data) || typesLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-slate-500">
                      Loading balances...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <p className="text-sm font-medium text-red-600">{error}</p>
                      <button
                        type="button"
                        onClick={loadBalances}
                        className="mt-2 text-sm font-medium text-sky-600 underline"
                      >
                        Try again
                      </button>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-slate-500">
                      No active leave types. Add one on the Leave Types tab first.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => {
                    const current = row.balance ? String(row.balance.entitlement) : "";
                    const value = drafts[row.leaveTypeId] ?? current;
                    const changed = drafts[row.leaveTypeId] !== undefined && value !== current;
                    return (
                      <tr key={row.key} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-4">
                          <p className="text-sm font-medium text-slate-800">{row.name}</p>
                          <p className="text-xs text-slate-500">{row.code}</p>
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            min={0}
                            step="0.5"
                            value={value}
                            placeholder={row.allowance !== null ? String(row.allowance) : "0"}
                            onChange={(e) =>
                              setDrafts((prev) => ({ ...prev, [row.leaveTypeId]: e.target.value }))
                            }
                            className="w-28 rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                          />
                          {!row.balance && (
                            <p className="mt-1 text-xs text-amber-600">Not set up yet</p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {row.balance ? row.balance.used : "—"}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {row.balance ? row.balance.pending : "—"}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-slate-800">
                          {row.balance ? row.balance.available : "—"}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => save(row.leaveTypeId, value)}
                              disabled={
                                savingId === row.leaveTypeId ||
                                (row.balance ? !changed : value.trim() === "")
                              }
                              className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-sky-700 disabled:opacity-50"
                            >
                              {savingId === row.leaveTypeId ? "Saving..." : "Save"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}