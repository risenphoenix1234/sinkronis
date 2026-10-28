// src/components/payroll/payee-edit/EntriesTab.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";
import { Field, fmtDate, ghostBtn, inputCls, naira, primaryBtn } from "./ui";
import { dateOnly, todayIso } from "./utils";
import {
  createCustomDeduction,
  createPayrollDeductionTypeItem,
  createPayeeBonus,
  deleteCustomDeduction,
  deletePayeeBonus,
  getApiErrorMessage,
  getCustomDeductions,
  getPayeeBonuses,
  getPayrollDeductionTypeList,
  updatePayeeBonus,
} from "@/lib/api/payroll";
import { pickNum, pickText } from "@/lib/payroll-pick";
import type { PayrollPayee, PayrollRecord } from "@/lib/api/types/payroll.types";
import Loader from "@/components/ui/Loader";

export type EntryKind = "bonus" | "deduction";

type Entry = {
  id: string;
  justification: string;
  frequency: string;
  amount: number;
  dateAdded: string;
  dateEnded: string;
};

const config: Record<EntryKind, { addLabel: string; modalTitle: string; editTitle: string }> = {
  bonus: { addLabel: "Add Bonus", modalTitle: "Add New Bonus", editTitle: "Edit Bonus" },
  deduction: { addLabel: "Add Deduction", modalTitle: "Add New Deduction", editTitle: "Edit Deduction" },
};

const toEntry = (r: PayrollRecord): Entry => {
  const frequency = pickText(r, ["frequency", "type"]);
  return {
    id: String(r.id ?? ""),
    justification: pickText(r, ["justification", "reason", "name", "description"]) ?? "-",
    frequency:
      frequency === "ONCE" || frequency === "ONE_OFF"
        ? "Once"
        : frequency === "MULTIPLE" || frequency === "RECURRING" || frequency === "MONTHLY"
          ? "Multiple"
          : frequency ?? "-",
    amount: pickNum(r, ["amount", "monthlyAmount"]) ?? 0,
    dateAdded: dateOnly(pickText(r, ["effectiveFrom", "startDate", "createdAt"])),
    dateEnded: dateOnly(pickText(r, ["effectiveTo", "endDate"])),
  };
};

const emptyForm = { amount: "", frequency: "", justification: "", startDate: todayIso(), endDate: "" };

export default function EntriesTab({ kind, payee }: { kind: EntryKind; payee: PayrollPayee }) {
  const cfg = config[kind];
  const unsupported = kind === "deduction" && !payee.employeeId;
  const [rows, setRows] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(!unsupported);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    if (unsupported) return;
    setLoading(true);
    setError("");
    try {
      if (kind === "bonus") {
        const res = await getPayeeBonuses(payee.id);
        setRows(res.items.map(toEntry));
      } else {
        const res = await getCustomDeductions({ limit: 100 });
        setRows(res.items
            .filter((r) => r.status === undefined || r.status === "ACTIVE")
            .filter((r) => {
              const emp = r.employee as { id?: string } | undefined;
              return (emp?.id ?? r.employeeId) === payee.employeeId;
            })
            .map(toEntry));
      }
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not load entries."));
    } finally {
      setLoading(false);
    }
  }, [kind, payee.id, payee.employeeId, unsupported]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, startDate: todayIso() });
    setFormError("");
    setOpen(true);
  };

  const openEdit = (r: Entry) => {
    setEditingId(r.id);
    setForm({
      amount: String(r.amount),
      frequency: r.frequency === "Once" ? "ONCE" : "MULTIPLE",
      justification: r.justification === "-" ? "" : r.justification,
      startDate: r.dateAdded || todayIso(),
      endDate: r.dateEnded,
    });
    setFormError("");
    setOpen(true);
  };

  const save = async () => {
    const amount = Number(form.amount.replace(/[^0-9.]/g, ""));
    if (!amount) return setFormError("Enter an amount greater than 0.");
    if (form.justification.trim().length < 2) return setFormError("Justification must be at least 2 characters.");
    if (!form.frequency) return setFormError("Select a frequency.");
    if (kind === "bonus") {
      if (!form.startDate) return setFormError("Select a start date.");
      if (form.frequency === "MULTIPLE" && form.endDate && form.endDate < form.startDate) {
        return setFormError("End date cannot be before the start date.");
      }
    }
    setSaving(true);
    setFormError("");
    try {
      if (kind === "bonus") {
        const body = {
          amount,
          frequency: form.frequency as "ONCE" | "MULTIPLE",
          justification: form.justification.trim(),
          effectiveFrom: form.startDate,
          ...(form.frequency === "MULTIPLE" && form.endDate ? { effectiveTo: form.endDate } : {}),
        };
        if (editingId) await updatePayeeBonus(payee.id, editingId, body);
        else await createPayeeBonus(payee.id, body);
      } else {
        const name = form.justification.trim();
        const types = await getPayrollDeductionTypeList();
        const matched = types.find((t) => t.category === "VOLUNTARY" && t.name.toLowerCase() === name.toLowerCase());
        const deductionTypeId = matched ? matched.id : (await createPayrollDeductionTypeItem(name)).id;
        await createCustomDeduction({
          employeeId: payee.employeeId as string,
          deductionTypeId,
          amount,
          name,
          type: form.frequency === "ONCE" ? "ONE_OFF" : "RECURRING",
        });
      }
      setOpen(false);
      await load();
    } catch (e) {
      setFormError(getApiErrorMessage(e, "Could not save this entry."));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: Entry) => {
    if (!window.confirm("Remove this entry?")) return;
    try {
      if (kind === "bonus") await deletePayeeBonus(payee.id, r.id);
      else await deleteCustomDeduction(r.id);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not remove this entry."));
    }
  };

  if (unsupported) {
    return <p className="text-sm text-slate-500">Deductions can only be added for permanent employees.</p>;
  }

  const headers = kind === "bonus"
    ? ["Justification", "Frequency", "Amount", "Date Added", "Date Ended", "Action"]
    : ["Justification", "Frequency", "Amount", "Date Added", "Action"];

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={openAdd} className={`${primaryBtn} flex items-center gap-2`}>
          <FiPlus size={14} /> {cfg.addLabel}
        </button>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <table className="w-full text-left text-sm">
        <thead className="text-xs text-slate-500">
          <tr>
            {headers.map((h) => (
              <th key={h} className="py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={headers.length} className="py-10 text-center text-slate-400"><Loader variant="inline" label="Loading" /></td>
            </tr>
          )}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="py-10 text-center text-slate-400">Nothing added yet.</td>
            </tr>
          )}
          {!loading &&
            rows.map((r, idx) => (
              <tr key={r.id} className={idx % 2 === 1 ? "bg-slate-50" : ""}>
                <td className="py-3 text-slate-700">{r.justification}</td>
                <td className="py-3 text-slate-700">{r.frequency}</td>
                <td className="py-3 text-slate-700">{naira(r.amount)}</td>
                <td className="py-3 text-slate-700">{fmtDate(r.dateAdded)}</td>
                {kind === "bonus" && <td className="py-3 text-slate-700">{fmtDate(r.dateEnded)}</td>}
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    {kind === "bonus" && (
                      <button onClick={() => openEdit(r)} className="text-slate-600 hover:text-[#2183C6]" aria-label="Edit">
                        <FiEdit2 size={14} />
                      </button>
                    )}
                    <button onClick={() => remove(r)} className="text-slate-600 hover:text-red-600" aria-label="Remove">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <Modal open={open} title={editingId ? cfg.editTitle : cfg.modalTitle} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Amount">
              <input className={inputCls} placeholder="-input amount-" inputMode="numeric" value={form.amount} onChange={set("amount")} />
            </Field>
            <Field label="Frequency">
              <select className={inputCls} value={form.frequency} onChange={set("frequency")}>
                <option value="">-select frequency-</option>
                <option value="ONCE">Once</option>
                <option value="MULTIPLE">Multiple</option>
              </select>
            </Field>
          </div>
          <Field label="Justification">
            <input className={inputCls} placeholder="-input justification-" value={form.justification} onChange={set("justification")} />
          </Field>
          {kind === "bonus" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Start Date">
                <input type="date" className={inputCls} value={form.startDate} onChange={set("startDate")} />
              </Field>
              {form.frequency === "MULTIPLE" && (
                <Field label="End Date">
                  <input type="date" className={inputCls} value={form.endDate} min={form.startDate} onChange={set("endDate")} />
                </Field>
              )}
            </div>
          )}
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