"use client";

import { useState } from "react";
import { FormField } from "../../hris/conduct/FormField";

type AddQueryModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormData = {
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  queryType: string;
  status: string;
  notes: string;
};

const initialFormData: FormData = {
  employeeId: "00354AE",
  employeeName: "",
  role: "IT Manager",
  department: "IT Department",
  queryType: "Performance-Related",
  status: "In Progress",
  notes: "",
};

const inputClassName =
  "h-11 w-full rounded-md border border-[#D9DEE7] bg-white px-3 text-sm text-[#344054] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2388D0] focus:ring-1 focus:ring-[#2388D0]";

export default function AddQueryModal({ open, onClose }: AddQueryModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Query:", formData);

    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6">
      {/* Modal */}
      <div className="flex max-h-[90vh] w-full max-w-[900px] flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header / Content */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-8 sm:py-8 lg:px-10">
            <h1 className="text-2xl font-bold leading-tight text-[#1F2937] sm:text-3xl">
              Add New Query
            </h1>

            {/* Form */}
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {/* Employee ID */}
              <FormField label="Employee ID">
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </FormField>

              {/* Employee Name */}
              <FormField label="Employee Name">
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="Employee Name"
                  className={inputClassName}
                />
              </FormField>

              {/* Role */}
              <FormField label="Role">
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </FormField>

              {/* Department */}
              <FormField label="Department">
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`${inputClassName} cursor-pointer appearance-auto`}
                >
                  <option value="IT Department">IT Department</option>
                  <option value="HR Department">HR Department</option>
                  <option value="Finance Department">Finance Department</option>
                </select>
              </FormField>

              {/* Query Type */}
              <FormField label="Query Type">
                <select
                  name="queryType"
                  value={formData.queryType}
                  onChange={handleChange}
                  className={`${inputClassName} cursor-pointer appearance-auto`}
                >
                  <option value="Performance-Related">
                    Performance-Related
                  </option>
                  <option value="Payroll">Payroll</option>
                  <option value="Leave Request">Leave Request</option>
                </select>
              </FormField>

              {/* Status */}
              <FormField label="Status">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`${inputClassName} cursor-pointer appearance-auto`}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Open">Open</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </FormField>

              {/* Notes */}
              <FormField label="Notes">
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add Note"
                  className={inputClassName}
                />
              </FormField>
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#E5E9EF] bg-white px-6 py-4 sm:px-8 lg:px-10">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-md border border-[#D9DEE7] bg-white px-5 text-sm font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-10 rounded-md bg-[#1683D8] px-6 text-sm font-medium text-white transition hover:bg-[#0F74C2]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
