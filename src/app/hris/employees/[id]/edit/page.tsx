"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { staticEmployees } from "@/data/hris/employees";
import { ChevronDown } from "lucide-react";

export default function EditEmployeePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const employee = staticEmployees.find((e) => e.id === params.id);

  const [form, setForm] = useState({
    email: employee?.email ?? "",
    code: "OO/CODEXX",
    department: employee?.department ?? "",
    position: employee?.position ?? "",
    workMode: employee?.workMode ?? "",
    role: employee?.role ?? "",
    salary: employee?.salary ?? "",
    guarantorLastName: employee?.guarantor.lastName ?? "",
    guarantorFirstName: employee?.guarantor.firstName ?? "",
    guarantorRelationship: employee?.guarantor.relationship ?? "",
    guarantorPhone: employee?.guarantor.phoneNumber ?? "",
    guarantorAddress: employee?.guarantor.address ?? "",
  });

  if (!employee)
    return <div className="p-6 text-slate-500">Employee not found.</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <h1 className="text-4xl mb-8 font-bold text-slate-900">
            Edit Profile
          </h1>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-xl font-bold text-sky-600">
            {employee.name.charAt(0)}
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <InputField
              label="Email"
              value="Silasjud20@gmail.com"
              type="email"
            />
            <InputField label="Phone Number" value="07023458765" />
            <SelectField label="Department" value="IT Department" />
            <InputField label="Position" value="IT Manager" />
            <SelectField label="Status" value="Confirmed" />
            <SelectField label="Marital Status" value="Single" />
            <SelectField label="Work mode" value="Remote" />
            <InputField label="Earnings" value="₦650,000" />
          </div>

          <InputField
            label="Address"
            value="123 Main Street, Cityville, ST 12345"
          />

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <div className="flex flex-wrap gap-3 sm:justify-end">
              <button
                type="button"
                className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Exit
              </button>

              <button
                type="submit"
                className="rounded-md bg-sky-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
              >
                Save
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
  type?: string;
}

function InputField({ label, value, type = "text" }: InputProps) {
  return (
    <div>
      <label className="mb-1 block text-xs text-gray-400">{label}</label>

      <input
        type={type}
        defaultValue={value}
        className="h-12 w-full rounded-md border border-gray-200 px-3 text-sm outline-none transition focus:border-blue-500"
      />
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
}

function SelectField({ label, value }: SelectProps) {
  return (
    <div>
      <label className="mb-1 block text-xs text-gray-400">{label}</label>

      <div className="flex h-12 cursor-pointer items-center justify-between rounded-md border border-gray-200 px-3">
        <span className="text-sm text-gray-700">{value}</span>

        <ChevronDown size={18} className="text-gray-500" />
      </div>
    </div>
  );
}
