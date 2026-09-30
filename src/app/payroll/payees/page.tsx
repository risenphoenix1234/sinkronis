// src/app/payroll/payees/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Plus,
  Pencil,
  Trash2,
  Search,
  UploadCloud,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { usePayees } from "@/context/payroll/PayeeContext";
import {
  UnifiedPayee,
  PayeeStatus,
  formatNaira,
} from "@/types/payroll/unified-payee";
import AddPayeeModal from "@/components/payroll/payee/AddPayeeModal";
import BulkUploadPayeeModal from "@/components/payroll/payee/BulkUploadPayeeModal";
import RemovePayeeModal from "@/components/payroll/payee/RemovePayeeModal";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import StatCard from "@/components/ui/StatCard";
import { Table, T, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { toast } from "react-toastify";

// Pill badges styling matching screenshot design
const typeStyles: Record<string, string> = {
  Permanent: "bg-[#e0f2fe] text-[#0284c7]",
  Employee: "bg-[#e0f2fe] text-[#0284c7]",
  Contract: "bg-[#dcfce7] text-[#15803d]",
  Contractor: "bg-[#dcfce7] text-[#15803d]",
  Consultant: "bg-[#f3e8ff] text-[#9333ea]",
  Director: "bg-[#f3e8ff] text-[#9333ea]",
  Vendor: "bg-[#dbeafe] text-[#1d4ed8]",
  "Board Member": "bg-[#fef3c7] text-[#a16207]",
};

const statusStyles: Record<PayeeStatus, string> = {
  Active: "bg-[#dcfce7] text-[#15803d]",
  Inactive: "bg-[#f3f4f6] text-[#6b7280]",
  "On Leave": "bg-[#fef3c7] text-[#a16207]",
  Suspended: "bg-[#fee2e2] text-[#b91c1c]",
};

export default function PayeesPage() {
  const router = useRouter();
  const { payees, addPayee, deletePayee, toggleOnPayroll, resetToDefault } =
    usePayees();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "Permanent" | "Contract" | "Consultant">("ALL");
  const [statusFilter, setStatusFilter] = useState<PayeeStatus | "ALL">("ALL");
  const [payrollFilter, setPayrollFilter] = useState<"ALL" | "ON_PAYROLL" | "OFF_PAYROLL">("ALL");
  const [taxFilter, setTaxFilter] = useState<"ALL" | "PAYE" | "WHT" | "None">("ALL");
  const [sortBy, setSortBy] = useState<"name" | "type" | "gross" | "net" | "date">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [selectedPayeeForRemove, setSelectedPayeeForRemove] = useState<UnifiedPayee | null>(null);

  // Filtered & sorted payees
  const filteredPayees = useMemo(() => {
    return payees
      .filter((p) => {
        const matchesSearch =
          search.trim() === "" ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.email.toLowerCase().includes(search.toLowerCase()) ||
          p.role.toLowerCase().includes(search.toLowerCase()) ||
          p.bankName.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toLowerCase().includes(search.toLowerCase());

        const matchesType =
          typeFilter === "ALL" ||
          p.type === typeFilter ||
          (typeFilter === "Permanent" && p.type === "Employee") ||
          (typeFilter === "Contract" && (p.type === "Contractor" || p.type === "Vendor")) ||
          (typeFilter === "Consultant" && (p.type === "Director" || p.type === "Board Member"));

        const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
        const matchesPayroll =
          payrollFilter === "ALL" ||
          (payrollFilter === "ON_PAYROLL" ? p.onPayroll : !p.onPayroll);

        const currentTax = p.taxStatus || "PAYE";
        const matchesTax =
          taxFilter === "ALL" ||
          (taxFilter === "None" ? currentTax === "None" || currentTax === "EXEMPT" : currentTax === taxFilter);

        return matchesSearch && matchesType && matchesStatus && matchesPayroll && matchesTax;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === "name") comp = a.name.localeCompare(b.name);
        else if (sortBy === "type") comp = a.type.localeCompare(b.type);
        else if (sortBy === "gross") comp = a.grossSalary - b.grossSalary;
        else if (sortBy === "net") comp = a.netSalary - b.netSalary;
        else if (sortBy === "date") {
          const dateA = a.dateOnboarded || a.joinDate || "";
          const dateB = b.dateOnboarded || b.joinDate || "";
          comp = dateA.localeCompare(dateB);
        }

        return sortOrder === "asc" ? comp : -comp;
      });
  }, [payees, search, typeFilter, statusFilter, payrollFilter, taxFilter, sortBy, sortOrder]);

  // Overall metrics calculation
  const metrics = useMemo(() => {
    const totalCount = payees.length;
    const activeCount = payees.filter((p) => p.status === "Active").length;
    const onPayrollCount = payees.filter((p) => p.onPayroll).length;
    const totalGross = payees.reduce((acc, p) => acc + (p.grossSalary || (p as any).amount || 0), 0);
    const totalNet = payees.reduce((acc, p) => acc + (p.netSalary || (p as any).amount || 0), 0);

    const permanentCount = payees.filter(
      (p) => p.type === "Permanent" || p.type === "Employee",
    ).length;
    const contractCount = payees.filter(
      (p) => p.type === "Contract" || p.type === "Contractor" || p.type === "Vendor",
    ).length;
    const consultantCount = payees.filter(
      (p) => p.type === "Consultant" || p.type === "Director" || p.type === "Board Member",
    ).length;

    return {
      totalCount,
      activeCount,
      onPayrollCount,
      totalGross,
      totalNet,
      permanentCount,
      contractCount,
      consultantCount,
    };
  }, [payees]);

  // Sorting handler
  const handleSort = (field: "name" | "type" | "gross" | "net" | "date") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Add payee handler
  const handleAddPayee = (newPayee: UnifiedPayee) => {
    addPayee(newPayee);
    toast.success(`${newPayee.name} has been enrolled successfully!`);
    setAddModalOpen(false);
  };

  // Delete modal open handler
  const openRemoveModal = (payee: UnifiedPayee) => {
    setSelectedPayeeForRemove(payee);
    setRemoveModalOpen(true);
  };

  // Confirm delete handler
  const handleConfirmRemove = () => {
    if (selectedPayeeForRemove) {
      deletePayee(selectedPayeeForRemove.id);
      toast.success(`${selectedPayeeForRemove.name} was removed from payees.`);
      setSelectedPayeeForRemove(null);
      setRemoveModalOpen(false);
    }
  };

  // Export full table to CSV
  const handleExportCSV = () => {
    if (filteredPayees.length === 0) {
      toast.info("No records to export.");
      return;
    }

    const headers = [
      "Payee ID",
      "Name",
      "Classification",
      "Role",
      "Date Onboarded",
      "Tax Status",
      "Status",
      "On Payroll",
      "Monthly Gross",
      "Net Payout",
      "Bank",
      "Account Number",
    ];

    const rows = filteredPayees.map((p) => [
      `"${p.id}"`,
      `"${p.name}"`,
      `"${p.type}"`,
      `"${p.role}"`,
      `"${p.dateOnboarded || p.joinDate || "N/A"}"`,
      `"${p.taxStatus || "PAYE"}"`,
      `"${p.status}"`,
      p.onPayroll ? "Yes" : "No",
      p.grossSalary,
      p.netSalary,
      `"${p.bankName}"`,
      `"${p.bankAccount}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `payees-directory-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Payees directory exported to CSV!");
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-6 space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1f2937]">Payees</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Manage non-employee payees — contractors, vendors, directors, and board members.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
            className="gap-1.5 text-xs text-[#64748b]"
            title="Reset to default seed payees"
          >
            <RotateCcw size={13} />
            Reset Data
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2 text-sm text-[#374151]"
          >
            <Download size={15} />
            Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setBulkModalOpen(true)}
            className="gap-2 text-sm text-[#374151]"
          >
            <UploadCloud size={15} />
            Bulk Upload
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            className="gap-2 text-sm bg-[#2183c6] text-white hover:bg-[#1b6aa2] shadow-sm"
          >
            <Plus size={15} />
            Add Payee
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards — Powered by Reusable StatCard Component */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="Total Payees"
          value={metrics.totalCount}
          valueColor="text-[#2183c6]"
          subtext={`${metrics.activeCount} active`}
        />
        <StatCard
          label="Permanent Staff"
          value={metrics.permanentCount}
          valueColor="text-[#0284c7]"
          subtext="PAYE & Statutory"
        />
        <StatCard
          label="Contractors"
          value={metrics.contractCount}
          valueColor="text-[#15803d]"
          subtext="5% WHT Deducted"
        />
        <StatCard
          label="Consultants"
          value={metrics.consultantCount}
          valueColor="text-[#9333ea]"
          subtext="Tax Exempt (0%)"
        />
        <StatCard
          label="On Active Payroll"
          value={metrics.onPayrollCount}
          valueColor="text-[#15803d]"
          subtext="Ready for pay runs"
        />
        <StatCard
          label="Monthly Outflow"
          value={formatNaira(metrics.totalNet)}
          valueColor="text-[#1f2937]"
          subtext="Total net take-home"
        />
      </div>

      {/* Filter and Search Bar — Clean White Card with Rounded Controls */}
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Classification Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setTypeFilter("ALL")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                typeFilter === "ALL"
                  ? "bg-[#2183c6] text-white shadow-sm"
                  : "bg-[#f8fafc] text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
              }`}
            >
              All Types ({metrics.totalCount})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("Permanent")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                typeFilter === "Permanent"
                  ? "bg-[#2183c6] text-white shadow-sm"
                  : "bg-[#f8fafc] text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
              }`}
            >
              Permanent ({metrics.permanentCount})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("Contract")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                typeFilter === "Contract"
                  ? "bg-[#2183c6] text-white shadow-sm"
                  : "bg-[#f8fafc] text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
              }`}
            >
              Contract ({metrics.contractCount})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("Consultant")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                typeFilter === "Consultant"
                  ? "bg-[#2183c6] text-white shadow-sm"
                  : "bg-[#f8fafc] text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
              }`}
            >
              Consultant ({metrics.consultantCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-80 relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, role, email, or bank..."
              className="h-10 w-full rounded-md border border-[#e5e7eb] bg-white pl-9 pr-3 text-sm text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#2183c6] transition"
            />
          </div>
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#f1f5f9] text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#64748b]">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-9 rounded-md border border-[#e5e7eb] bg-white px-2.5 text-xs text-[#374151] outline-none focus:border-[#2183c6] transition"
              >
                <option value="ALL">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#64748b]">Tax Regime:</span>
              <select
                value={taxFilter}
                onChange={(e) => setTaxFilter(e.target.value as any)}
                className="h-9 rounded-md border border-[#e5e7eb] bg-white px-2.5 text-xs text-[#374151] outline-none focus:border-[#2183c6] transition"
              >
                <option value="ALL">All Tax Regimes</option>
                <option value="PAYE">PAYE (PIT Act)</option>
                <option value="WHT">WHT (5% Withholding)</option>
                <option value="None">Tax Exempt (0%)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#64748b]">Payroll:</span>
              <select
                value={payrollFilter}
                onChange={(e) => setPayrollFilter(e.target.value as any)}
                className="h-9 rounded-md border border-[#e5e7eb] bg-white px-2.5 text-xs text-[#374151] outline-none focus:border-[#2183c6] transition"
              >
                <option value="ALL">All Payees</option>
                <option value="ON_PAYROLL">Included on Payroll</option>
                <option value="OFF_PAYROLL">Excluded from Payroll</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#64748b]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 rounded-md border border-[#e5e7eb] bg-white px-2.5 text-xs text-[#374151] outline-none focus:border-[#2183c6] transition"
            >
              <option value="name">Name</option>
              <option value="type">Classification</option>
              <option value="gross">Monthly Gross</option>
              <option value="net">Net Payout</option>
              <option value="date">Date Onboarded</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
              className="p-2 rounded-md border border-[#e5e7eb] text-[#64748b] hover:bg-[#f8fafc] transition"
              title={`Sorting ${sortOrder.toUpperCase()}`}
            >
              {sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Payees Table — Powered by Reusable Table Primitives */}
      <Table>
        <T className="min-w-[950px]">
          <THead>
            <tr>
              <TH
                onClick={() => handleSort("name")}
                className="cursor-pointer select-none"
              >
                <span className="inline-flex items-center gap-1">
                  Payee & Role{" "}
                  {sortBy === "name" && sortOrder === "desc" ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronUp size={12} className={sortBy === "name" ? "opacity-100" : "opacity-40"} />
                  )}
                </span>
              </TH>
              <TH
                onClick={() => handleSort("type")}
                className="cursor-pointer select-none"
              >
                <span className="inline-flex items-center gap-1">
                  Classification{" "}
                  {sortBy === "type" && sortOrder === "desc" ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronUp size={12} className={sortBy === "type" ? "opacity-100" : "opacity-40"} />
                  )}
                </span>
              </TH>
              <TH
                onClick={() => handleSort("date")}
                className="cursor-pointer select-none"
              >
                <span className="inline-flex items-center gap-1">
                  Date Onboarded{" "}
                  {sortBy === "date" && sortOrder === "desc" ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronUp size={12} className={sortBy === "date" ? "opacity-100" : "opacity-40"} />
                  )}
                </span>
              </TH>
              <TH>Tax Regime</TH>
              <TH
                onClick={() => handleSort("gross")}
                className="text-right cursor-pointer select-none"
              >
                <span className="inline-flex items-center justify-end gap-1">
                  Monthly Gross{" "}
                  {sortBy === "gross" && sortOrder === "desc" ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronUp size={12} className={sortBy === "gross" ? "opacity-100" : "opacity-40"} />
                  )}
                </span>
              </TH>
              <TH
                onClick={() => handleSort("net")}
                className="text-right cursor-pointer select-none"
              >
                <span className="inline-flex items-center justify-end gap-1">
                  Net Payout{" "}
                  {sortBy === "net" && sortOrder === "desc" ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronUp size={12} className={sortBy === "net" ? "opacity-100" : "opacity-40"} />
                  )}
                </span>
              </TH>
              <TH className="text-center">On Payroll</TH>
              <TH className="text-center">Status</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </THead>
          <TBody>
            {filteredPayees.length === 0 ? (
              <tr>
                <TD
                  colSpan={9}
                  className="py-12 text-center text-sm text-[#9ca3af]"
                >
                  No payees found matching your filter criteria.
                </TD>
              </tr>
            ) : (
              filteredPayees.map((payee, index) => {
                const displayType = payee.type;
                const isTaxable =
                  payee.taxable !== false &&
                  payee.taxStatus !== "None" &&
                  payee.taxStatus !== "EXEMPT";

                return (
                  <TR key={payee.id} striped={index % 2 === 1}>
                    {/* Payee Name & Role / Email */}
                    <TD>
                      <p
                        onClick={() => router.push(`/payroll/payees/${payee.id}`)}
                        className="font-medium text-[#1f2937] hover:text-[#2183c6] cursor-pointer"
                      >
                        {payee.name}
                      </p>
                      <p className="text-xs text-[#9ca3af]">
                        {payee.role ? `${payee.role} • ` : ""}
                        {payee.email}
                      </p>
                    </TD>

                    {/* Classification Badge */}
                    <TD className="whitespace-nowrap">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          typeStyles[displayType] || "bg-[#e0f2fe] text-[#0284c7]"
                        }`}
                      >
                        {displayType}
                      </span>
                    </TD>

                    {/* Date Onboarded */}
                    <TD className="whitespace-nowrap text-xs font-medium text-[#475569]">
                      {payee.dateOnboarded || payee.joinDate || "N/A"}
                    </TD>

                    {/* Tax Regime */}
                    <TD className="whitespace-nowrap">
                      {isTaxable ? (
                        <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-medium text-[#a16207]">
                          {payee.taxStatus === "WHT" ? "5% WHT" : "PAYE (Taxable)"}
                        </span>
                      ) : (
                        <span className="text-xs text-[#9ca3af]">Tax Exempt (0%)</span>
                      )}
                    </TD>

                    {/* Monthly Gross */}
                    <TD className="text-right font-medium text-[#1f2937] whitespace-nowrap">
                      {formatNaira(payee.grossSalary || (payee as any).amount || 0)}
                    </TD>

                    {/* Net Payout */}
                    <TD className="text-right font-bold text-[#15803d] whitespace-nowrap">
                      {formatNaira(payee.netSalary || payee.grossSalary || 0)}
                    </TD>

                    {/* Active On Payroll Toggle — Reusable Toggle Component */}
                    <TD className="text-center whitespace-nowrap">
                      <div className="flex justify-center">
                        <Toggle
                          checked={payee.onPayroll}
                          onChange={() => toggleOnPayroll(payee.id)}
                          ariaLabel={`Toggle payroll inclusion for ${payee.name}`}
                        />
                      </div>
                    </TD>

                    {/* Status Badge */}
                    <TD className="text-center whitespace-nowrap">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[payee.status] || "bg-[#dcfce7] text-[#15803d]"
                        }`}
                      >
                        {payee.status}
                      </span>
                    </TD>

                    {/* Actions — View Button, Pencil Icon, Trash Box */}
                    <TD className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => router.push(`/payroll/payees/${payee.id}`)}
                          className="rounded bg-[#e0f2fe] px-2.5 py-1 text-xs font-medium text-[#0284c7] hover:bg-[#bae6fd] transition"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => router.push(`/payroll/payees/${payee.id}`)}
                          className="text-[#9ca3af] hover:text-[#2183c6] transition p-1"
                          title="Edit Payee"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openRemoveModal(payee)}
                          className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#f1f4f7] text-[#697586] hover:bg-red-50 hover:text-red-500 transition"
                          title="Delete Payee"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </TD>
                  </TR>
                );
              })
            )}
          </TBody>
        </T>
      </Table>

      {/* Add Payee Wizard Modal */}
      <AddPayeeModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddPayee}
      />

      {/* Bulk Upload Modal */}
      <BulkUploadPayeeModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
      />

      {/* Remove Payee Modal */}
      <RemovePayeeModal
        open={removeModalOpen}
        payee={selectedPayeeForRemove}
        onCancel={() => {
          setRemoveModalOpen(false);
          setSelectedPayeeForRemove(null);
        }}
        onRemove={handleConfirmRemove}
      />
    </div>
  );
}
