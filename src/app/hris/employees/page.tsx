"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getEmployees } from "@/lib/api/hris";
import type { EmployeeListItem } from "@/lib/api/types/hrisTypes";
import axios from "axios";
import { BiSearch, BiPlus, BiFilterAlt, BiSortAlt2, BiPencil } from "react-icons/bi";
import FilterPanel, { type FilterValues } from "@/components/modals/Hris/FilterPanel";
interface EmployeeRow {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  lifecycleStatus: LifecycleStatus;
  contact: string;
  joinedDate: string;
  joinedDateIso: string;
}

function formatJoinedDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

type LifecycleStatus = "CONFIRMED" | "PROBATION" | "EXITED";
type TabKey = "Confirmed" | "Probation" | "Exited";

const TAB_TO_STATUS: Record<TabKey, LifecycleStatus> = {
  Confirmed: "CONFIRMED",
  Probation: "PROBATION",
  Exited: "EXITED",
};
const TABS: TabKey[] = ["Confirmed", "Probation", "Exited"];

const STATUS_LABEL: Record<LifecycleStatus, string> = {
  CONFIRMED: "Confirmed",
  PROBATION: "Probation",
  EXITED: "Exited",
};

const STATUS_STYLES: Record<LifecycleStatus, string> = {
  CONFIRMED: "bg-[#ECFDF3] text-[#12B76A]",
  PROBATION: "bg-[#FFFAEB] text-[#B54708]",
  EXITED: "bg-[#FEF3F2] text-[#B42318]",
};

function toLifecycleStatus(value: string): LifecycleStatus {
  return value === "CONFIRMED" || value === "PROBATION" || value === "EXITED"
    ? value
    : "PROBATION";
}

function toRow(emp: EmployeeListItem): EmployeeRow {
  return {
    id: emp.id,
    employeeId: emp.employeeId,
    name: emp.name,
    role: emp.role,
    department: emp.department?.name ?? "",
    lifecycleStatus: toLifecycleStatus(emp.status),
    contact: emp.phoneNumber,
    joinedDate: formatJoinedDate(emp.joinedDate),
    joinedDateIso: emp.joinedDate,
  };
}

type SortKey = "employeeId" | "name" | "role" | "department";

export default function EmployeeListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("Confirmed");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({ status: "All Statuses", exitedDate: "" });

  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadEmployees = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const employees = await getEmployees ({ limit: 100 }); // no destructuring — it's already the array
      setRows(employees.map(toRow));
    } catch (error) {
      console.error("loadEmployees failed:", error);
      setLoadError(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Failed to load employees."
          : "Failed to load employees.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const visibleRows = useMemo(() => {
    const status = TAB_TO_STATUS[activeTab];
    const term = search.trim().toLowerCase();

    let filtered = rows.filter((row) => row.lifecycleStatus === status);

    if (filters.status !== "All Statuses") {
      const statusByLabel: Record<string, LifecycleStatus> = {
        Confirmed: "CONFIRMED",
        Probation: "PROBATION",
        Exited: "EXITED",
      };
      filtered = filtered.filter((row) => row.lifecycleStatus === statusByLabel[filters.status]);
    }

    if (filters.exitedDate) {
      filtered = filtered.filter(
        (row) => row.joinedDateIso.slice(0, 10) === filters.exitedDate,
      );
    }

    if (term) {
      filtered = filtered.filter(
        (row) =>
          row.name.toLowerCase().includes(term) ||
          row.employeeId.toLowerCase().includes(term) ||
          row.role.toLowerCase().includes(term) ||
          row.department.toLowerCase().includes(term),
      );
    }

    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        const cmp = a[sortKey].localeCompare(b[sortKey]);
        return sortAsc ? cmp : -cmp;
      });
    }

    return filtered;
  }, [rows, activeTab, search, sortKey, sortAsc, filters]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <main className="min-h-screen bg-white px-8 py-10">
      <div className="mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-[28px] font-bold text-[#1F2937]">Employee List</h1>
          <button
            type="button"
            onClick={() => router.push("/hris/employees/add")}
            className="flex h-10 items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 text-[14px] font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            <BiPlus className="h-4 w-4" />
            New Employee
          </button>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex h-10 w-full max-w-xs items-center gap-2 border-b border-[#E5E9F0] px-1">
            <BiSearch className="h-4 w-4 text-[#98A2B3]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Employee"
              className="w-full bg-transparent text-[14px] text-[#1F2937] outline-none placeholder:text-[#98A2B3]"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen((open) => !open)}
              aria-expanded={filterOpen}
              className="flex h-9 items-center gap-1.5 rounded-md border border-[#E5E9F0] px-3 text-[13px] font-medium text-[#344054] transition hover:border-[#2388D0] hover:text-[#2388D0]"
            >
              <BiFilterAlt className="h-4 w-4" />
              Filters
            </button>

            {filterOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-[min(24rem,calc(100vw-2rem))]">
                <FilterPanel
                  initialValues={filters}
                  statusOptions={["All Statuses", "Confirmed", "Probation", "Exited"]}
                  onCancel={() => setFilterOpen(false)}
                  onSave={(values) => {
                    setFilters(values);
                    setFilterOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 flex gap-6 border-b border-[#E5E9F0]">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-[14px] font-medium transition ${
                activeTab === tab ? "text-[#2563EB]" : "text-[#98A2B3] hover:text-[#667085]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#2563EB]" />
              )}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="px-4 py-12 text-center text-[#667085]">Loading employees…</p>
          ) : loadError ? (
            <div className="px-4 py-12 text-center">
              <p className="text-[#B42318]">{loadError}</p>
              <button
                type="button"
                onClick={loadEmployees}
                className="mt-3 text-[13px] font-medium text-[#2388D0] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="text-[12px] text-[#98A2B3]">
                  <SortableHeader label="Employee ID" sortKey="employeeId" activeKey={sortKey} onSort={toggleSort} />
                  <SortableHeader label="Name" sortKey="name" activeKey={sortKey} onSort={toggleSort} />
                  <SortableHeader label="Role" sortKey="role" activeKey={sortKey} onSort={toggleSort} />
                  <SortableHeader label="Department" sortKey="department" activeKey={sortKey} onSort={toggleSort} />
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal">Contact</th>
                  <th className="px-4 py-3 font-normal">Joined</th>
                  <th className="px-4 py-3 font-normal" />
                </tr>
              </thead>
              <tbody>
                {visibleRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-[#667085]">
                      No employees match this view.
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((row, i) => (
                    <tr key={row.id} className={i % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"}>
                      <td className="px-4 py-4 text-[#344054]">{row.employeeId}</td>
                      <td className="px-4 py-4 font-medium text-[#1F2937]">{row.name}</td>
                      <td className="px-4 py-4 text-[#344054]">{row.role}</td>
                      <td className="px-4 py-4 text-[#344054]">{row.department}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium ${STATUS_STYLES[row.lifecycleStatus]}`}
                        >
                          {STATUS_LABEL[row.lifecycleStatus]}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[#344054]">{row.contact}</td>
                      <td className="px-4 py-4 text-[#344054]">{row.joinedDate}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          aria-label={`Edit ${row.name}`}
                          onClick={() => router.push(`/hris/employees/${row.id}`)}
                          className="text-[#98A2B3] transition hover:text-[#2388D0]"
                        >
                          <BiPencil className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}

function SortableHeader({
  label,
  sortKey,
  activeKey,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey | null;
  onSort: (key: SortKey) => void;
}) {
  return (
    <th className="px-4 py-3 font-normal">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`flex items-center gap-1 transition hover:text-[#344054] ${
          activeKey === sortKey ? "text-[#344054]" : ""
        }`}
      >
        {label}
        <BiSortAlt2 className="h-3.5 w-3.5" />
      </button>
    </th>
  );
}