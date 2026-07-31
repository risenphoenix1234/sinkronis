// src/app/tenant-admin/organisation/branches-locations/page.tsx
"use client";

import { useState } from "react";

type Branch = {
  id: string;
  name: string;
  addressLine: string;
  cityLine: string;
};

const initialBranches: Branch[] = [
  {
    id: "branch-1",
    name: "Head Office",
    addressLine: "14 Adeola Odeku Street",
    cityLine: "Victoria Island, Lagos, Nigeria · +234 1 234 5678",
  },
  {
    id: "branch-2",
    name: "Abuja Branch",
    addressLine: "Plot 44 Gana Street",
    cityLine: "Maitama, Abuja, Nigeria · +234 9 876 5432",
  },
  {
    id: "branch-3",
    name: "Port Harcourt",
    addressLine: "12 Forces Avenue",
    cityLine: "Old GRA, Rivers, Nigeria · +234 84 123 456",
  },
];

export default function BranchesLocationsPage() {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);

  const handleDelete = (id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex justify-end">
        <button className="flex items-center gap-1.5 rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1c70ab]">
          <span className="text-base leading-none">+</span> Add Branch
        </button>
      </div>

      <div className="space-y-3">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className="flex items-start justify-between rounded-md border border-slate-100 px-4 py-3.5"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-slate-400">📍</span>
              <div>
                <p className="font-medium text-slate-800">{branch.name}</p>
                <p className="text-sm text-slate-500">{branch.addressLine}</p>
                <p className="text-sm text-slate-400">{branch.cityLine}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <button
                className="hover:text-sky-600"
                aria-label={`Edit ${branch.name}`}
              >
                ✎
              </button>
              <button
                className="hover:text-rose-600"
                aria-label={`Delete ${branch.name}`}
                onClick={() => handleDelete(branch.id)}
              >
                🗑
              </button>
            </div>
          </div>
        ))}

        {branches.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">
            No branches added yet.
          </p>
        )}
      </div>
    </div>
  );
}