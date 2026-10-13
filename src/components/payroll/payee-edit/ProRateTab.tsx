// src/components/payroll/payee-edit/ProRateTab.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";
import { Field, fmtLongDate, ghostBtn, inputCls, primaryBtn } from "./ui";
import { dateOnly } from "./utils";
import {
  createPayeeProration,
  deletePayeeProration,
  getApiErrorMessage,
  getPayeeProrations,
  updatePayeeProration,
} from "@/lib/api/payroll";
import { pickNum, pickText } from "@/lib/payroll-pick";
import type { PayeeProrationBasis, PayrollPayee, PayrollRecord } from "@/lib/api/types/payroll.types";

type Row = { id: string; justification: string; start: string; end: string; basis: PayeeProrationBasis; days: number };

const countDays = (start: string, end: string, basis: PayeeProrationBasis) => {
  if (!start || !end) return 0;
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  let count = 0;
  for (const d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    if (basis === "CALENDAR_DAYS" || (day !== 0 && day !== 6)) count++;
  }
  return count;
};

const toRow = (r: PayrollRecord): Row => {
  const basis: PayeeProrationBasis = r.basis === "WORKING_DAYS" ? "WORKING_DAYS" : "CALENDAR_DAYS";
  const start = dateOnly(pickText(r, ["payFrom", "startDate"]));
  const end = dateOnly(pickText(r, ["payUntil", "endDate"]));
  return {
    id: String(r.id ?? ""),
    justification: pickText(r, ["justification", "reason"]) ?? "-",
    start,
    end,
    basis,
    days: pickNum(r, ["paidDays", "days"]) ?? countDays(start, end, basis),
  };
};

const empty = { start: "", end: "", justification: "", basis: "CALENDAR_DAYS" as PayeeProrationBasis };

export default function ProRateTab({ payee }: { payee: PayrollPayee }) {
  const unsupported = !payee.employeeId;
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(!unsupported);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    if (unsupported) return;
    setLoading(true);
    setError("");
    try {
      const res = await getPayeeProrations(payee.id);
      setRows(res.items.map(toRow));
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not load paid dates."));
    } finally {
      setLoading(false);
    }
  }, [payee.id, unsupported]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const openAdd = () => {
    setEditingId(null);
    setForm(empty);
    setFormError("");
    setOpen(true);
  };

  const openEdit = (r: Row) => {
    setEditingId(r.id);
    setForm({ start: r.start, end: r.end, justification: r.justification === "-" ? "" : r.justification, basis: r.basis });
    setFormError("");
    setOpen(true);
  };

  const save = async () => {
    if (!form.start || !form.end) return setFormError("Select both dates.");
    if (form.end < form.start) return setFormError("Pay until cannot be before pay from.");
    if (form.justification.trim().length < 2) return setFormError("Justification must be at least 2 characters.");
    setSaving(true);
    setFormError("");
    const body = { payFrom: form.start, payUntil: form.end, basis: form.basis, justification: form.justification.trim() };
    try {
      if (editingId) await updatePayeeProration(payee.id, editingId, body);
      else await createPayeeProration(payee.id, body);
      setOpen(false);
      await load();
    } catch (e) {
      setFormError(getApiErrorMessage(e, "Could not save this paid date."));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: Row) => {
    if (!window.confirm("Remove this paid date?")) return;
    try {
      await deletePayeeProration(payee.id, r.id);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not remove this paid date."));
    }
  };

  if (unsupported) {
    return <p className="text-sm text-slate-500">Pro-rate dates can only be set for permanent employees.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={openAdd} className={`${primaryBtn} flex items-center gap-2`}>
          <FiPlus size={14} /> Add Pro-Rate Entry
        </button>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <table className="w-full text-left text-sm">
        <thead className="text-xs text-slate-500">
          <tr>
            <th className="py-3 font-medium">Justification</th>
            <th className="py-3 font-medium">Start Date</th>
            <th className="py-3 font-medium">End Date</th>
            <th className="py-3 font-medium">Paid Days</th>
            <th className="py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={5} className="py-10 text-center text-slate-400">Loading...</td>
            </tr>
          )}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={5} className="py-10 text-center text-slate-400">Nothing added yet.</td>
            </tr>
          )}
          {!loading &&
            rows.map((r, idx) => (
              <tr key={r.id} className={idx % 2 === 1 ? "bg-slate-50" : ""}>
                <td className="py-3 text-slate-700">{r.justification}</td>
                <td className="py-3 text-slate-700">{fmtLongDate(r.start)}</td>
                <td className="py-3 text-slate-700">{fmtLongDate(r.end)}</td>
                <td className="py-3 text-slate-700">{r.days} Days</td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEdit(r)} className="text-slate-600 hover:text-[#2183C6]" aria-label="Edit">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => remove(r)} className="text-slate-600 hover:text-red-600" aria-label="Remove">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <Modal open={open} title={editingId ? "Edit Paid Date" : "Add New Paid Date"} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Justification">
            <textarea className={`${inputCls} h-24 resize-none`} placeholder="Justification" value={form.justification} onChange={set("justification")} />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Pay from">
              <input type="date" className={inputCls} value={form.start} onChange={set("start")} />
            </Field>
            <Field label="Pay Until">
              <input type="date" className={inputCls} value={form.end} min={form.start} onChange={set("end")} />
            </Field>
          </div>
          <Field label="Count days by">
            <select className={inputCls} value={form.basis} onChange={set("basis")}>
              <option value="CALENDAR_DAYS">Calendar days</option>
              <option value="WORKING_DAYS">Working days</option>
            </select>
          </Field>
        </div>
        {formError && <p className="mt-4 text-sm text-red-600">{formError}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setOpen(false)} className={ghostBtn}>Cancel</button>
          <button onClick={save} disabled={saving} className={`${primaryBtn} disabled:opacity-60`}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </Modal>
    </div>
  );
}