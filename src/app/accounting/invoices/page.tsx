// src/app/accounting/invoices/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import CreateInvoiceModal from "@/components/modals/CreateInvoiceModal";
import { getInvoices, createInvoice } from "@/lib/api/accounting";
import { CreateInvoicePayload, Invoice } from "@/lib/api/types/accounting.types";
import Loader from "@/components/ui/Loader";

const statusStyles: Record<string, string> = {
  PAID: "bg-[#D8F3DC] text-[#1B7A34]",
  SENT: "bg-[#E3F2FD] text-[#2183C6]",
  OVERDUE: "bg-[#FFE5E5] text-[#FF3B30]",
  DRAFT: "bg-[#F4F6F8] text-[#637381]",
};

function naira(value: number) {
  return `₦${value.toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const selectClass =
  "h-11 w-full rounded-md border border-[#F2F3F5] bg-white px-3 text-sm text-[#212B36] focus:border-[#2183C6] focus:outline-none";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const router = useRouter();

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInvoices();
      setInvoices(res.data.invoices);
    } catch (err) {
      setError("Failed to load invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreate = async (payload: CreateInvoicePayload) => {
    try {
      await createInvoice(payload);
      setModalOpen(false);
      await fetchInvoices();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create invoice.");
    }
  };

  const clientNames = useMemo(() => Array.from(new Set(invoices.map((i) => i.client.name))).sort(), [invoices]);
  const agentNames = useMemo(
    () => Array.from(new Set(invoices.map((i) => i.assignedAgent?.name).filter(Boolean) as string[])).sort(),
    [invoices],
  );
  const projectNames = useMemo(
    () => Array.from(new Set(invoices.map((i) => i.project?.name).filter(Boolean) as string[])).sort(),
    [invoices],
  );

  const filtered = invoices.filter((inv) => {
    const q = search.trim().toLowerCase();
    if (q && !inv.invoiceNo.toLowerCase().includes(q) && !inv.client.name.toLowerCase().includes(q)) return false;
    if (clientFilter && inv.client.name !== clientFilter) return false;
    if (agentFilter && inv.assignedAgent?.name !== agentFilter) return false;
    if (projectFilter && inv.project?.name !== projectFilter) return false;
    if (statusFilter && inv.status !== statusFilter) return false;
    const issued = inv.issueDate.slice(0, 10);
    if (fromDate && issued < fromDate) return false;
    if (toDate && issued > toDate) return false;
    return true;
  });

  return (
    <section className="min-h-[calc(100vh-5rem)] space-y-6 bg-[#F4F6F8] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#212B36]">Invoices</h1>
          <p className="mt-2 text-sm text-[#637381]">{invoices.length} invoices total</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="whitespace-nowrap rounded-md bg-[#2183C6] px-4 py-3 text-sm font-medium text-white hover:bg-[#1976B8]"
        >
          + Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto]">
        <div className="relative">
          <FiSearch size={16} className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[#919EAB]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID or client..."
            className="w-full border-b border-[#E5E8EB] bg-transparent py-2.5 pl-8 text-sm text-[#212B36] outline-none placeholder:text-[#919EAB] focus:border-[#2183C6]"
          />
        </div>
        <select className={selectClass} value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}>
          <option value="">All Client</option>
          {clientNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <select className={selectClass} value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}>
          <option value="">All Agents</option>
          {agentNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <select className={selectClass} value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
          <option value="">All Projects</option>
          {projectNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <select className={selectClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Sent</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            aria-label="From date"
            className={`${selectClass} w-36`}
          />
          <span className="text-xs text-[#919EAB]">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            aria-label="To date"
            className={`${selectClass} w-36`}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-[#F2F3F5] bg-white">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-dotted border-[#EBEEF0] text-[#637381] [&>th:first-child]:pl-4 [&>th:last-child]:pr-4">
              <th className="px-3 py-3.5 font-normal">Invoice</th>
              <th className="px-3 py-3.5 font-normal">Client</th>
              <th className="px-3 py-3.5 font-normal">Agent</th>
              <th className="px-3 py-3.5 font-normal">Project</th>
              <th className="px-3 py-3.5 font-normal">Subtotal</th>
              <th className="px-3 py-3.5 font-normal">VAT</th>
              <th className="px-3 py-3.5 font-normal">Total</th>
              <th className="px-3 py-3.5 font-normal">Issue Date</th>
              <th className="px-3 py-3.5 font-normal">Due Date</th>
              <th className="px-3 py-3.5 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-sm text-[#919EAB]">
                  <Loader variant="inline" label="Loading invoices" />
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-sm text-[#FF3B30]">{error}</td>
              </tr>
            )}

            {!loading &&
              !error &&
              filtered.map((inv) => (
                <tr
                  key={inv.id}
                  className="cursor-pointer text-[#212B36] even:bg-[#F2F2F7] hover:bg-[#EDF1F5] [&>td:first-child]:pl-4 [&>td:last-child]:pr-4"
                  onClick={() => router.push(`/accounting/invoices/${inv.id}`)}
                >
                  <td className="whitespace-nowrap px-3 py-3.5 font-medium text-[#2183C6]">{inv.invoiceNo}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 font-medium">{inv.client.name}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-[#637381]">{inv.assignedAgent?.name ?? "—"}</td>
                  <td className="max-w-[200px] truncate whitespace-nowrap px-3 py-3.5 text-[#637381]">{inv.project?.name ?? "—"}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 tabular-nums text-[#637381]">{naira(inv.subtotal)}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 tabular-nums text-[#637381]">{naira(inv.vat)}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 font-semibold tabular-nums">{naira(inv.total)}</td>
                  <td className="whitespace-nowrap px-3 py-3.5 text-[#637381]">{formatDate(inv.issueDate)}</td>
                  <td
                    className={`whitespace-nowrap px-3 py-3.5 ${
                      inv.status === "OVERDUE" ? "text-[#FF3B30]" : "text-[#637381]"
                    }`}
                  >
                    {formatDate(inv.dueDate)}
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${statusStyles[inv.status]}`}
                    >
                      {inv.status.charAt(0) + inv.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                </tr>
              ))}

            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-sm text-[#919EAB]">
                  {invoices.length === 0 ? "No invoices yet." : "No invoices match your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateInvoiceModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </section>
  );
}