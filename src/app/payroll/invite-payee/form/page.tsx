// src/app/payroll/invite-payee/form/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BankSelect from "@/components/ui/BankSelect";
import { Field, ghostBtn, inputCls, primaryBtn, SectionTitle } from "@/components/payroll/payee-edit/ui";
import {
  assignPayeeGroup,
  createPayrollPayee,
  fetchPayrollEmployees,
  getApiErrorMessage,
  getPayeeGroups,
} from "@/lib/api/payroll";
import type {
  CreatePayrollPayeeBody,
  PayrollEmployeeListItem,
  PayrollPayeeGroup,
} from "@/lib/api/types/payroll.types";

type PayeeKind = "CONTRACT" | "CONSULTANT" | "PERMANENT";

const kindLabels: Record<PayeeKind, string> = {
  CONTRACT: "Contract",
  CONSULTANT: "Consultant",
  PERMANENT: "Permanent staff (from HRIS)",
};

const initial = {
  firstName: "",
  lastName: "",
  groupId: "",
  phone: "",
  email: "",
  bank: "",
  bankCode: "",
  accountNumber: "",
  grossSalary: "",
  taxId: "",
};

export default function PayeeFormPage() {
  const router = useRouter();
  const [kind, setKind] = useState<PayeeKind>("CONTRACT");
  const [employeeId, setEmployeeId] = useState("");
  const [form, setForm] = useState(initial);
  const [groups, setGroups] = useState<PayrollPayeeGroup[]>([]);
  const [employees, setEmployees] = useState<PayrollEmployeeListItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [createdNote, setCreatedNote] = useState("");

  useEffect(() => {
    getPayeeGroups()
      .then((g) => setGroups(g.filter((x) => x.active)))
      .catch(() => setGroups([]));
  }, []);

  useEffect(() => {
    if (kind !== "PERMANENT" || employees.length > 0) return;
    fetchPayrollEmployees({ limit: 100 })
      .then((r) => setEmployees(r.employees))
      .catch((e) => setError(getApiErrorMessage(e, "Could not load employees.")));
  }, [kind, employees.length]);

  const set = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError("");
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const submit = async () => {
    let body: CreatePayrollPayeeBody;

    if (kind === "PERMANENT") {
      if (!employeeId) {
        setError("Select an employee.");
        return;
      }
      body = { type: "PERMANENT", employeeId, taxRegime: "PAYE", onPayroll: true };
    } else {
      const name = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
      const amount = Number(form.grossSalary.replace(/[^0-9.]/g, ""));
      if (!form.firstName.trim() || !form.lastName.trim()) {
        setError("First name and last name are required.");
        return;
      }
      if (!amount || amount <= 0) {
        setError("Enter a gross salary greater than 0.");
        return;
      }
      if (form.accountNumber && !/^\d{10}$/.test(form.accountNumber)) {
        setError("Account number must be 10 digits.");
        return;
      }
      body = {
        type: kind,
        taxRegime: kind === "CONTRACT" ? "WHT" : "EXEMPT",
        name,
        monthlyAmount: amount,
        status: "ACTIVE",
        onPayroll: true,
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
        ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
        ...(form.bank ? { bankName: form.bank } : {}),
        ...(form.bankCode ? { bankCode: form.bankCode } : {}),
        ...(form.accountNumber ? { accountNumber: form.accountNumber } : {}),
        ...(form.taxId.trim() ? { tin: form.taxId.trim() } : {}),
      };
    }

    setSaving(true);
    setError("");
    try {
      const created = await createPayrollPayee(body);
      if (form.groupId) {
        try {
          await assignPayeeGroup(created.id, form.groupId);
        } catch (e) {
          setCreatedNote(`Payee was created, but the group could not be assigned: ${getApiErrorMessage(e)}`);
          setSaving(false);
          return;
        }
      }
      router.push("/payroll/payees");
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not create the payee."));
      setSaving(false);
    }
  };

  const groupField = (
    <Field label="Payee Group">
      <select className={inputCls} value={form.groupId} onChange={set("groupId")}>
        <option value="">Select group</option>
        {groups.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
    </Field>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Payee Form</h1>

      <div className="mt-6 max-w-2xl">
        <div className="sm:w-1/2 sm:pr-2">
          <Field label="Payee Type">
            <select
              className={inputCls}
              value={kind}
              onChange={(e) => {
                setError("");
                setKind(e.target.value as PayeeKind);
              }}
            >
              {(Object.keys(kindLabels) as PayeeKind[]).map((k) => (
                <option key={k} value={k}>
                  {kindLabels[k]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {kind === "PERMANENT" ? (
          <>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Employee">
                <select
                  className={inputCls}
                  value={employeeId}
                  onChange={(e) => {
                    setError("");
                    setEmployeeId(e.target.value);
                  }}
                >
                  <option value="">-select employee-</option>
                  {employees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.fullName} ({emp.employeeCode})
                    </option>
                  ))}
                </select>
              </Field>
              {groupField}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Name, contact and bank details for permanent staff come from their HRIS profile.
            </p>
          </>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First Name"><input className={inputCls} value={form.firstName} onChange={set("firstName")} /></Field>
              <Field label="Last Name"><input className={inputCls} value={form.lastName} onChange={set("lastName")} /></Field>
            </div>
            <div className="mt-4 sm:w-1/2 sm:pr-2">{groupField}</div>

            <SectionTitle>Contact Information</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Phone Number"><input className={inputCls} value={form.phone} onChange={set("phone")} /></Field>
              <Field label="Email address"><input className={inputCls} value={form.email} onChange={set("email")} /></Field>
            </div>

            <SectionTitle>Salary Information</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Bank Name">
                <BankSelect
                  className={inputCls}
                  code={form.bankCode}
                  name={form.bank}
                  onChange={(bank) => {
                    setError("");
                    setForm((f) => (f.bankCode === bank.code && f.bank === bank.name ? f : { ...f, bank: bank.name, bankCode: bank.code }));
                  }}
                  placeholder="-select bank-"
                />
              </Field>
              <Field label="Account Number"><input className={inputCls} placeholder="Account Number" inputMode="numeric" maxLength={10} value={form.accountNumber} onChange={set("accountNumber")} /></Field>
              <Field label="Gross Salary"><input className={inputCls} placeholder="-input gross salary-" inputMode="numeric" value={form.grossSalary} onChange={set("grossSalary")} /></Field>
            </div>

            <SectionTitle>Additional Information</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Tax ID"><input className={inputCls} placeholder="-input tax id-" value={form.taxId} onChange={set("taxId")} /></Field>
            </div>
          </>
        )}

        {error && <p className="mt-4 text-xs text-red-600">{error}</p>}
        {createdNote && (
          <p className="mt-4 text-xs text-amber-600">
            {createdNote}{" "}
            <button onClick={() => router.push("/payroll/payees")} className="font-medium underline">
              Go to Payee List
            </button>
          </p>
        )}

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={() => router.push("/payroll/invite-payee")} className={ghostBtn}>Cancel</button>
          <button onClick={submit} disabled={saving || !!createdNote} className={`${primaryBtn} disabled:opacity-60`}>
            {saving ? "Saving..." : "Create Payee"}
          </button>
        </div>
      </div>
    </div>
  );
}