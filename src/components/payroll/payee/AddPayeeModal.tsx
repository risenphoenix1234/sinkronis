// components/payroll/payees/AddPayeeModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";

export type PayeeFormData = {
  fullName: string;
  type: string;
  status: string;
  email: string;
  phone: string;
  bank: string;
  accountNumber: string;
  accountName: string;
  tin: string;
  monthlyAmount: string;
  subjectToPaye: boolean;
};

type AddPayeeModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: PayeeFormData) => void;
};

const initialFormData: PayeeFormData = {
  fullName: "",
  type: "Contractor",
  status: "Active",
  email: "",
  phone: "",
  bank: "",
  accountNumber: "",
  accountName: "",
  tin: "",
  monthlyAmount: "0",
  subjectToPaye: false,
};

export default function AddPayeeModal({
  open,
  onClose,
  onSubmit,
}: AddPayeeModalProps) {
  const [formData, setFormData] = useState<PayeeFormData>(initialFormData);

  if (!open) return null;

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

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(formData);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="w-full max-w-[540px] rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="text-lg font-bold text-[#1f2937]">Add Payee</h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="rounded-md p-1 text-[#667085] transition hover:bg-[#f2f4f7] hover:text-[#1f2937]"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-6">
            <Field label="Full Name / Company Name" required>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="input"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Type">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input"
                >
                  <option>Contractor</option>
                  <option>Vendor</option>
                  <option>Director</option>
                  <option>Board Member</option>
                </select>
              </Field>

              <Field label="Status">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Email">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                />
              </Field>

              <Field label="Phone">
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                />
              </Field>
            </div>

            <Field label="Bank">
              <input
                name="bank"
                value={formData.bank}
                onChange={handleChange}
                className="input"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Account Number">
                <input
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="input"
                />
              </Field>

              <Field label="Account Name">
                <input
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  className="input"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="TIN (optional)">
                <input
                  name="tin"
                  value={formData.tin}
                  onChange={handleChange}
                  className="input"
                />
              </Field>

              <Field label="Monthly Amount (₦)" required>
                <input
                  name="monthlyAmount"
                  type="number"
                  min={0}
                  value={formData.monthlyAmount}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm text-[#374151]">
              <input
                type="checkbox"
                name="subjectToPaye"
                checked={formData.subjectToPaye}
                onChange={handleChange}
                className="h-4 w-4 rounded border-[#d0d5dd] text-[#1683d8] focus:ring-[#1683d8]"
              />
              Subject to PAYE tax
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-[#f0f0f0] px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              className="h-10 rounded-md border border-[#d0d5dd] bg-white px-5 text-sm font-medium text-[#344054] transition hover:bg-[#f9fafb]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-10 rounded-md bg-[#1683d8] px-5 text-sm font-medium text-white transition hover:bg-[#0f74c2]"
            >
              Save Payee
            </button>
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
      <label className="mb-1.5 block text-xs font-medium text-[#667085]">
        {label}
        {required && <span className="ml-0.5 text-[#667085]">*</span>}
      </label>
      {children}
    </div>
  );
}
