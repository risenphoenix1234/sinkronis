// src/components/payroll/payee-edit/DetailsTab.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, inputCls, primaryBtn, SectionTitle } from "./ui";
import BankSelect from "@/components/ui/BankSelect";
import { assignPayeeGroup, deletePayrollPayee, getApiErrorMessage, updatePayrollPayee } from "@/lib/api/payroll";
import type { PayrollPayee, PayrollPayeeGroup, UpdatePayrollPayeeBody } from "@/lib/api/types/payroll.types";

export default function DetailsTab({ payee, groups }: { payee: PayrollPayee; groups: PayrollPayeeGroup[] }) {
  const router = useRouter();
  const isPermanent = payee.type === "PERMANENT";
  const [first = "", ...rest] = (payee.name ?? "").split(" ");

  const initial = {
    firstName: first,
    lastName: rest.join(" "),
    phone: payee.phone ?? "",
    email: payee.email ?? "",
    bank: payee.bank?.bankName ?? "",
    bankCode: payee.bank?.bankCode ?? "",
    accountNumber: "",
    accountName: payee.bank?.accountName ?? "",
    groupId: payee.group?.id ?? "",
  };

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const setBank = (bank: { code: string; name: string }) => {
    setSaved(false);
    setError("");
    setForm((f) => (f.bankCode === bank.code && f.bank === bank.name ? f : { ...f, bank: bank.name, bankCode: bank.code }));
  };

  const set = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSaved(false);
    setError("");
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const save = async () => {
    const body: UpdatePayrollPayeeBody = {};
    const name = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    if (!isPermanent) {
      if (name && name !== (payee.name ?? "")) body.name = name;
      if (form.phone.trim() !== (payee.phone ?? "")) body.phone = form.phone.trim() || null;
      if (form.email.trim() !== (payee.email ?? "")) body.email = form.email.trim() || null;
      if (form.bank !== (payee.bank?.bankName ?? "") || form.bankCode !== (payee.bank?.bankCode ?? "")) {
        body.bankName = form.bank || null;
        body.bankCode = form.bankCode || null;
      }
      if (form.accountName.trim() !== (payee.bank?.accountName ?? "")) body.accountName = form.accountName.trim() || null;
      if (form.accountNumber) {
        if (!/^\d{10}$/.test(form.accountNumber)) {
          setError("Account number must be 10 digits.");
          return;
        }
        body.accountNumber = form.accountNumber;
      }
    }
    const groupChanged = form.groupId !== (payee.group?.id ?? "");

    if (Object.keys(body).length === 0 && !(groupChanged && form.groupId)) {
      setError("No changes to save.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (Object.keys(body).length > 0) await updatePayrollPayee(payee.id, body);
      if (groupChanged && form.groupId) await assignPayeeGroup(payee.id, form.groupId);
      setSaved(true);
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not save changes."));
    } finally {
      setSaving(false);
    }
  };

  const terminate = async () => {
    if (!window.confirm(`Remove ${payee.name ?? "this payee"} from future payroll runs?`)) return;
    setSaving(true);
    setError("");
    try {
      await deletePayrollPayee(payee.id);
      router.push("/payroll/payees");
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not remove this payee."));
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      {isPermanent && (
        <p className="mb-4 text-xs text-slate-500">
          Personal, contact and bank details for permanent staff come from their HRIS profile. You can change their payee group here.
        </p>
      )}

      <SectionTitle>Personal Information</SectionTitle>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First Name"><input className={inputCls} disabled={isPermanent} value={form.firstName} onChange={set("firstName")} /></Field>
        <Field label="Last Name"><input className={inputCls} disabled={isPermanent} value={form.lastName} onChange={set("lastName")} /></Field>
      </div>

      <SectionTitle>Contact Information</SectionTitle>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Phone Number"><input className={inputCls} disabled={isPermanent} value={form.phone} onChange={set("phone")} /></Field>
        <Field label="Email address"><input className={inputCls} disabled={isPermanent} value={form.email} onChange={set("email")} /></Field>
      </div>

      <SectionTitle>Salary Information</SectionTitle>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Bank Name">
          <BankSelect
            className={inputCls}
            disabled={isPermanent}
            code={form.bankCode}
            name={form.bank}
            onChange={setBank}
            placeholder="-select bank-"
          />
        </Field>
        <Field label="Account Number">
          <input
            className={inputCls}
            disabled={isPermanent}
            inputMode="numeric"
            maxLength={10}
            placeholder={payee.bank?.accountNumber ? `Current: ${payee.bank.accountNumber}` : "Account Number"}
            value={form.accountNumber}
            onChange={set("accountNumber")}
          />
        </Field>
        <Field label="Account Name"><input className={inputCls} disabled={isPermanent} placeholder="Account Name" value={form.accountName} onChange={set("accountName")} /></Field>
      </div>

      <SectionTitle>Payee Group</SectionTitle>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Add employee to a group">
          <select className={inputCls} value={form.groupId} onChange={set("groupId")}>
            <option value="">No group</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </Field>
      </div>

      {error && <p className="mt-4 text-xs text-red-600">{error}</p>}

      <div className="mt-10 flex items-center justify-end gap-3">
        {saved && <span className="text-sm text-green-600">Saved</span>}
        <button
          type="button"
          onClick={terminate}
          disabled={saving}
          className="rounded-md bg-slate-100 px-5 py-2 text-sm font-medium text-red-600 hover:bg-slate-200 disabled:opacity-60"
        >
          Terminate
        </button>
        <button type="button" onClick={save} disabled={saving} className={`${primaryBtn} disabled:opacity-60`}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}