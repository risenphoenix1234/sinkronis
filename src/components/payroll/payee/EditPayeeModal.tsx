// components/payroll/payee/EditPayeeModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Calculator } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  UnifiedPayee,
  PayeeType,
  PayeeStatus,
  EmploymentType,
  formatNaira,
  calculatePayeeDeductions,
} from "@/types/payroll/unified-payee";

type EditPayeeModalProps = {
  open: boolean;
  payee: UnifiedPayee | null;
  onClose: () => void;
  onSave?: (updated: UnifiedPayee) => void;
};

export default function EditPayeeModal({
  open,
  payee,
  onClose,
  onSave,
}: EditPayeeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "Employee" as PayeeType,
    role: "",
    department: "",
    employmentType: "Full-time" as EmploymentType,
    status: "Active" as PayeeStatus,
    onPayroll: true,
    email: "",
    phone: "",
    stateOfResidence: "Lagos",
    bankName: "",
    bankAccount: "",
    accountName: "",
    monthlyAmount: "0",
    basicSalary: "0",
    housingAllowance: "0",
    transportAllowance: "0",
    otherAllowance: "0",
    taxable: true,
    tin: "",
    pensionPin: "",
    pfaName: "",
    nhfNumber: "",
  });

  useEffect(() => {
    if (payee) {
      setFormData({
        name: payee.name || "",
        type: payee.type || "Employee",
        role: payee.role || "",
        department: payee.department || "Operations",
        employmentType: payee.employmentType || "Full-time",
        status: payee.status || "Active",
        onPayroll: payee.onPayroll ?? true,
        email: payee.email || "",
        phone: payee.phone || "",
        stateOfResidence: payee.stateOfResidence || "Lagos",
        bankName: payee.bankName || "",
        bankAccount: payee.bankAccount || "",
        accountName: payee.accountName || "",
        monthlyAmount: String(payee.grossSalary || 0),
        basicSalary: String(payee.basicSalary || Math.round((payee.grossSalary || 0) * 0.4)),
        housingAllowance: String(payee.housingAllowance || Math.round((payee.grossSalary || 0) * 0.3)),
        transportAllowance: String(payee.transportAllowance || Math.round((payee.grossSalary || 0) * 0.2)),
        otherAllowance: String(payee.otherAllowance || 0),
        taxable: payee.taxable ?? true,
        tin: payee.statutory?.tin || "",
        pensionPin: payee.statutory?.pensionPin || "",
        pfaName: payee.statutory?.pfaName || "",
        nhfNumber: payee.statutory?.nhfNumber || "",
      });
    }
  }, [payee]);

  if (!open || !payee) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isEmployee = formData.type === "Employee";
  const basic = parseFloat(formData.basicSalary) || 0;
  const housing = parseFloat(formData.housingAllowance) || 0;
  const transport = parseFloat(formData.transportAllowance) || 0;
  const other = parseFloat(formData.otherAllowance) || 0;
  const flatAmount = parseFloat(formData.monthlyAmount) || 0;

  const gross = isEmployee ? basic + housing + transport + other : flatAmount;

  const preview = calculatePayeeDeductions({
    type: formData.type,
    grossSalary: gross,
    basicSalary: basic,
    housingAllowance: housing,
    transportAllowance: transport,
    otherAllowance: other,
    taxable: formData.taxable,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updated: UnifiedPayee = {
      ...payee,
      name: formData.name,
      type: formData.type,
      role: formData.role,
      department: formData.department,
      employmentType: formData.employmentType,
      status: formData.status,
      onPayroll: formData.onPayroll,
      email: formData.email,
      phone: formData.phone,
      stateOfResidence: formData.stateOfResidence,
      bankName: formData.bankName,
      bankAccount: formData.bankAccount,
      accountName: formData.accountName,
      taxable: formData.taxable,
      grossSalary: gross,
      basicSalary: isEmployee ? basic : undefined,
      housingAllowance: isEmployee ? housing : undefined,
      transportAllowance: isEmployee ? transport : undefined,
      otherAllowance: isEmployee ? other : undefined,
      statutory: {
        tin: formData.tin || undefined,
        pensionPin: formData.pensionPin || undefined,
        pfaName: formData.pfaName || undefined,
        nhfNumber: formData.nhfNumber || undefined,
      },
      deductions: preview.deductions,
      netSalary: preview.netSalary,
    };

    onSave?.(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#1f2937]">Edit Payee</h2>
            <p className="text-xs text-[#6b7280]">
              Update compensation, banking, and details for {payee.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-[#667085] transition hover:bg-[#f2f4f7] hover:text-[#1f2937]"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[65vh] overflow-y-auto px-6 py-5 space-y-4">
            <Field label="Full Name / Entity Name" required>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Payee Classification / Type" required>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-[#e5e7eb] px-3 text-sm outline-none focus:border-[#2183c6]"
                >
                  <option value="Employee">Employee (Salaried Staff)</option>
                  <option value="Contractor">Contractor (Individual / Firm)</option>
                  <option value="Vendor">Vendor (Supplies / Services)</option>
                  <option value="Director">Director (Executive / Non-Exec)</option>
                  <option value="Board Member">Board Member</option>
                </select>
              </Field>

              <Field label="Status">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-[#e5e7eb] px-3 text-sm outline-none focus:border-[#2183c6]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Role / Designation" required>
                <Input
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field label="Department">
                <Input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </Field>
            </div>

            {/* Compensation */}
            {isEmployee ? (
              <div className="space-y-3 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3.5">
                <span className="text-xs font-semibold text-[#1f2937]">Earnings Structure (Monthly)</span>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Basic Salary (₦)">
                    <Input
                      name="basicSalary"
                      type="number"
                      value={formData.basicSalary}
                      onChange={handleChange}
                    />
                  </Field>
                  <Field label="Housing Allowance (₦)">
                    <Input
                      name="housingAllowance"
                      type="number"
                      value={formData.housingAllowance}
                      onChange={handleChange}
                    />
                  </Field>
                  <Field label="Transport Allowance (₦)">
                    <Input
                      name="transportAllowance"
                      type="number"
                      value={formData.transportAllowance}
                      onChange={handleChange}
                    />
                  </Field>
                  <Field label="Other Allowance (₦)">
                    <Input
                      name="otherAllowance"
                      type="number"
                      value={formData.otherAllowance}
                      onChange={handleChange}
                    />
                  </Field>
                </div>
              </div>
            ) : (
              <Field label="Monthly Contract / Retainer Fee (₦)" required>
                <Input
                  name="monthlyAmount"
                  type="number"
                  value={formData.monthlyAmount}
                  onChange={handleChange}
                  required
                />
              </Field>
            )}

            {/* Calculation Preview */}
            <div className="flex items-center justify-between rounded-lg bg-[#f0f9ff] border border-[#bae6fd] p-3 text-xs">
              <div>
                <span className="text-[#64748b] block">Monthly Gross</span>
                <span className="font-bold text-[#0f172a] text-sm">{formatNaira(gross)}</span>
              </div>
              <div>
                <span className="text-[#64748b] block">Deductions</span>
                <span className="font-bold text-[#b91c1c] text-sm">
                  {formatNaira(preview.deductions.totalDeductions)}
                </span>
              </div>
              <div>
                <span className="text-[#64748b] block">Net Take-Home</span>
                <span className="font-bold text-[#15803d] text-sm">{formatNaira(preview.netSalary)}</span>
              </div>
            </div>

            {/* Bank details */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Bank Name">
                <Input
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Account Number">
                <Input
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm text-[#374151]">
              <input
                type="checkbox"
                name="onPayroll"
                checked={formData.onPayroll}
                onChange={handleChange}
                className="h-4 w-4 rounded border-[#d0d5dd] text-[#2183c6] focus:ring-[#2183c6]"
              />
              <span className="font-medium text-[#111827]">Active on Payroll</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-[#f0f0f0] bg-[#fafafa] px-6 py-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Update Payee
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[#4b5563]">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
