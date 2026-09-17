<<<<<<< HEAD
// app/payroll/payees/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Plus, Eye, Pencil, Trash2, ChevronUp } from "lucide-react";
import AddPayeeModal, {
  PayeeFormData,
} from "@/components/payroll/payee/AddPayeeModal";
import RemovePayeeModal from "@/components/payroll/payee/RemovePayeeModal";
import {
  naira,
  Payee,
  PayeeStatus,
  PayeeType,
} from "@/types/payroll/payee-data";
import { usePayees } from "@/context/payroll/PayeeContext";

const typeStyles: Record<PayeeType, string> = {
  Director: "bg-[#f3e8ff] text-[#9333ea]",
  Vendor: "bg-[#dbeafe] text-[#1d4ed8]",
  "Board Member": "bg-[#fef3c7] text-[#a16207]",
  Contractor: "bg-[#dcfce7] text-[#15803d]",
};

const statusStyles: Record<PayeeStatus, string> = {
  Active: "bg-[#dcfce7] text-[#15803d]",
  Inactive: "bg-[#f3f4f6] text-[#6b7280]",
};

export default function PayeesPage() {
  const router = useRouter();

  const { payees, addPayee, deletePayee } = usePayees();

  const [search, setSearch] = useState("");
  const [addPayeeOpen, setAddPayeeOpen] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState<Payee | null>(null);

  const filtered = payees.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPayees = payees.length;
  const activePayees = payees.filter((p) => p.status === "Active").length;
  const monthlyTotal = payees
    .filter((p) => p.status === "Active")
    .reduce((sum, p) => sum + p.amount, 0);

  const handleAddPayee = (data: PayeeFormData) => {
    const newPayee: Payee = {
      id: crypto.randomUUID(),
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      type: data.type as PayeeType,
      amount: Number(data.monthlyAmount) || 0,
      status: data.status as PayeeStatus,
      bankName: data.bank,
      bankAccount: data.accountNumber,
      accountName: data.accountName,
      taxable: data.subjectToPaye,
      paymentHistory: [],
    };
    addPayee(newPayee);

    setAddPayeeOpen(false);
  };

  const openRemoveModal = (payee: Payee) => {
    setSelectedPayee(payee);
    setShowRemoveModal(true);
  };

  const closeRemoveModal = () => {
    setShowRemoveModal(false);
    setSelectedPayee(null);
  };

  const handleRemove = () => {
    if (!selectedPayee) return;

    deletePayee(selectedPayee.id);

    closeRemoveModal();
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1f2937]">Payees</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Manage non-employee payees — contractors, vendors, directors, and
            board members.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">
            <Download size={15} />
            Export
          </button>

          <button
            onClick={() => setAddPayeeOpen(true)}
            className="flex items-center gap-2 rounded-md bg-[#1683d8] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0f74c2]"
          >
            <Plus size={15} />
            Add Payee
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-[#e5e7eb] bg-white px-5 py-4">
          <p className="text-xs text-[#6b7280]">Total Payees</p>
          <p className="mt-1 text-2xl font-bold text-[#1683d8]">
            {totalPayees}
          </p>
        </div>
        <div className="rounded-lg border border-[#e5e7eb] bg-white px-5 py-4">
          <p className="text-xs text-[#6b7280]">Active Payees</p>
          <p className="mt-1 text-2xl font-bold text-[#15803d]">
            {activePayees}
          </p>
        </div>
        <div className="rounded-lg border border-[#e5e7eb] bg-white px-5 py-4">
          <p className="text-xs text-[#6b7280]">Monthly Total</p>
          <p className="mt-1 text-2xl font-bold text-[#9333ea]">
            {naira(monthlyTotal)}
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="mt-6 flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email..."
          className="h-11 flex-1 rounded-md border border-[#e5e7eb] bg-white px-4 text-sm text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#1683d8]"
        />
        <select className="h-11 w-32 rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] outline-none focus:border-[#1683d8]">
          <option>Type</option>
          <option>Director</option>
          <option>Vendor</option>
          <option>Board Member</option>
          <option>Contractor</option>
        </select>
        <select className="h-11 w-32 rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] outline-none focus:border-[#1683d8]">
          <option>Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <select className="h-11 w-32 rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] outline-none focus:border-[#1683d8]">
          <option>Taxable</option>
          <option>Taxable</option>
          <option>Non-taxable</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-[#e5e7eb] bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-xs text-[#6b7280]">
              <th className="px-6 py-3 font-medium">
                <span className="inline-flex items-center gap-1">
                  Payee <ChevronUp size={12} />
                </span>
              </th>
              <th className="px-6 py-3 font-medium">
                <span className="inline-flex items-center gap-1">
                  Type <ChevronUp size={12} />
                </span>
              </th>
              <th className="px-6 py-3 font-medium">
                <span className="inline-flex items-center gap-1">
                  Amount <ChevronUp size={12} />
                </span>
              </th>
              <th className="px-6 py-3 font-medium">
                <span className="inline-flex items-center gap-1">
                  Status <ChevronUp size={12} />
                </span>
              </th>
              <th className="px-6 py-3 font-medium">Bank</th>
              <th className="px-6 py-3 font-medium">Taxable</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-[#9ca3af]"
                >
                  No payees found.
                </td>
              </tr>
            ) : (
              filtered.map((payee, index) => (
                <tr
                  key={payee.id}
                  className={`border-b border-[#f0f0f0] last:border-b-0 ${
                    index % 2 === 1 ? "bg-[#f9fafb]" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#1f2937]">{payee.name}</p>
                    <p className="text-xs text-[#9ca3af]">{payee.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${typeStyles[payee.type]}`}
                    >
                      {payee.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#1f2937]">
                    {naira(payee.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[payee.status]}`}
                    >
                      {payee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[#1f2937]">{payee.bankName}</p>
                    <p className="text-xs text-[#9ca3af]">
                      {payee.bankAccount}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {payee.taxable ? (
                      <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-medium text-[#a16207]">
                        Taxable
                      </span>
                    ) : (
                      <span className="text-xs text-[#9ca3af]">
                        Non-taxable
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          router.push(`/payroll/payees/${payee.id}`)
                        }
                        className="flex items-center gap-1 text-xs font-medium text-[#1683d8] hover:underline"
                      >
                        <Eye size={13} />
                        View
                      </button>
                      <button className="text-[#9ca3af] hover:text-[#1683d8]">
                        <Pencil size={14} />
                      </button>
                      {/* <button
                        type="button"
                        onClick={() => deletePayee(payee.id)}
                        className="text-[#9ca3af] hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button> */}
                      <button
                        onClick={() => openRemoveModal(payee)}
                        className="flex h-7 w-7 items-center justify-center
                rounded-[4px] bg-[#f1f4f7] text-[#697586]
                hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddPayeeModal
        open={addPayeeOpen}
        onClose={() => setAddPayeeOpen(false)}
        onSubmit={handleAddPayee}
      />
      <RemovePayeeModal
        open={showRemoveModal}
        payee={selectedPayee}
        onCancel={closeRemoveModal}
        onRemove={handleRemove}
      />
    </div>
=======
// src/app/payroll/payees/page.tsx
export default function PayrollPayeesPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Payees</h1>
      <p className="text-sm text-slate-500">
        Static list of employees and other payees.
      </p>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Bank</th>
              <th className="px-4 py-2">Account</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">Bisi Adeyemi</td>
              <td className="px-4 py-2">Employee</td>
              <td className="px-4 py-2">GTBank</td>
              <td className="px-4 py-2">0123456789</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">XYZ Consulting</td>
              <td className="px-4 py-2">Contractor</td>
              <td className="px-4 py-2">Access Bank</td>
              <td className="px-4 py-2">9876543210</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
>>>>>>> origin/platform-admin
  );
}
