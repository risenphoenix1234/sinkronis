// app/payroll/payees/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import AddPayeeModal, {
  PayeeFormData,
} from "@/components/payroll/payee/AddPayeeModal";
import EditPayeeModal from "@/components/payroll/payee/EditPayeeModal";
import RemovePayeeModal from "@/components/payroll/payee/RemovePayeeModal";
import { naira, Payee } from "@/types/payroll/payee-data";
import { toast } from "react-toastify";
import {
  getPayees,
  exportPayeesCsv,
  PayeeListItem,
  PayeeApiType,
  PayeeApiStatus,
  PayeesSummary,
  PaginationMeta,
} from "@/lib/api/payroll";

const typeStyles: Record<PayeeApiType, string> = {
  DIRECTOR: "bg-[#f3e8ff] text-[#9333ea]",
  VENDOR: "bg-[#dbeafe] text-[#1d4ed8]",
  BOARD_MEMBER: "bg-[#fef3c7] text-[#a16207]",
  CONTRACTOR: "bg-[#dcfce7] text-[#15803d]",
};

const typeLabels: Record<PayeeApiType, string> = {
  DIRECTOR: "Director",
  VENDOR: "Vendor",
  BOARD_MEMBER: "Board Member",
  CONTRACTOR: "Contractor",
};

const statusStyles: Record<PayeeApiStatus, string> = {
  ACTIVE: "bg-[#dcfce7] text-[#15803d]",
  INACTIVE: "bg-[#f3f4f6] text-[#6b7280]",
};

const statusLabels: Record<PayeeApiStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export default function PayeesPage() {
  const router = useRouter();

  const [payees, setPayees] = useState<PayeeListItem[]>([]);
  const [summary, setSummary] = useState<PayeesSummary>({
    totalPayees: 0,
    activePayees: 0,
    monthlyTotal: 0,
  });
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Filters & query state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [typeFilter, setTypeFilter] = useState<PayeeApiType | "">("");
  const [statusFilter, setStatusFilter] = useState<PayeeApiStatus | "">("");
  const [taxableFilter, setTaxableFilter] = useState<"" | "true" | "false">("");
  const [sortBy, setSortBy] = useState<"name" | "type" | "amount" | "status">(
    "name",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  // Modals state
  const [addPayeeOpen, setAddPayeeOpen] = useState(false);
  const [editPayeeOpen, setEditPayeeOpen] = useState(false);
  const [editingPayee, setEditingPayee] = useState<PayeeListItem | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState<PayeeListItem | null>(
    null,
  );

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Fetch payees from live endpoint
  const fetchPayees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPayees({
        page,
        limit: 20,
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
        ...(typeFilter ? { type: typeFilter } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(taxableFilter !== "" ? { taxable: taxableFilter === "true" } : {}),
        sortBy,
        sortOrder,
      });
      setPayees(res.data.payees ?? []);
      setSummary(
        res.data.summary ?? {
          totalPayees: 0,
          activePayees: 0,
          monthlyTotal: 0,
        },
      );
      setPagination(res.pagination ?? null);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } };
      };
      setError(
        axiosErr?.response?.data?.message ||
        "Failed to load payees. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    page,
    debouncedSearch,
    typeFilter,
    statusFilter,
    taxableFilter,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchPayees();
  }, [fetchPayees]);

  const handleSort = (column: "name" | "type" | "amount" | "status") => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleAddPayee = (_data: PayeeFormData) => {
    setAddPayeeOpen(false);
    fetchPayees();
  };

  const closeRemoveModal = () => {
    setShowRemoveModal(false);
    setSelectedPayee(null);
  };

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const blob = await exportPayeesCsv({
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
        ...(typeFilter ? { type: typeFilter } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(taxableFilter !== "" ? { taxable: taxableFilter === "true" } : {}),
        sortBy,
        sortOrder,
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payees-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Payees exported successfully");
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } | string | Blob };
      };
      let msg = "Failed to export payees CSV. Please try again.";
      if (axiosErr?.response?.data instanceof Blob) {
        try {
          const text = await axiosErr.response.data.text();
          const parsed = JSON.parse(text);
          if (parsed?.message) msg = parsed.message;
        } catch {
          // ignore
        }
      } else if (
        typeof axiosErr?.response?.data === "object" &&
        axiosErr?.response?.data &&
        "message" in axiosErr.response.data
      ) {
        msg = (axiosErr.response.data as { message: string }).message || msg;
      }
      toast.error(msg);
    } finally {
      setExporting(false);
    }
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
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Download size={15} />
            )}
            {exporting ? "Exporting..." : "Export"}
          </button>

          <button
            type="button"
            onClick={() => setAddPayeeOpen(true)}
            className="flex items-center gap-2 rounded-md bg-[#1683d8] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0f74c2]"
          >
            <Plus size={15} />
            Add Payee
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-[#e5e7eb] bg-white px-5 py-4">
          <p className="text-xs text-[#6b7280]">Total Payees</p>
          <p className="mt-1 text-2xl font-bold text-[#1683d8]">
            {loading && summary.totalPayees === 0 ? "—" : summary.totalPayees}
          </p>
        </div>
        <div className="rounded-lg border border-[#e5e7eb] bg-white px-5 py-4">
          <p className="text-xs text-[#6b7280]">Active Payees</p>
          <p className="mt-1 text-2xl font-bold text-[#15803d]">
            {loading && summary.activePayees === 0 ? "—" : summary.activePayees}
          </p>
        </div>
        <div className="rounded-lg border border-[#e5e7eb] bg-white px-5 py-4">
          <p className="text-xs text-[#6b7280]">Monthly Total</p>
          <p className="mt-1 text-2xl font-bold text-[#9333ea]">
            {loading && summary.monthlyTotal === 0
              ? "—"
              : naira(summary.monthlyTotal)}
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email..."
          className="h-11 min-w-[240px] flex-1 rounded-md border border-[#e5e7eb] bg-white px-4 text-sm text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#1683d8]"
        />
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value as PayeeApiType | "");
            setPage(1);
          }}
          className="h-11 w-36 rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] outline-none focus:border-[#1683d8]"
        >
          <option value="">All Types</option>
          <option value="DIRECTOR">Director</option>
          <option value="VENDOR">Vendor</option>
          <option value="BOARD_MEMBER">Board Member</option>
          <option value="CONTRACTOR">Contractor</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as PayeeApiStatus | "");
            setPage(1);
          }}
          className="h-11 w-32 rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] outline-none focus:border-[#1683d8]"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <select
          value={taxableFilter}
          onChange={(e) => {
            setTaxableFilter(e.target.value as "" | "true" | "false");
            setPage(1);
          }}
          className="h-11 w-36 rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] outline-none focus:border-[#1683d8]"
        >
          <option value="">All</option>
          <option value="true">Taxable</option>
          <option value="false">Non-taxable</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-[#e5e7eb] bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-xs text-[#6b7280]">
              <th
                onClick={() => handleSort("name")}
                className="cursor-pointer select-none px-6 py-3 font-medium hover:text-[#1683d8]"
              >
                <span className="inline-flex items-center gap-1">
                  Payee
                  <ChevronUp
                    size={12}
                    className={`transition-transform ${sortBy === "name" && sortOrder === "desc"
                      ? "rotate-180"
                      : ""
                      } ${sortBy === "name" ? "text-[#1683d8]" : "text-gray-400"}`}
                  />
                </span>
              </th>
              <th
                onClick={() => handleSort("type")}
                className="cursor-pointer select-none px-6 py-3 font-medium hover:text-[#1683d8]"
              >
                <span className="inline-flex items-center gap-1">
                  Type
                  <ChevronUp
                    size={12}
                    className={`transition-transform ${sortBy === "type" && sortOrder === "desc"
                      ? "rotate-180"
                      : ""
                      } ${sortBy === "type" ? "text-[#1683d8]" : "text-gray-400"}`}
                  />
                </span>
              </th>
              <th
                onClick={() => handleSort("amount")}
                className="cursor-pointer select-none px-6 py-3 font-medium hover:text-[#1683d8]"
              >
                <span className="inline-flex items-center gap-1">
                  Amount
                  <ChevronUp
                    size={12}
                    className={`transition-transform ${sortBy === "amount" && sortOrder === "desc"
                      ? "rotate-180"
                      : ""
                      } ${sortBy === "amount" ? "text-[#1683d8]" : "text-gray-400"}`}
                  />
                </span>
              </th>
              <th
                onClick={() => handleSort("status")}
                className="cursor-pointer select-none px-6 py-3 font-medium hover:text-[#1683d8]"
              >
                <span className="inline-flex items-center gap-1">
                  Status
                  <ChevronUp
                    size={12}
                    className={`transition-transform ${sortBy === "status" && sortOrder === "desc"
                      ? "rotate-180"
                      : ""
                      } ${sortBy === "status" ? "text-[#1683d8]" : "text-gray-400"}`}
                  />
                </span>
              </th>
              <th className="px-6 py-3 font-medium">Bank</th>
              <th className="px-6 py-3 font-medium">Taxable</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-[#6b7280]">
                    <Loader2 size={16} className="animate-spin" />
                    Loading payees…
                  </div>
                </td>
              </tr>
            )}

            {!loading && payees.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-[#9ca3af]"
                >
                  No payees found.
                </td>
              </tr>
            )}

            {!loading &&
              payees.map((payee, index) => (
                <tr
                  key={payee.id}
                  className={`border-b border-[#f0f0f0] last:border-b-0 ${index % 2 === 1 ? "bg-[#f9fafb]" : "bg-white"
                    }`}
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#1f2937]">{payee.name}</p>
                    <p className="text-xs text-[#9ca3af]">
                      {payee.email || "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${typeStyles[payee.type] || "bg-[#f3f4f6] text-[#6b7280]"
                        }`}
                    >
                      {typeLabels[payee.type] || payee.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#1f2937]">
                    {naira(payee.monthlyAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[payee.status] ||
                        "bg-[#f3f4f6] text-[#6b7280]"
                        }`}
                    >
                      {statusLabels[payee.status] || payee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[#1f2937]">
                      {payee.bank?.bankName || "—"}
                    </p>
                    <p className="text-xs text-[#9ca3af]">
                      {payee.bank?.accountNumber || ""}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {payee.isTaxable ? (
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
                        type="button"
                        onClick={() =>
                          router.push(`/payroll/payees/${payee.id}`)
                        }
                        className="flex items-center gap-1 text-xs font-medium text-[#1683d8] hover:underline"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPayee(payee);
                          setEditPayeeOpen(true);
                        }}
                        className="flex items-center gap-1 text-xs font-medium text-[#667085] hover:text-[#1f2937]"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPayee(payee);
                          setShowRemoveModal(true);
                        }}
                        className="flex items-center gap-1 text-xs font-medium text-[#ff3b3b] hover:text-[#ed3030]"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-xs text-[#6b7280]">
          <span>
            Showing page {pagination.page} of {pagination.totalPages} (
            {pagination.total} total)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded border border-[#e5e7eb] bg-white px-3 py-1.5 font-medium text-[#374151] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border border-[#e5e7eb] bg-white px-3 py-1.5 font-medium text-[#374151] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <AddPayeeModal
        open={addPayeeOpen}
        onClose={() => setAddPayeeOpen(false)}
        onSuccess={() => {
          setAddPayeeOpen(false);
          fetchPayees();
        }}
      />
      <EditPayeeModal
        open={editPayeeOpen}
        payee={editingPayee}
        onClose={() => {
          setEditPayeeOpen(false);
          setEditingPayee(null);
        }}
        onSuccess={() => {
          setEditPayeeOpen(false);
          setEditingPayee(null);
          fetchPayees();
        }}
      />
      <RemovePayeeModal
        open={showRemoveModal}
        payee={selectedPayee}
        onCancel={closeRemoveModal}
        onSuccess={fetchPayees}
      />
    </div>
  );
}
