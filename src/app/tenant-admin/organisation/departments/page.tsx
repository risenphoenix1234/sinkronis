// src/app/tenant-admin/organisation/departments/page.tsx
"use client";

import { useMemo, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

type Department = {
  id: string;
  name: string;
  headOfDepartment: string;
  employees: number;
  dateCreated: string;
};

const initialDepartments: Department[] = [
  {
    id: "dept-1",
    name: "Human Resources",
    headOfDepartment: "Amara Okafor",
    employees: 4,
    dateCreated: "15 Jan 2024",
  },
  {
    id: "dept-2",
    name: "Finance",
    headOfDepartment: "Chukwuemeka Adeyemi",
    employees: 6,
    dateCreated: "15 Jan 2024",
  },
  {
    id: "dept-3",
    name: "Operations",
    headOfDepartment: "Dapo Olawale",
    employees: 8,
    dateCreated: "15 Jan 2024",
  },
  {
    id: "dept-4",
    name: "IT & Technology",
    headOfDepartment: "Emeka Nwosu",
    employees: 5,
    dateCreated: "3 Feb 2024",
  },
  {
    id: "dept-5",
    name: "Sales & Marketing",
    headOfDepartment: "Ngozi Eze",
    employees: 7,
    dateCreated: "10 Feb 2024",
  },
  {
    id: "dept-6",
    name: "Legal",
    headOfDepartment: "Babajide Lawson",
    employees: 3,
    dateCreated: "1 Mar 2024",
  },
  {
    id: "dept-7",
    name: "Customer Support",
    headOfDepartment: "Adaeze Nwachukwu",
    employees: 5,
    dateCreated: "20 Mar 2024",
  },
];

const emptyForm = { name: "", headOfDepartment: "", employees: "" };

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.headOfDepartment.toLowerCase().includes(q)
    );
  }, [search, departments]);

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Department name is required.");
      return;
    }

    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name: form.name.trim(),
      headOfDepartment: form.headOfDepartment.trim() || "Unassigned",
      employees: Number(form.employees) || 0,
      dateCreated: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    setDepartments((prev) => [newDept, ...prev]);
    closeModal();
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        />

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-sky-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
        >
          <FiPlus size={16} strokeWidth={2.5} />
          Add Department
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Department Name</th>
              <th className="px-4 py-2.5 font-medium">Head of Department</th>
              <th className="px-4 py-2.5 font-medium">Employees</th>
              <th className="px-4 py-2.5 font-medium">Date Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((dept) => (
              <tr key={dept.id} className="border-b border-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {dept.name}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {dept.headOfDepartment}
                </td>
                <td className="px-4 py-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 text-xs font-semibold text-sky-600">
                    {dept.employees}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {dept.dateCreated}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-sm text-slate-400"
                >
                  No departments match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Department modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Add Department
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Department Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Product Design"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Head of Department
                </label>
                <input
                  type="text"
                  value={form.headOfDepartment}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, headOfDepartment: e.target.value }))
                  }
                  placeholder="e.g. Femi Adebayo"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Employees
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.employees}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, employees: e.target.value }))
                  }
                  placeholder="0"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
                >
                  Add Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}