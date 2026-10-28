// src/app/payroll/payee-groups/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FiDownload, FiEdit2, FiPlus } from "react-icons/fi";
import { getApiErrorMessage, getPayeeGroups } from "@/lib/api/payroll";
import type { PayrollPayeeGroup } from "@/lib/api/types/payroll.types";
import Loader from "@/components/ui/Loader";

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
        active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function PayeeGroupPage() {
  const [groups, setGroups] = useState<PayrollPayeeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setGroups(await getPayeeGroups());
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not load payee groups."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const exportCsv = () => {
    const header = ["Name", "Description", "Status"];
    const lines = groups.map((g) =>
      [g.name, g.description ?? "", g.active ? "Active" : "Inactive"].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payee-groups.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Payee Group</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCsv}
            disabled={groups.length === 0}
            className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Export CSV <FiDownload size={13} />
          </button>
          <Link
            href="/payroll/payee-groups/new"
            className="flex items-center gap-2 rounded-md bg-[#2183C6] px-4 py-2 text-xs font-medium text-white hover:opacity-90"
          >
            <FiPlus size={14} /> New Payee Group
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button onClick={load} className="font-medium underline">
            Retry
          </button>
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-slate-500">
            <tr>
              <th className="py-3 font-medium">Name</th>
              <th className="py-3 font-medium">Description</th>
              <th className="py-3 font-medium">Colour</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400"><Loader variant="inline" label="Loading payee groups" /></td>
              </tr>
            )}
            {!loading && !error && groups.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  No payee groups yet. Click New Payee Group to create one.
                </td>
              </tr>
            )}
            {!loading &&
              groups.map((g, idx) => (
                <tr key={g.id} className={idx % 2 === 1 ? "bg-slate-50" : ""}>
                  <td className="py-3 text-slate-800">{g.name}</td>
                  <td className="py-3 text-slate-600">{g.description || "—"}</td>
                  <td className="py-3">
                    {g.displayColor ? (
                      <span className="inline-flex items-center gap-2 text-xs text-slate-600">
                        <span className="h-3.5 w-3.5 rounded-full border border-slate-200" style={{ backgroundColor: g.displayColor }} />
                        {g.displayColor}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3">
                    <StatusPill active={g.active} />
                  </td>
                  <td className="py-3">
                    <Link href={`/payroll/payee-groups/${g.id}`} className="text-slate-600 hover:text-[#2183C6]" aria-label={`Edit ${g.name}`}>
                      <FiEdit2 size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}