"use client";


import EditClientModal from "@/components/modals/EditClientModal";
import { updateCustomer } from "@/lib/api/accounting";
import { UpdateCustomerPayload, Customer } from "@/lib/api/types/accounting.types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCustomerDetail } from "@/lib/api/accounting";
import { CustomerDetail } from "@/lib/api/types/accounting.types";

type Tab = "invoices" | "projects" | "payments";

function naira(value: number) {
  return `₦${value.toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const invoiceStatusStyles: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700",
  SENT: "bg-sky-50 text-sky-700",
  OVERDUE: "bg-rose-50 text-rose-700",
  DRAFT: "bg-slate-100 text-slate-600",
};

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("invoices");
  const [editOpen, setEditOpen] = useState(false);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomerDetail(params.id);
      setCustomer(res.data);
    } catch (err) {
      setError("Failed to load customer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [params.id]);

  const handleEdit = async (id: string, updates: UpdateCustomerPayload) => {
    try {
      await updateCustomer(id, updates);
      setEditOpen(false);
      await fetchCustomer();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update client.");
    }
  };

  if (loading) {
    return (
      <section className="p-6">
        <p className="text-sm text-slate-400">Loading customer...</p>
      </section>
    );
  }

  if (error || !customer) {
    return (
      <section className="p-6">
        <p className="text-sm text-red-500">{error ?? "Customer not found."}</p>
      </section>
    );
  }

  const { financialSummary, invoices, projects, paymentHistory } = customer;
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link
            href="/accounting/clients"
            className="mt-1 text-slate-400 hover:text-slate-600"
            aria-label="Back to clients"
          >
            ←
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-slate-900">{customer.companyName}</h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  customer.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                {customer.status === "ACTIVE" ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-slate-500">Customer Profile · {customer.customerId}</p>
          </div>
        </div>

       <button
  onClick={() => setEditOpen(true)}
  className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
>
  ✎ Edit Client
</button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-6 sm:grid-cols-[1fr_1fr_auto]">
          <div className="flex gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
              🏢
            </span>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Customer ID</p>
                <p className="font-medium text-slate-800">{customer.customerId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="font-medium text-slate-800">{customer.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Tax ID (TIN)</p>
                <p className="font-medium text-slate-800">{customer.taxId ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Customer Since</p>
                <p className="font-medium text-slate-800">{formatDate(customer.customerSince)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-slate-400">Contact Person</p>
              <p className="font-medium text-slate-800">{customer.contactPerson ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Phone</p>
              <p className="font-medium text-slate-800">{customer.phone ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Address</p>
              <p className="font-medium text-slate-800">{customer.address ?? "—"}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm sm:min-w-[160px]">
            <div className="flex items-center justify-between gap-6">
              <span className="text-slate-500">Total Billed</span>
              <span className="font-semibold text-slate-900">{naira(financialSummary.totalBilled)}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-slate-500">Total Paid</span>
              <span className="font-semibold text-emerald-600">{naira(financialSummary.totalPaid)}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-slate-500">Invoices</span>
              <span className="font-semibold text-slate-900">{financialSummary.invoiceCount}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-slate-500">Overdue</span>
              <span className="font-semibold text-slate-900">{financialSummary.overdueCount}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-slate-500">Projects</span>
              <span className="font-semibold text-slate-900">{financialSummary.projectCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="flex gap-6 border-b border-slate-100 px-5 text-sm">
          <button
            onClick={() => setActiveTab("invoices")}
            className={`-mb-px flex items-center gap-1.5 border-b-2 py-3 font-medium ${
              activeTab === "invoices" ? "border-sky-600 text-sky-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Invoices <span className="text-xs text-slate-400">{invoices.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`-mb-px flex items-center gap-1.5 border-b-2 py-3 font-medium ${
              activeTab === "projects" ? "border-sky-600 text-sky-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Projects <span className="text-xs text-slate-400">{projects.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`-mb-px flex items-center gap-1.5 border-b-2 py-3 font-medium ${
              activeTab === "payments" ? "border-sky-600 text-sky-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Payment History <span className="text-xs text-slate-400">{paymentHistory.length}</span>
          </button>
        </div>

        {activeTab === "invoices" && (
          <div className="overflow-x-auto p-5 pt-0">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-2.5 font-medium">Invoice ID</th>
                  <th className="py-2.5 font-medium">Project</th>
                  <th className="py-2.5 font-medium">Agent</th>
                  <th className="py-2.5 font-medium">Issue Date</th>
                  <th className="py-2.5 font-medium">Due Date</th>
                  <th className="py-2.5 font-medium">Total</th>
                  <th className="py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-sm text-slate-400">
                      No invoices yet.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="border-t border-slate-50">
                      <td className="py-2.5 text-sky-600">{inv.invoiceNumber}</td>
                      <td className="py-2.5">{inv.projectName ?? "—"}</td>
                      <td className="py-2.5">{inv.agentName ?? "—"}</td>
                      <td className="py-2.5">{formatDate(inv.issueDate)}</td>
                      <td className="py-2.5">{formatDate(inv.dueDate)}</td>
                      <td className="py-2.5">{naira(inv.total)}</td>
                      <td className="py-2.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${invoiceStatusStyles[inv.status]}`}>
                          {inv.status.charAt(0) + inv.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="p-5 pt-0">
            {projects.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">No projects yet.</p>
            ) : (
              <ul className="divide-y divide-slate-50 text-sm">
                {projects.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-2.5">
                    <span className="font-medium text-slate-800">{p.name}</span>
                    <span className="text-slate-500">{p.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "payments" && (
          <div className="p-5 pt-0">
            {paymentHistory.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">No payment history yet.</p>
            ) : (
              <ul className="divide-y divide-slate-50 text-sm">
                {paymentHistory.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="font-medium text-slate-800">{p.invoiceNumber}</p>
                      <p className="text-xs text-slate-400">{formatDate(p.paidAt)} · {p.method}</p>
                    </div>
                    <span className="font-semibold text-emerald-600">{naira(p.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <EditClientModal
  open={editOpen}
  client={customer as unknown as Customer}
  onClose={() => setEditOpen(false)}
  onSave={handleEdit}
/>
    </section>
  );
}