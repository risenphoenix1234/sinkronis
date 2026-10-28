// src/app/payroll/payees/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DetailsTab from "@/components/payroll/payee-edit/DetailsTab";
import SalaryBreakdownTab from "@/components/payroll/payee-edit/SalaryBreakdownTab";
import PayrollHistoryTab from "@/components/payroll/payee-edit/PayrollHistoryTab";
import EntriesTab from "@/components/payroll/payee-edit/EntriesTab";
import ProRateTab from "@/components/payroll/payee-edit/ProRateTab";
import { getApiErrorMessage, getPayeeGroups, getPayrollPayee } from "@/lib/api/payroll";
import type { PayrollPayee, PayrollPayeeGroup } from "@/lib/api/types/payroll.types";
import Loader from "@/components/ui/Loader";

const tabs = [
  "Details",
  "Salary Breakdown",
  "Payroll History",
  "Bonuses",
  "Deduction",
  "Paid Date (For Pro-rates)",
] as const;

type Tab = (typeof tabs)[number];

export default function EditPayeePage() {
  const params = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>("Details");
  const [payee, setPayee] = useState<PayrollPayee | null>(null);
  const [groups, setGroups] = useState<PayrollPayeeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    Promise.all([getPayrollPayee(params.id), getPayeeGroups().catch(() => [] as PayrollPayeeGroup[])])
      .then(([p, g]) => {
        if (cancelled) return;
        setPayee(p);
        setGroups(g.filter((x) => x.active || x.id === p.group?.id));
      })
      .catch((e) => {
        if (!cancelled) setError(getApiErrorMessage(e, "Could not load this payee."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Edit Payee</h1>

      <div className="mt-5 flex flex-wrap gap-6 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 pb-3 text-sm transition-colors ${
              tab === t ? "border-[#2183C6] font-medium text-[#2183C6]" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading && <Loader variant="section" label="Loading payee" />}
        {!loading && error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && payee && (
          <>
            {tab === "Details" && <DetailsTab key={payee.id} payee={payee} groups={groups} />}
            {tab === "Salary Breakdown" && <SalaryBreakdownTab key={payee.id} payee={payee} onUpdated={setPayee} />}
            {tab === "Payroll History" && <PayrollHistoryTab payeeId={payee.id} />}
            {tab === "Bonuses" && <EntriesTab kind="bonus" payee={payee} />}
            {tab === "Deduction" && <EntriesTab kind="deduction" payee={payee} />}
            {tab === "Paid Date (For Pro-rates)" && <ProRateTab payee={payee} />}
          </>
        )}
      </div>
    </div>
  );
}