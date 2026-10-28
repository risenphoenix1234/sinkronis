"use client";

import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import LogExpenseModal from "@/components/modals/LogExpenseModal";
import EditExpenseModal from "@/components/modals/EditExpenseModal";
import DeleteExpenseModal from "@/components/modals/DeleteExpenseModal";
import { getExpenses, createExpense, updateExpense, voidExpense, getExpenseCategories } from "@/lib/api/accounting";
import { ExpenseItem, ExpensesSummary, CreateExpensePayload, UpdateExpensePayload, ExpenseCategory } from "@/lib/api/types/accounting.types";
import Loader from "@/components/ui/Loader";

function naira(value: number | string) {
  return `₦${Number(value).toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const emptySummary: ExpensesSummary = {
  totalExpenses: 0,
  thisMonth: 0,
  totalEntries: 0,
  topCategory: null,
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [summary, setSummary] = useState<ExpensesSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [logOpen, setLogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeExpense, setActiveExpense] = useState<ExpenseItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getExpenses({
        search: search || undefined,
        category: category || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setExpenses(res.data.expenses.filter((e) => e.status === "ACTIVE"));
      setSummary(res.data.summary);
    } catch (err) {
      setError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, startDate, endDate]);

  useEffect(() => {
    getExpenseCategories().then((res) => setCategories(res.data)).catch(() => setCategories([]));
  }, []);

  const handleCreate = async (payload: CreateExpensePayload) => {
    await createExpense(payload);
    await fetchExpenses();
  };

  const handleSave = async (id: string, payload: UpdateExpensePayload) => {
    await updateExpense(id, payload);
    await fetchExpenses();
  };

  const handleDelete = async () => {
    if (!activeExpense) return;
    setActionLoading(true);
    try {
      await voidExpense(activeExpense.id);
      await fetchExpenses();
    } catch (err) {
      // swallow for now — could surface a toast here
    } finally {
      setActionLoading(false);
      setDeleteOpen(false);
      setActiveExpense(null);
    }
  };

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Expenses</h1>
          <p className="mt-1 text-sm text-slate-500">
            {summary.totalEntries} expense entries logged
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
            ⬇ Export CSV
          </button>
          <button
            onClick={() => setLogOpen(true)}
            className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap"
          >
            + Log Expense
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Total Expenses</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{naira(summary.totalExpenses)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">This Month</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{naira(summary.thisMonth)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Total Entries</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{summary.totalEntries}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Top Category</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 leading-tight">
            {summary.topCategory?.category ?? "—"}
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search description or reference…"
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Reference</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Receipt No.</th>
              <th className="px-6 py-3 font-medium">Logged By</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-slate-400"><Loader variant="inline" label="Loading expenses" /></td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-red-500">{error}</td>
              </tr>
            )}

            {!loading && !error && expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">
                  {exp.reference}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {formatDate(exp.expenseDate)}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {exp.category}
                </td>
                <td className="px-6 py-3 text-base text-slate-700 max-w-xs">
                  {exp.description}
                </td>
                <td className="px-6 py-3 text-base tabular-nums font-medium text-slate-800 whitespace-nowrap">
                  {naira(exp.amount)}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {exp.receiptReference ?? "—"}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {exp.loggedBy.firstName} {exp.loggedBy.lastName}
                </td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => { setActiveExpense(exp); setEditOpen(true); }}
                    className="mr-3 rounded p-1.5 text-slate-400 hover:bg-sky-50 hover:text-sky-600"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => { setActiveExpense(exp); setDeleteOpen(true); }}
                    className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                  >
                    <RiDeleteBin6Line size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {!loading && !error && expenses.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-slate-400">No expenses logged yet.</td>
              </tr>
            )}
          </tbody>

          {!loading && !error && expenses.length > 0 && (
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50">
                <td colSpan={4} className="px-6 py-3 text-sm font-medium text-slate-700">
                  {expenses.length} entries shown
                </td>
                <td className="px-6 py-3 text-base tabular-nums font-semibold text-slate-900">
                  {naira(summary.totalExpenses)}
                </td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Modals */}
      <LogExpenseModal open={logOpen} onClose={() => setLogOpen(false)} onCreate={handleCreate} />
      <EditExpenseModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        expense={activeExpense}
        onSave={handleSave}
      />
      <DeleteExpenseModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        expenseId={activeExpense?.reference ?? null}
        onConfirm={handleDelete}
      />
    </section>
  );
}