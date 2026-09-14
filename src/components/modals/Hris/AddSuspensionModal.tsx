"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FormField } from "../../hris/conduct/FormField";
import { createSuspension } from "@/lib/api/hris";

type AddSuspensionModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

type FormData = {
  employeeId: string;
  queryType: string;
  durationValue: string;
  durationUnit: string;
  notes: string;
};

const SUSPENSION_TYPES = [
  { value: "GROSS_MISCONDUCT", label: "Gross Misconduct" },
  { value: "PERFORMANCE_RELATED", label: "Performance Related" },
  { value: "ATTENDANCE", label: "Attendance" },
  { value: "INSUBORDINATION", label: "Insubordination" },
];

const DURATION_UNITS = [
  { value: "DAY", label: "Day" },
  { value: "WEEK", label: "Week" },
  { value: "MONTH", label: "Month" },
];

// IMPORTANT: every field that backs a controlled <select> must default to a
// value that actually exists in that select's options. If it doesn't, the
// <select> will *visually* fall back to showing its first option while the
// React state silently stays at "" (since no onChange ever fires unless the
// user touches it) — and that's the "" you end up submitting to the API.
const initialFormData: FormData = {
  employeeId: "",
  queryType: SUSPENSION_TYPES[0].value, // was hardcoded "ATTENDANCE" — now guaranteed valid
  durationValue: "",
  durationUnit: DURATION_UNITS[0].value, // was "" — this was the actual bug
  notes: "",
};

const inputClassName =
  "h-11 w-full rounded-md border border-[#D9DEE7] bg-white px-3 text-sm text-[#344054] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2388D0] focus:ring-1 focus:ring-[#2388D0]";

export default function AddSuspensionModal({
  open,
  onClose,
  onSuccess,
}: AddSuspensionModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Defensive guard: never let an empty enum value reach the API, even if
    // some future change reintroduces a blank initial/edit state.
    const queryType = formData.queryType || SUSPENSION_TYPES[0].value;
    const durationUnit = formData.durationUnit || DURATION_UNITS[0].value;

    if (!SUSPENSION_TYPES.some((t) => t.value === queryType)) {
      toast.error("Please select a valid suspension type");
      return;
    }
    if (!DURATION_UNITS.some((u) => u.value === durationUnit)) {
      toast.error("Please select a valid duration unit");
      return;
    }

    setSubmitting(true);
    try {
      await createSuspension({
        employeeId: formData.employeeId,
        queryType,
        durationValue: Number(formData.durationValue),
        durationUnit,
        notes: formData.notes,
      });
      toast.success("Suspension created successfully");
      setFormData(initialFormData);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(msg ?? "Failed to create suspension");
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
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-8 sm:py-8 lg:px-10">
            <h1 className="text-2xl font-bold leading-tight text-[#1F2937] sm:text-3xl">
              New Suspension
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
                  placeholder="e.g. EMP-001"
                  required
                  className={inputClassName}
                />
              </FormField>

              {/* Suspension Type */}
              <FormField label="Suspension Type">
                <select
                  name="queryType"
                  value={formData.queryType}
                  onChange={handleChange}
                  required
                  className={`${inputClassName} cursor-pointer appearance-auto`}
                >
                  {SUSPENSION_TYPES.map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Duration Value */}
              <FormField label="Duration">
                <input
                  type="number"
                  name="durationValue"
                  value={formData.durationValue}
                  onChange={handleChange}
                  min={1}
                  required
                  className={inputClassName}
                />
              </FormField>

              {/* Duration Unit */}
              <FormField label="Duration Unit">
                <select
                  name="durationUnit"
                  value={formData.durationUnit}
                  onChange={handleChange}
                  required
                  className={`${inputClassName} cursor-pointer appearance-auto`}
                >
                  {DURATION_UNITS.map((du) => (
                    <option key={du.value} value={du.value}>
                      {du.label}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Notes */}
              <div className="sm:col-span-2">
                <FormField label="Notes">
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Describe the reason for suspension..."
                    required
                    rows={4}
                    className={`${inputClassName} h-auto py-2 resize-none`}
                  />
                </FormField>
              </div>
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
              {submitting ? "Saving…" : "Create Suspension"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
