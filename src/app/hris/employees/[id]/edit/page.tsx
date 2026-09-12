"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getEmployee, updateEmployee } from "@/lib/api/hris";
import type { GetEmployeeDetail, UpdateEmployeePayload } from "@/lib/api/types/hrisTypes";
import { ChevronDown } from "lucide-react";

type EditableForm = {
  phoneNumber: string;
  departmentId: string;
  position: string;
  workMode: UpdateEmployeePayload["workMode"] | "";
  earnings: string;
  address: string;
};

export default function EditEmployeePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const [employee, setEmployee] = useState<GetEmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [form, setForm] = useState<EditableForm>({
    phoneNumber: "",
    departmentId: "",
    position: "",
    workMode: "",
    earnings: "",
    address: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const detail = await getEmployee(params.id);
      setEmployee(detail);
      setForm({
        phoneNumber: detail.header.phoneNumber ?? "",
        departmentId: detail.header.department?.id ?? "",
        position: detail.header.role ?? "",
        workMode: "", // not present on header — only known post-populated personalInformation
        earnings: "",
        address: "",
      });
    } catch (error) {
      console.error("getEmployee failed:", error);
      setLoadError(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Couldn't load this employee."
          : "Couldn't load this employee.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const updateField = <K extends keyof EditableForm>(key: K, value: EditableForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload: UpdateEmployeePayload = {
        phoneNumber: form.phoneNumber || undefined,
        departmentId: form.departmentId || undefined,
        position: form.position || undefined,
        workMode: form.workMode || undefined,
        earnings: form.earnings ? Number(form.earnings) : undefined,
        address: form.address || undefined,
      };
      await updateEmployee(params.id, payload);
      router.push(`/hris/employees/${params.id}`);
    } catch (error) {
      console.error("updateEmployee failed:", error);
      setSubmitError(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Couldn't save changes. Please try again."
          : "Couldn't save changes. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-500">Loading employee…</div>;
  }

  if (loadError) {
    return (
      <div className="p-6">
        <p className="text-sm text-rose-600">{loadError}</p>
        <button onClick={load} className="mt-3 text-sm font-medium text-sky-600 hover:underline">
          Try again
        </button>
      </div>
    );
  }

  if (!employee) {
    return <div className="p-6 text-slate-500">Employee not found.</div>;
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <h1 className="text-4xl mb-8 font-bold text-slate-900">Edit Profile</h1>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-xl font-bold text-sky-600 overflow-hidden">
            {employee.header.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={employee.header.profileImage}
                alt={employee.header.name}
                className="h-full w-full object-cover"
              />
            ) : (
              employee.header.name.charAt(0)
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <InputField
              label="Phone Number"
              value={form.phoneNumber}
              onChange={(v) => updateField("phoneNumber", v)}
            />

            {/* departmentId has no picker source yet (no /hris/departments
               endpoint) — plain text field for the raw ID, same as the
               create form, until that's available. */}
            <InputField
              label="Department ID"
              value={form.departmentId}
              onChange={(v) => updateField("departmentId", v)}
            />

            <InputField
              label="Position"
              value={form.position}
              onChange={(v) => updateField("position", v)}
            />

            <SelectField
              label="Work mode"
              value={form.workMode ?? ""}
              options={["", "REMOTE", "HYBRID", "ONSITE"]}
              onChange={(v) => updateField("workMode", v as EditableForm["workMode"])}
            />

            <InputField
              label="Earnings (monthly)"
              type="number"
              value={form.earnings}
              onChange={(v) => updateField("earnings", v)}
            />
          </div>

          <InputField
            label="Address"
            value={form.address}
            onChange={(v) => updateField("address", v)}
          />

          {submitError && <p className="text-sm text-rose-600">{submitError}</p>}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <div className="flex flex-wrap gap-3 sm:justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-sky-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:opacity-50"
              >
                {submitting ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

function InputField({ label, value, onChange, type = "text" }: InputProps) {
  return (
    <div>
      <label className="mb-1 block text-xs text-gray-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-md border border-gray-200 px-3 text-sm outline-none transition focus:border-blue-500"
      />
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function SelectField({ label, value, options, onChange }: SelectProps) {
  return (
    <div>
      <label className="mb-1 block text-xs text-gray-400">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-md border border-gray-200 px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt || "Select"}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
      </div>
    </div>
  );
}