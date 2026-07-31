// src/app/tenant-admin/organisation/departments/page.tsx
"use client";

import { useMemo, useState } from "react";

type Department = {
  id: string;
  name: string;
  headOfDepartment: string;
  employees: number;
  dateCreated: string;
};

const departments: Department[] = [
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

export default function DepartmentsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.headOfDepartment.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <input
        type="text"
        placeholder="Search departments..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-72 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
      />

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
    </div>
  );
}