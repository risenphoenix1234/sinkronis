// src/components/payroll/employee/AddEmployeeModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import BankSelect from "@/components/ui/BankSelect";

type AddEmployeeModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: EmployeeFormData) => void;
};

type EmployeeFormData = {
  fullName: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  state: string;
  employmentType: string;
  taxStatus: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  basicSalary: string;
  housingAllowance: string;
  transportAllowance: string;
  otherAllowance: string;
};

const initialFormData: EmployeeFormData = {
  fullName: "",
  role: "",
  department: "",
  email: "",
  phone: "",
  state: "",
  employmentType: "",
  taxStatus: "",
  bankName: "",
  bankCode: "",
  accountNumber: "",
  basicSalary: "",
  housingAllowance: "",
  transportAllowance: "",
  otherAllowance: "",
};

export default function AddEmployeeModal({
  open,
  onClose,
  onSubmit,
}: AddEmployeeModalProps) {
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);

  if (!open) return null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit?.(formData);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      {/* Modal */}
      <div className="max-h-[90vh] w-full max-w-[540px] overflow-y-auto rounded-lg bg-white shadow-2xl">
        {/* ================================================================ */}
        {/* HEADER */}
        {/* ================================================================ */}

        <div className="flex items-center justify-between px-8 pt-7">
          <h2 className="text-lg font-bold leading-6 text-[#263342]">
            Add New Employee
          </h2>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="rounded-md p-1 text-[#667085] transition hover:bg-[#F2F4F7] hover:text-[#263342]"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* ================================================================ */}
        {/* FORM */}
        {/* ================================================================ */}

        <form onSubmit={handleSubmit}>
          <div className="px-8 pb-8 pt-6">
            {/* Employee Information */}

            <div className="grid grid-cols-2 gap-x-3 gap-y-4">
              <FormField
                label="Full Name"
                required
                name="fullName"
                placeholder="e.g. Amara Okafor"
                value={formData.fullName}
                onChange={handleChange}
              />

              <FormField
                label="Role"
                required
                name="role"
                placeholder="e.g. HR Manager"
                value={formData.role}
                onChange={handleChange}
              />

              <FormField
                label="Department"
                name="department"
                placeholder="e.g. Finance"
                value={formData.department}
                onChange={handleChange}
              />

              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder=""
                value={formData.email}
                onChange={handleChange}
              />

              <FormField
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />

              <FormField
                label="State of Residence"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />

              <FormField
                label="Employment Type"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
              />

              <FormField
                label="Tax Status"
                name="taxStatus"
                value={formData.taxStatus}
                onChange={handleChange}
              />

              <div className="min-w-0">
                <label
                  htmlFor="bankName"
                  className="mb-1.5 block text-xs font-medium text-[#667085]"
                >
                  Bank Name
                </label>
                <BankSelect
                  code={formData.bankCode}
                  name={formData.bankName}
                  onChange={(bank) =>
                    setFormData((prev) =>
                      prev.bankCode === bank.code && prev.bankName === bank.name
                        ? prev
                        : { ...prev, bankCode: bank.code, bankName: bank.name },
                    )
                  }
                  className="h-9 w-full rounded border border-[#D0D5DD] bg-white px-3 text-sm text-[#344054] outline-none transition focus:border-[#2388D0] focus:ring-1 focus:ring-[#2388D0]"
                />
              </div>

              <FormField
                label="Account Number"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>

            {/* ============================================================ */}
            {/* SALARY STRUCTURE */}
            {/* ============================================================ */}

            <div className="mt-5">
              <h3 className="text-xs font-semibold text-[#263342]">
                Salary Structure
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
                <FormField
                  label="Basic Salary"
                  name="basicSalary"
                  value={formData.basicSalary}
                  onChange={handleChange}
                />

                <FormField
                  label="Housing Allowance"
                  name="housingAllowance"
                  value={formData.housingAllowance}
                  onChange={handleChange}
                />

                <FormField
                  label="Transport Allowance"
                  name="transportAllowance"
                  value={formData.transportAllowance}
                  onChange={handleChange}
                />

                <FormField
                  label="Other Allowance"
                  name="otherAllowance"
                  value={formData.otherAllowance}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ============================================================ */}
            {/* ACTIONS */}
            {/* ============================================================ */}

            <div className="mt-5 grid grid-cols-[155px_1fr] gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="h-10 rounded-md border border-[#D0D5DD] bg-white text-sm font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="h-10 rounded-md bg-[#2388D0] text-sm font-medium text-white transition hover:bg-[#1976B8]"
              >
                Create Employee
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* FORM FIELD                                                                */
/* ========================================================================= */

type FormFieldProps = {
  label: string;
  name: keyof EmployeeFormData;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
};

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: FormFieldProps) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-medium text-[#667085]"
      >
        {label}

        {required && <span className="ml-0.5 text-[#667085]">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="h-9 w-full rounded border border-[#D0D5DD] bg-white px-3 text-sm text-[#344054] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2388D0] focus:ring-1 focus:ring-[#2388D0]"
      />
    </div>
  );
}