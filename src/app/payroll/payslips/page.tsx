// src/app/payroll/payslips/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight, FiDownload, FiSearch } from "react-icons/fi";
import PayslipStatusBadge from "@/components/payroll/payslips/PayslipStatusBadge";
import { downloadBlob } from "@/components/payroll/payee-edit/utils";
import { downloadPayslipFile, exportPayslipsFile, getApiErrorMessage, getPayslipsPage } from "@/lib/api/payroll";
import { pickNum, pickText, type Rec } from "@/lib/payroll-pick";
import type { PayslipsPage } from "@/lib/api/types/payroll.types";

const PAGE_SIZE = 10;
const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

const nameOf = (r: Rec) => {
  const direct = pickText(r, ["employeeName", "displayName", "fullName", "payeeName", "name"]);
  if (direct) return direct;
  const emp = r.employee as Rec | undefined;
  return pickText(emp, ["fullName", "name", "displayName"]) ?? "-";
};

const periodOf = (r: Rec) => {
  const direct = pickText(r, ["periodLabel", "period", "payPeriod"]);
  if (direct) return direct;
  const p = r.period as Rec | undefined;
  return pickText(p, ["label"]) ?? "-";
};

export default function PayslipsListPage() {
  const [data, setData] = useState<PayslipsPage | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQuery(search.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const params = {
    search: query || undefined,
    status: status || undefined,
    departmentId: departmentId || undefined,
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await getPayslipsPage({ page, limit: PAGE_SIZE, search: query || undefined, status: status || undefined, departmentId: departmentId || undefined }));
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not load payslips."));
    } finally {
      setLoading(false);
    }
  }, [page, query, status, departmentId]);

  useEffect(() => {
    load();
  }, [load]);

  const items = data?.items ?? [];
  const totals = data?.totals ?? {};
  const pagination = data?.pagination ?? null;
  const total = pagination?.total ?? 0;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const start = (page - 1) * PAGE_SIZE;
  const statuses = data?.filters?.statuses ?? [];
  const departments = data?.filters?.departments ?? [];

  const exportAll = async () => {
    try {
      downloadBlob(await exportPayslipsFile(params), "payslips.csv");
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not export payslips."));
    }
  };

  const download = async (id: string, name: string) => {
    try {
      downloadBlob(await downloadPayslipFile(id), `payslip-${name.replace(/\s+/g, "-").toLowerCase()}.pdf`);
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not download this payslip."));
    }
  };

  const tiles = [
    { label: "Payslips", value: String(totals.payslipCount ?? 0) },
    { label: "Total Gross", value: naira(totals.totalGross ?? 0) },
    { label: "Total Deductions", value: naira(totals.totalDeductions ?? 0) },
    { label: "Total Net Pay", value: naira(totals.totalNetPay ?? 0) },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Payslips</h1>
        <button onClick={exportAll} className="flex items-center gap-2 text-xs font-medium text-[#2183C6] hover:underline">
          Export CSV <FiDownload size={13} />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs text-slate-500">{t.label}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{t.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="relative">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee"
            className="w-64 rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#2183C6]"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#2183C6]"
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <select
          value={departmentId}
          onChange={(e) => {
            setPage(1);
            setDepartmentId(e.target.value);
          }}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#2183C6]"
        >
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-dashed border-slate-300 text-xs text-slate-500">
            <tr>
              <th className="py-3 font-medium">Employee</th>
              <th className="py-3 font-medium">Pay Period</th>
              <th className="py-3 font-medium">Gross</th>
              <th className="py-3 font-medium">Deductions</th>
              <th className="py-3 font-medium">Net Pay</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">Loading payslips…</td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">No payslips yet.</td>
              </tr>
            )}
            {!loading &&
              items.map((r, idx) => {
                const id = String(r.id ?? idx);
                const name = nameOf(r);
                return (
                  <tr key={id} className={idx % 2 === 1 ? "bg-slate-50" : ""}>
                    <td className="py-4 text-slate-800">{name}</td>
                    <td className="py-4 text-slate-700">{periodOf(r)}</td>
                    <td className="py-4 text-slate-700">{naira(pickNum(r, ["grossPay", "gross", "cashGross"]) ?? 0)}</td>
                    <td className="py-4 text-slate-700">{naira(pickNum(r, ["totalDeductions", "deductions"]) ?? 0)}</td>
                    <td className="py-4 text-slate-700">{naira(pickNum(r, ["netPay", "net"]) ?? 0)}</td>
                    <td className="py-4">
                      <PayslipStatusBadge status={pickText(r, ["status"])} />
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-4 text-xs font-medium">
                        <Link href={`/payroll/payslips/${id}`} className="text-[#2183C6] hover:underline">View</Link>
                        <button onClick={() => download(id, name)} className="flex items-center gap-1 text-slate-600 hover:text-[#2183C6]">
                          <FiDownload size={12} /> Download
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing {total === 0 ? 0 : start + 1} to {Math.min(start + PAGE_SIZE, total)} of {total} Payslips
        </span>
        <div className="flex items-center gap-1">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border border-slate-300 p-1.5 disabled:opacity-40" aria-label="Previous page">
            <FiChevronLeft size={13} />
          </button>
          <span className="px-2">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded border border-slate-300 p-1.5 disabled:opacity-40" aria-label="Next page">
            <FiChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}