"use client";

import { useEffect, useState, useCallback } from "react";
import ApplyForLeaveModal from "@/components/modals/Hris/ApplyForLeaveModal";
import LeaveSummaryCard from "@/components/hris/Leave/LeaveSummaryCard";
import LeaveTable from "@/components/hris/Leave/LeaveTable";
import LeaveTabs from "@/components/hris/Leave/LeaveTabs";
import { getLeaveOverview, getLeaveRequests } from "@/lib/api/hris";
import {
  LeaveOverviewResponse,
  LeaveRequestRecord,
  LeaveRequestStatusFilter,
} from "@/lib/api/types/hrisTypes";

type TabValue = "All" | "Pending" | "Approved" | "Rejected";

const TAB_TO_STATUS: Record<TabValue, LeaveRequestStatusFilter> = {
  All: "ALL",
  Pending: "PENDING",
  Approved: "APPROVED",
  Rejected: "REJECTED",
};

export default function LeaveManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [overview, setOverview] = useState<LeaveOverviewResponse | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>("All");
  const [page, setPage] = useState(1);

  const [requests, setRequests] = useState<LeaveRequestRecord[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchOverview = useCallback(async () => {
    try {
      setOverview(await getLeaveOverview());
    } catch (err) {
      console.error("Failed to load leave overview:", err);
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const res = await getLeaveRequests({
        page,
        limit: 6,
        status: TAB_TO_STATUS[activeTab],
      });
      setRequests(res.data ?? []);
      setPagination({
        total: res.pagination?.total ?? 0,
        totalPages: res.pagination?.totalPages ?? 1,
      });
    } catch (err) {
      console.error("Failed to load leave requests:", err);
      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }, [page, activeTab]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleTabChange = (tab: TabValue) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleActionComplete = () => {
    fetchOverview();
    fetchRequests();
  };

  const summary = [
    {
      title: "Pending Requests",
      value: overview?.pending ?? 0,
      color: "text-yellow-500",
    },
    {
      title: "Approved",
      value: overview?.approved ?? 0,
      color: "text-green-600",
    },
    {
      title: "Rejected",
      value: overview?.rejected ?? 0,
      color: "text-red-500",
    },
  ];

  return (
    <section className="min-h-screen bg-[#f8f9fb] p-6 space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Leave Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
        >
          + Apply for Leave
        </button>
      </div>
      <div className="mb-6 grid md:grid-cols-3 gap-4">
        {summary.map((item) => (
          <LeaveSummaryCard
            key={item.title}
            title={item.title}
            value={overviewLoading ? 0 : item.value}
            color={item.color}
          />
        ))}
      </div>
      <div className="rounded-md border bg-white p-5">
        <LeaveTabs activeTab={activeTab} onChange={handleTabChange} />
        <LeaveTable
          requests={requests}
          loading={requestsLoading}
          onActionComplete={handleActionComplete}
          page={page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPageChange={setPage}
        />
      </div>

      <ApplyForLeaveModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onApplied={() => {
          setShowModal(false);
          handleActionComplete(); // refetch overview + list
        }}
      />
    </section>
  );
}
