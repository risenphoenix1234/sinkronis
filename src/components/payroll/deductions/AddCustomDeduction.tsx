"use client";

import { FormEvent, ChangeEvent, useState } from "react";
import { X } from "lucide-react";

import { CustomDeductionType } from "@/types/payroll/deduction-data";

export type CustomDeductionFormData = {
  employee: string;
  deductionName: string;
  monthlyAmount: string;
  type: CustomDeductionType;
};

type AddCustomDeductionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CustomDeductionFormData) => void;
};

const initialFormData: CustomDeductionFormData = {
  employee: "",
  deductionName: "",
  monthlyAmount: "",
  type: "Recurring",
};

export default function AddCustomDeductionModal({
  isOpen,
  onClose,
  onSubmit,
}: AddCustomDeductionModalProps) {
  const [formData, setFormData] =
    useState<CustomDeductionFormData>(initialFormData);

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
      <div
        className="w-full max-w-[520px] rounded-lg bg-white
          p-8 shadow-xl"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            Add Custom Deduction
          </h2>

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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Employee */}
          <InputField
            label="Employee"
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            required
          />

          {/* Deduction Name */}
          <InputField
            label="Deduction Name"
            name="deductionName"
            value={formData.deductionName}
            onChange={handleChange}
            placeholder="e.g. Cooperative Contribution"
            required
          />

          {/* Monthly Amount + Type */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InputField
              label="Monthly Amount (₦)"
              name="monthlyAmount"
              type="number"
              min="0"
              value={formData.monthlyAmount}
              onChange={handleChange}
              required
            />

            <SelectField
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={["Recurring", "One-off"]}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="h-11 min-w-[120px] rounded-md border
                border-slate-300 bg-white px-5 text-sm font-medium
                text-slate-700 transition
                hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-11 min-w-[180px] rounded-md
                bg-[#248ac6] px-6 text-sm font-medium text-white
                transition hover:bg-[#197db8]
                focus:outline-none focus:ring-2
                focus:ring-[#248ac6]/30"
            >
              Add Deduction
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
        className="h-11 w-full rounded-md border
          border-slate-300 bg-white px-3.5 text-sm
          text-slate-800 outline-none transition
          placeholder:text-slate-400
          focus:border-[#248ac6]
          focus:ring-2 focus:ring-[#248ac6]/10"
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
        className="h-11 w-full rounded-md border
          border-slate-300 bg-white px-3.5 text-sm
          text-slate-800 outline-none transition
          focus:border-[#248ac6]
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
