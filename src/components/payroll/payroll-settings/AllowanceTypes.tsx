"use client";

import { useState } from "react";

type Allowance = {
  id: number;
  name: string;
  taxTreatment: "Taxable" | "Tax-exempt";
};

const initialAllowances: Allowance[] = [
  {
    id: 1,
    name: "Basic Salary",
    taxTreatment: "Taxable",
  },
  {
    id: 2,
    name: "Housing Allowance",
    taxTreatment: "Tax-exempt",
  },
  {
    id: 3,
    name: "Transport Allowance",
    taxTreatment: "Tax-exempt",
  },
  {
    id: 4,
    name: "Medical Allowance",
    taxTreatment: "Tax-exempt",
  },
  {
    id: 5,
    name: "Responsibility Allowance",
    taxTreatment: "Taxable",
  },
  {
    id: 6,
    name: "Commission Allowance",
    taxTreatment: "Taxable",
  },
  {
    id: 7,
    name: "Bar Practice Allowance",
    taxTreatment: "Tax-exempt",
  },
];

export default function AllowanceTypes() {
  const [allowances, setAllowances] = useState<Allowance[]>(initialAllowances);

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [taxTreatment, setTaxTreatment] =
    useState<Allowance["taxTreatment"]>("Taxable");

  const handleAddAllowance = () => {
    if (!name.trim()) return;

    const newAllowance: Allowance = {
      id: Date.now(),
      name: name.trim(),
      taxTreatment,
    };

    setAllowances((current) => [...current, newAllowance]);

    setName("");
    setTaxTreatment("Taxable");
    setShowAddForm(false);
  };

  const handleDelete = (id: number) => {
    setAllowances((current) =>
      current.filter((allowance) => allowance.id !== id),
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold leading-7 text-[#25384b]">
            Allowance Types
          </h1>

          <p className="mt-1 text-sm leading-5 text-[#8091a1]">
            Define the types of allowances employees can receive and their tax
            treatment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex h-9 items-center gap-2 rounded-md bg-[#2189cb] px-4 text-sm font-medium text-white transition hover:bg-[#197dbd]"
        >
          <span className="text-base leading-none">+</span>
          Add Type
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="mt-5 rounded-md border border-[#e1e6ea] bg-white p-5">
          <h2 className="text-base font-semibold text-[#25384b]">
            Add Allowance Type
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#8191a1]">
                Allowance Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Housing Allowance"
                className="h-10 w-full rounded-md border border-[#dce3e8] px-3 text-sm text-[#45596c] outline-none placeholder:text-[#a7b2bc] focus:border-[#2189cb] focus:ring-2 focus:ring-[#2189cb]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#8191a1]">
                Tax Treatment
              </label>

              <select
                value={taxTreatment}
                onChange={(e) =>
                  setTaxTreatment(e.target.value as Allowance["taxTreatment"])
                }
                className="h-10 w-full rounded-md border border-[#dce3e8] bg-white px-3 text-sm text-[#45596c] outline-none focus:border-[#2189cb] focus:ring-2 focus:ring-[#2189cb]/10"
              >
                <option value="Taxable">Taxable</option>
                <option value="Tax-exempt">Tax-exempt</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleAddAllowance}
              className="rounded-md bg-[#2189cb] px-4 py-2 text-sm font-medium text-white hover:bg-[#197dbd]"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-md border border-[#dce3e8] bg-white px-4 py-2 text-sm font-medium text-[#53677a] hover:bg-[#f5f7f8]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="mt-5 overflow-hidden rounded-md border border-[#e1e6ea] bg-white">
        {/* Table header */}
        <div className="grid grid-cols-[1.4fr_1fr_80px] h-[34px] items-center border-b border-[#e5e8eb] px-4">
          <div className="text-sm font-medium text-[#8191a1]">
            Allowance Name
          </div>

          <div className="text-sm font-medium text-[#8191a1]">
            Tax Treatment
          </div>

          <div className="text-sm font-medium text-[#8191a1]">Action</div>
        </div>

        {/* Rows */}
        {allowances.map((allowance, index) => (
          <div
            key={allowance.id}
            className={`grid h-[43px] grid-cols-[1.4fr_1fr_80px] items-center px-4 ${
              index % 2 === 0 ? "bg-white" : "bg-[#f1f2f6]"
            }`}
          >
            <div className="text-sm font-medium text-[#29394a]">
              {allowance.name}
            </div>

            <div>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                  allowance.taxTreatment === "Taxable"
                    ? "bg-[#fff1c9] text-[#a67800]"
                    : "bg-[#d5f3df] text-[#218447]"
                }`}
              >
                {allowance.taxTreatment}
              </span>
            </div>

            <div>
              <button
                type="button"
                onClick={() => handleDelete(allowance.id)}
                aria-label={`Delete ${allowance.name}`}
                className="text-sm font-medium text-[#94a5b4] transition hover:text-[#d9534f]"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
