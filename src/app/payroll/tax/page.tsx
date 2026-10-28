// src/app/payroll/tax/page.tsx
"use client";

import { useEffect, useState } from "react";
import StateRow from "@/components/payroll/tax/StateRow";
import { getApiErrorMessage, getTaxEmployeesByState } from "@/lib/api/payroll";
import type { PayrollRecord } from "@/lib/api/types/payroll.types";
import { colorFor, initialsOf, pickText } from "@/lib/payroll-pick";
import Loader from "@/components/ui/Loader";

export default function PayrollTaxPage() {
  const [groups, setGroups] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTaxEmployeesByState({ limit: 1 })
      .then((res) => setGroups(res.groups))
      .catch((e) => setError(getApiErrorMessage(e, "Could not load tax authorities.")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Payroll Tax</h1>
      {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
      <div className="mt-6 border-t border-slate-200">
        {loading && <Loader variant="section" label="Loading tax authorities" />}
        {!loading && groups.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-slate-400">No PAYE has been deducted yet.</p>
        )}
        {!loading &&
          groups.map((g, i) => {
            const key = pickText(g, ["state", "stateName", "id", "name"]) ?? `state-${i}`;
            const name = pickText(g, ["stateName", "authorityName", "name", "state"]) ?? key;
            return (
              <StateRow
                key={key}
                name={name}
                initials={initialsOf(name)}
                color={colorFor(name)}
                href={`/payroll/tax/${encodeURIComponent(key)}`}
                striped={i % 2 === 1}
              />
            );
          })}
      </div>
    </div>
  );
}