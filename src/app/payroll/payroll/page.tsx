// src/app/payroll/payroll/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import {
  addPayRunPayees,
  createPayRun,
  fetchEligiblePayees,
  getApiErrorMessage,
  getPayeeGroups,
  processPayRun,
} from "@/lib/api/payroll";
import type { PayrollEligiblePayee, PayrollPayeeGroup } from "@/lib/api/types/payroll.types";
import Loader from "@/components/ui/Loader";

const PAGE_SIZE = 10;
const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const signed = (n: number) => `-${n.toLocaleString("en-NG")}`;
const ALL = "All Staff";

const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-[#2183C6]";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

function periodOf(month: string) {
  const [y, m] = month.split("-").map(Number);
  const last = new Date(y, m, 0).getDate();
  const mm = String(m).padStart(2, "0");
  return {
    from: `${y}-${mm}-01`,
    to: `${y}-${mm}-${String(last).padStart(2, "0")}`,
    label: `${MONTHS[m - 1]} ${y}`,
  };
}

const groupName = (p: PayrollEligiblePayee) => p.group?.name ?? "No group";

function Overlay({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={onClose}>
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function Check({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded border ${
          checked ? "border-[#2183C6] bg-[#2183C6] text-white" : "border-slate-300 bg-white"
        }`}
      >
        {checked && <FiCheck size={11} />}
      </span>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

function FilterPopover({
  label,
  heading,
  options,
  applied,
  onApply,
}: {
  label: string;
  heading: string;
  options: string[];
  applied: string[];
  onApply: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>(applied);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggle = (o: string) => {
    if (o === ALL) return setDraft(draft.includes(o) ? [] : [o]);
    const without = draft.filter((d) => d !== ALL);
    setDraft(without.includes(o) ? without.filter((d) => d !== o) : [...without, o]);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setDraft(applied);
          setOpen((v) => !v);
        }}
        className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        <FiFilter size={12} /> {label}
        {applied.length > 0 && !applied.includes(ALL) && (
          <span className="rounded-full bg-[#2183C6] px-1.5 text-[10px] text-white">{applied.length}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-20 w-64 rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
          <p className="mb-3 text-xs font-medium text-slate-900">{heading}</p>
          <div className="max-h-56 space-y-2 overflow-y-auto">
            {options.map((o) => (
              <Check key={o} checked={draft.includes(o)} label={o} onChange={() => toggle(o)} />
            ))}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200">
              Cancel
            </button>
            <button
              onClick={() => {
                onApply(draft);
                setOpen(false);
              }}
              className="rounded-md bg-[#2183C6] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type SortKey = "name" | "gross";

export default function CreatePayrollPage() {
  const [month, setMonth] = useState(currentMonth);
  const [payees, setPayees] = useState<PayrollEligiblePayee[]>([]);
  const [groups, setGroups] = useState<PayrollPayeeGroup[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string[]>([ALL]);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null);
  const [page, setPage] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // Kept so a retry after a partial failure resumes the same draft instead of creating a duplicate.
  const [draftId, setDraftId] = useState<{ id: string; month: string; added: boolean } | null>(null);

  const period = useMemo(() => periodOf(month), [month]);

  useEffect(() => {
    getPayeeGroups().then(setGroups).catch(() => setGroups([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError("");
    fetchEligiblePayees({ from: period.from, to: period.to })
      .then((list) => {
        if (cancelled) return;
        setPayees(list);
        setSelected(new Set(list.filter((p) => p.eligible !== false).map((p) => p.id)));
        setPage(1);
      })
      .catch((e) => {
        if (cancelled) return;
        setPayees([]);
        setSelected(new Set());
        setLoadError(getApiErrorMessage(e, "Could not load employees for this month."));
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [period.from, period.to]);

  const groupOptions = useMemo(() => [ALL, ...groups.map((g) => g.name), "No group"], [groups]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = payees.filter(
      (p) =>
        (!q || (p.name ?? "").toLowerCase().includes(q)) &&
        (groupFilter.length === 0 || groupFilter.includes(ALL) || groupFilter.includes(groupName(p))),
    );
    if (sort)
      list = [...list].sort(
        (a, b) =>
          (sort.key === "name" ? (a.name ?? "").localeCompare(b.name ?? "") : (a.grossSalary ?? 0) - (b.grossSalary ?? 0)) * sort.dir,
      );
    return list;
  }, [payees, search, groupFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const view = filtered.slice(start, start + PAGE_SIZE);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s?.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: 1 }));

  const chosen = payees.filter((p) => selected.has(p.id));
  const totals = {
    salary: chosen.reduce((s, p) => s + (p.grossSalary ?? 0), 0),
       tax: chosen.reduce((s, p) => s + (p.taxAmount ?? 0), 0),
    hasTax: chosen.some((p) => p.taxAmount !== undefined && p.taxAmount !== null),
    net: chosen.reduce((s, p) => s + (p.estimatedNetSalary ?? 0), 0),
  };
  const selectable = filtered.filter((p) => p.eligible !== false);
  const allSelected = selectable.length > 0 && selectable.every((p) => selected.has(p.id));

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const toggleAll = () =>
    setSelected((prev) => {
      const n = new Set(prev);
      if (allSelected) selectable.forEach((p) => n.delete(p.id));
      else selectable.forEach((p) => n.add(p.id));
      return n;
    });

  const submit = async () => {
    if (chosen.length === 0) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      let draft = draftId && draftId.month === month ? draftId : null;
      if (!draft) {
        const run = await createPayRun({
          periodLabel: period.label,
          from: period.from,
          to: period.to,
          selectionMode: "EMPTY",
        });
        draft = { id: run.id, month, added: false };
        setDraftId(draft);
      }
      if (!draft.added) {
        await addPayRunPayees(draft.id, { payeeIds: chosen.map((p) => p.id) });
        draft = { ...draft, added: true };
        setDraftId(draft);
      }
      await processPayRun(draft.id);
      setDraftId(null);
      setConfirmOpen(false);
      setCompleteOpen(true);
    } catch (e) {
      setSubmitError(getApiErrorMessage(e, "Could not submit payroll."));
    } finally {
      setSubmitting(false);
    }
  };

  const pageButtons = (): (number | "...")[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const set = new Set([1, 2, safePage, totalPages - 1, totalPages]);
    const nums = [...set].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
    const out: (number | "...")[] = [];
    nums.forEach((n, i) => {
      if (i > 0 && n - nums[i - 1] > 1) out.push("...");
      out.push(n);
    });
    return out;
  };

  const stats = [
    { label: "Total Salary", value: naira(totals.salary) },
       { label: "Total Tax", value: totals.hasTax ? naira(totals.tax) : "—" },
    { label: "Total Employees", value: String(chosen.length) },
    { label: "Estimated Net Pay", value: naira(totals.net) },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Payroll</h1>
        <Link href="/payroll/pay-runs" className="flex items-center gap-1.5 text-xs font-medium text-[#2183C6] hover:underline">
          View Payroll History <FiArrowRight size={13} />
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-stretch justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-[11px] text-slate-500">{s.label}</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <button
            onClick={() => {
              setSubmitError("");
              setConfirmOpen(true);
            }}
            disabled={chosen.length === 0 || loading}
            className="flex items-center gap-2 rounded-md bg-[#2183C6] px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit Payroll <FiArrowUpRight size={13} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search Employees"
            className={`${inputCls} py-1.5 pl-9 text-xs`}
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <FilterPopover
            label="Filter by Group"
            heading="Group"
            options={groupOptions}
            applied={groupFilter}
            onApply={(v) => {
              setGroupFilter(v);
              setPage(1);
            }}
          />
          <input
            type="month"
            value={month}
            onChange={(e) => e.target.value && setMonth(e.target.value)}
            aria-label="Pay month"
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-[#2183C6]"
          />
        </div>
      </div>

      {loadError && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{loadError}</p>}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-slate-500">
            <tr>
              <th className="w-8 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all employees"
                  className="h-4 w-4 cursor-pointer accent-[#2183C6]"
                />
              </th>
              <th className="cursor-pointer py-3 font-medium" onClick={() => toggleSort("name")}>Name ↕</th>
              <th className="py-3 font-medium">Group</th>
              <th className="cursor-pointer py-3 font-medium" onClick={() => toggleSort("gross")}>Gross Salary ↕</th>
              <th className="py-3 font-medium">Tax</th>
              <th className="py-3 font-medium">Net Salary</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400"><Loader variant="inline" label="Loading employees" /></td>
              </tr>
            )}
            {!loading && view.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  No employees on payroll for {period.label}.
                </td>
              </tr>
            )}
            {!loading &&
              view.map((p, idx) => (
                <tr key={p.id} className={idx % 2 === 1 ? "bg-slate-50" : ""}>
                  <td className="py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      disabled={p.eligible === false}
                      onChange={() => toggleOne(p.id)}
                      aria-label={`Select ${p.name ?? "employee"}`}
                      className="h-4 w-4 cursor-pointer accent-[#2183C6] disabled:cursor-not-allowed"
                    />
                  </td>
                  <td className="py-3 text-slate-800">
                    {p.name ?? "—"}
                    {p.eligible === false && p.ineligibleReason && (
                      <span className="ml-2 text-[11px] text-amber-600">{p.ineligibleReason}</span>
                    )}
                  </td>
                  <td className="py-3 text-slate-700">{groupName(p)}</td>
                  <td className="py-3 text-slate-700">{naira(p.grossSalary ?? 0)}</td>
                  <td className="py-3 text-red-500">{p.taxAmount === undefined || p.taxAmount === null ? "—" : signed(p.taxAmount)}</td>
                  <td className="py-3 text-slate-700">{naira(p.estimatedNetSalary ?? 0)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing {filtered.length === 0 ? 0 : start + 1} to {Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length} employees
        </span>
        <div className="flex items-center gap-1">
          <button disabled={safePage <= 1} onClick={() => setPage(safePage - 1)} className="rounded border border-slate-300 p-1.5 disabled:opacity-40" aria-label="Previous page">
            <FiChevronLeft size={13} />
          </button>
          {pageButtons().map((p, i) =>
            p === "..." ? (
              <span key={`d${i}`} className="px-2">…</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-7 min-w-7 rounded border px-2 ${safePage === p ? "border-[#2183C6] bg-[#2183C6] text-white" : "border-slate-300 text-slate-600"}`}
              >
                {p}
              </button>
            ),
          )}
          <button disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)} className="rounded border border-slate-300 p-1.5 disabled:opacity-40" aria-label="Next page">
            <FiChevronRight size={13} />
          </button>
        </div>
      </div>

      {confirmOpen && (
        <Overlay title="Submit Payroll for Approval" onClose={() => !submitting && setConfirmOpen(false)}>
          <p className="text-sm text-slate-600">
            You are about to submit payroll for {chosen.length} selected employees totalling {naira(totals.salary)} ({period.label}) for approval.
          </p>
          <p className="mt-2 text-xs text-slate-500">No payment is made until an approver approves this payroll.</p>
          {submitError && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{submitError}</p>}
          <div className="mt-6 flex justify-end gap-2">
            <button disabled={submitting} onClick={() => setConfirmOpen(false)} className="rounded-md bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50">
              Cancel
            </button>
            <button
              disabled={submitting || chosen.length === 0}
              onClick={submit}
              className="rounded-md bg-[#2183C6] px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Submitting…" : submitError ? "Retry" : "Submit for Approval"}
            </button>
          </div>
        </Overlay>
      )}

      {completeOpen && (
        <Overlay title="Submitted for Approval" onClose={() => setCompleteOpen(false)}>
          <div className="flex flex-col items-center py-4 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
              <FiCheck size={24} />
            </span>
            <p className="mt-3 text-sm text-slate-600">Your payroll has been submitted and is pending approval.</p>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setCompleteOpen(false)} className="rounded-md bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200">Close</button>
            <Link href="/payroll/pay-runs" className="rounded-md bg-[#2183C6] px-4 py-2 text-xs font-medium text-white hover:opacity-90">
              View Payroll History
            </Link>
          </div>
        </Overlay>
      )}
    </div>
  );
}