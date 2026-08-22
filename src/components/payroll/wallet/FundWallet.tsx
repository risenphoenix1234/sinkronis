"use client";

import { FormEvent, ChangeEvent, useState } from "react";
import { X } from "lucide-react";

export type FundWalletFormData = {
  amount: string;
  source: string;
  reference: string;
};

type FundWalletModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: FundWalletFormData) => void;
};

const initialFormData: FundWalletFormData = {
  amount: "",
  source: "Bank Transfer",
  reference: "",
};

export default function FundWalletModal({
  isOpen,
  onClose,
  onSubmit,
}: FundWalletModalProps) {
  const [formData, setFormData] = useState<FundWalletFormData>(initialFormData);

  if (!isOpen) return null;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit?.(formData);

    setFormData(initialFormData);
    onClose();
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
        bg-black/40 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-[480px] rounded-lg bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Fund Payroll Wallet
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Credit the payroll account ahead of a run.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center
              rounded-md text-slate-500 transition
              hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <div
          className="pt-4 pb-4 mb-8 w-full rounded-md border border-slate-300
          bg-slate-50 px-3.5 text-sm text-slate-800 outline-none
          transition placeholder:text-slate-400
          focus:border-[#248ac6] focus:ring-2 focus:ring-[#248ac6]/10"
        >
          <h2 className="mb-2 text-sm  text-slate-600">Current Balance</h2>
          <p className="text-2xl font-bold">₦1,454,878</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount */}
          <InputField
            label="Amount to Fund (₦) *"
            name="amount"
            type="number"
            min="1"
            placeholder="e.g. 5000000"
            value={formData.amount}
            onChange={handleChange}
            required
          />

          {/* Reference */}
          <InputField
            label="Transfer Reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="Bank transfer reference"
            required
          />

          {/* Actions */}
          <div className="flex items-center justify-between gap-1 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="h-11 w-full rounded-md border
                border-slate-300 bg-white px-5 text-base font-medium
                text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-11 w-full rounded-md bg-[#248ac6]
                px-6 text-base font-medium text-white transition
                hover:bg-[#197db8] focus:outline-none
                focus:ring-2 focus:ring-[#248ac6]/30"
            >
              Comfirm Funding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =====================================================
   INPUT FIELD
===================================================== */

type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
};

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-600"
      >
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className="h-11 w-full rounded-md border border-slate-300
          bg-white px-3.5 text-sm text-slate-800 outline-none
          transition placeholder:text-slate-400
          focus:border-[#248ac6] focus:ring-2 focus:ring-[#248ac6]/10"
      />
    </div>
  );
}

/* =====================================================
   SELECT FIELD
===================================================== */

type SelectFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
};

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-600"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-md border border-slate-300
          bg-white px-3.5 text-sm text-slate-800 outline-none
          transition focus:border-[#248ac6]
          focus:ring-2 focus:ring-[#248ac6]/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
