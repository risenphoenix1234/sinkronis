// src/app/payroll/payees/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiDownload, FiMoreVertical, FiPlus, FiSearch } from "react-icons/fi";
import { exportPayeesFile, fetchPayees, getApiErrorMessage, updatePayrollPayee } from "@/lib/api/payroll";
import type {
  PayrollPayee,
  PayrollPayeeLifecycleStatus,
  PayrollPayeesSummary,
} from "@/lib/api/types/payroll.types";
import Loader from "@/components/ui/Loader";

const tabs: { key: PayrollPayeeLifecycleStatus; label: string }[] = [
  { key: "ACTIVE", label: "Active" },
  { key: "INACTIVE", label: "Inactive" },
];
const PAGE_SIZE = 10;

const lifecycle = (p: PayrollPayee): PayrollPayeeLifecycleStatus =>
  (p.payrollLifecycleStatus ?? (p.status === "ACTIVE" ? "ACTIVE" : "INACTIVE")) as PayrollPayeeLifecycleStatus;

export default function PayeesPage() {
  const router = useRouter();
  const [payees, setPayees] = useState<PayrollPayee[]>([]);
  const [summary, setSummary] = useState<PayrollPayeesSummary | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [tab, setTab] = useState<PayrollPayeeLifecycleStatus>("ACTIVE");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuId(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchPayees({
        page,
        limit: PAGE_SIZE,
        status: tab,
        ...(debounced ? { search: debounced } : {}),
      });
      setPayees(res.payees.filter((p) => lifecycle(p) === tab));
      setSummary(res.summary);
      setTotalPages(Math.max(1, res.pagination.totalPages));
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not load payees."));
    } finally {
      setLoading(false);
    }
  }, [page, tab, debounced]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleStatus = async (p: PayrollPayee) => {
    setMenuId(null);
    setBusyId(p.id);
    setError("");
    try {
      await updatePayrollPayee(p.id, { status: lifecycle(p) === "ACTIVE" ? "INACTIVE" : "ACTIVE" });
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not update this payee."));
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = async () => {
    setError("");
    try {
      const blob = await exportPayeesFile({ status: tab, ...(debounced ? { search: debounced } : {}) });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payees-${tab.toLowerCase()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not export payees."));
    }
  };

  const counts: Record<PayrollPayeeLifecycleStatus, number> = {
    ACTIVE: summary?.activeCount ?? 0,
    INACTIVE: summary?.inactiveCount ?? 0,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Payee List</h1>
          <p className="text-sm text-slate-500">Manage everyone you pay through payroll.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <FiDownload size={16} /> Export CSV
          </button>
          <Link
            href="/payroll/invite-payee"
            className="flex items-center gap-2 rounded-lg bg-[#2183C6] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <FiPlus size={16} /> New Payee
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button onClick={load} className="font-medium underline">
            Retry
          </button>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4">
          <div className="flex gap-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);
                  setPage(1);
                }}
                className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                  tab === t.key ? "border-[#2183C6] text-[#2183C6]" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {t.label} ({counts[t.key]})
              </button>
            ))}
          </div>
          <div className="relative w-full max-w-xs py-2">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payees"
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#2183C6]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Group</th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400"><Loader variant="inline" label="Loading payees" /></td>
                </tr>
              )}
              {!loading && !error && payees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                    No {tab.toLowerCase()} payees found.
                  </td>
                </tr>
              )}
              {!loading &&
                payees.map((p) => (
                  <tr key={p.id} className={`border-t border-slate-100 hover:bg-slate-50 ${busyId === p.id ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 font-medium text-slate-900">{p.name || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{p.email || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{p.phone || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{p.group?.name || "—"}</td>
                    <td className="relative px-4 py-3">
                      <button
                        onClick={() => setMenuId(menuId === p.id ? null : p.id)}
                        className="rounded p-1 text-slate-500 hover:bg-slate-100"
                        aria-label="Row actions"
                      >
                        <FiMoreVertical size={16} />
                      </button>
                      {menuId === p.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-4 top-10 z-10 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                        >
                          <button
                            onClick={() => router.push(`/payroll/payees/${p.id}`)}
                            className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          >
                            Edit Payee
                          </button>
                          <button
                            onClick={() => toggleStatus(p)}
                            className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          >
                            {lifecycle(p) === "ACTIVE" ? "Deactivate Payee" : "Activate Payee"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}