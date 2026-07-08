"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { staticEmployees } from "@/data/hris/employees";

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
    <section className="space-y-6 p-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-slate-500 hover:text-sky-600"
      >
        ← Back
      </button>

      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-xl font-bold text-sky-600">
          {employee.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Edit Profile</h1>
          <p className="text-sm text-slate-500">{employee.email}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-5 text-base font-semibold text-slate-800">
          Professional Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Code</label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Department
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            >
              <option>HR Department</option>
              <option>IT Department</option>
              <option>Finance Department</option>
              <option>Marketing Department</option>
              <option>Service Department</option>
              <option>Specialist Department</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Position
            </label>
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Work Mode
            </label>
            <select
              name="workMode"
              value={form.workMode}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            >
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">Role</label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Earnings
            </label>
            <input
              name="salary"
              value={form.salary}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>
        </div>

        <h3 className="mt-6 mb-4 text-sm font-semibold text-slate-700">
          Guarantor Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Last Name
            </label>
            <input
              name="guarantorLastName"
              value={form.guarantorLastName}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              First Name
            </label>
            <input
              name="guarantorFirstName"
              value={form.guarantorFirstName}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Relationship
            </label>
            <input
              name="guarantorRelationship"
              value={form.guarantorRelationship}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-600">
              Phone Number
            </label>
            <input
              name="guarantorPhone"
              value={form.guarantorPhone}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-sm text-slate-600">Address</label>
            <input
              name="guarantorAddress"
              value={form.guarantorAddress}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-md border border-slate-200 px-5 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => router.back()}
            className="rounded-md border border-slate-200 px-5 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Exit
          </button>
          <button className="rounded-md bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700">
            Save
          </button>
        </div>
      </div>
    </section>
  );
}
