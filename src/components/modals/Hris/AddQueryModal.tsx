"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FormField } from "../../hris/conduct/FormField";
import { issueConductQuery } from "@/lib/api/hris";

type AddQueryModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

type FormData = {
  employeeId: string;
  queryType: string;
  notes: string;
};

const initialFormData: FormData = {
  employeeId: "",
  queryType: "PERFORMANCE",
  notes: "",
};

const QUERY_TYPES = [
  { value: "PERFORMANCE", label: "Performance-Related" },
  { value: "CONDUCT", label: "Conduct" },
  { value: "ATTENDANCE", label: "Attendance" },
  { value: "POLICY_VIOLATION", label: "Policy Violation" },
];

const inputClassName =
  "h-11 w-full rounded-md border border-[#D9DEE7] bg-white px-3 text-sm text-[#344054] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2388D0] focus:ring-1 focus:ring-[#2388D0]";

export default function AddQueryModal({ open, onClose, onSuccess }: AddQueryModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await issueConductQuery({
        employeeId: formData.employeeId,
        queryType: formData.queryType,
        notes: formData.notes,
      });
      toast.success("Query issued successfully");
      setFormData(initialFormData);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(msg ?? "Failed to issue query");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6">
      {/* Modal */}
      <div className="flex max-h-[90vh] w-full max-w-[600px] flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header / Content */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-8 sm:py-8 lg:px-10">
            <h1 className="text-2xl font-bold leading-tight text-[#1F2937] sm:text-3xl">
              Issue New Query
            </h1>

            {/* Form */}
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-5">
              {/* Employee ID */}
              <FormField label="Employee ID">
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="e.g. EMP-001"
                  required
                  className={inputClassName}
                />
              </FormField>

              {/* Query Type */}
              <FormField label="Query Type">
                <select
                  name="queryType"
                  value={formData.queryType}
                  onChange={handleChange}
                  required
                  className={`${inputClassName} cursor-pointer appearance-auto`}
                >
                  {QUERY_TYPES.map((qt) => (
                    <option key={qt.value} value={qt.value}>
                      {qt.label}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Notes */}
              <FormField label="Notes">
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Describe the query reason..."
                  required
                  rows={4}
                  className={`${inputClassName} h-auto py-2 resize-none`}
                />
              </FormField>
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#E5E9EF] bg-white px-6 py-4 sm:px-8 lg:px-10">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-10 rounded-md border border-[#D9DEE7] bg-white px-5 text-sm font-medium text-[#344054] transition hover:bg-[#F9FAFB] disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="h-10 rounded-md bg-[#1683D8] px-6 text-sm font-medium text-white transition hover:bg-[#0F74C2] disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Issue Query"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
