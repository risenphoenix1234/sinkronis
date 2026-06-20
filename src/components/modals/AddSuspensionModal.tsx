"use client";

import { useState } from "react";
import { FormField } from "../conduct/FormField";

type AddSuspensionModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddSuspensionModal({ open, onClose }: AddSuspensionModalProps) {
  const [formData, setFormData] = useState({
    employeeId: "00354AE",
    employeeName: "",
    role: "IT Manager",
    department: "IT Department",
    queryType: "Performance-Related",
    status: "In Progress",
    from: "",
    to: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="h-[90vh] w-[900px] overflow-y-auto rounded-lg bg-[#f7f7f7] shadow-xl">
        <div className="px-6 pt-6">
          <h1 className="text-[40px] font-bold text-[#1f2937]">
            Add New Suspension
          </h1>

          <div className="mt-8 grid max-w-[820px] grid-cols-2 gap-x-6 gap-y-5">
            <FormField label="Employee ID">
              <input
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="input"
              />
            </FormField>

            <FormField label="Employee Name">
              <input
                name="employeeName"
                placeholder="Employee Name"
                value={formData.employeeName}
                onChange={handleChange}
                className="input"
              />
            </FormField>

            <FormField label="Role">
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
              />
            </FormField>

            <FormField label="Department">
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input"
              >
                <option>IT Department</option>
                <option>HR Department</option>
                <option>Finance Department</option>
              </select>
            </FormField>

            <FormField label="Query Type">
              <select
                name="queryType"
                value={formData.queryType}
                onChange={handleChange}
                className="input"
              >
                <option>Performance-Related</option>
                <option>Payroll</option>
                <option>Leave Request</option>
              </select>
            </FormField>

            <FormField label="Status">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option>In Progress</option>
                <option>Open</option>
                <option>Resolved</option>
              </select>
            </FormField>

            <FormField label="Notes">
              <input
                name="from"
                placeholder="From"
                value={formData.from}
                onChange={handleChange}
                className="input"
              />
            </FormField>

            <FormField label="Notes">
              <input
                name="to"
                placeholder="To"
                value={formData.to}
                onChange={handleChange}
                className="input"
              />
            </FormField>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-8">
          <button
            onClick={onClose}
            className="h-10 rounded-md border border-gray-300 bg-white px-5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button className="h-10 rounded-md bg-[#1683d8] px-5 text-sm text-white hover:bg-[#0f74c2]">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
