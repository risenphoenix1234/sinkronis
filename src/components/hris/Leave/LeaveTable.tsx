"use client";

import { approveLeaveReq, rejectLeaveReq } from "@/lib/api/hris";
import { LeaveRequestRecord } from "@/lib/api/types/hrisTypes";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "@/components/ui/Loader";

interface LeaveTableProps {
  requests: LeaveRequestRecord[];
  loading: boolean;
  onActionComplete: () => void;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function LeaveTable({
  requests,
  loading,
  onActionComplete,
  page,
  totalPages,
  total,
  onPageChange,
}: LeaveTableProps) {
  const [actingId, setActingId] = useState<string | null>(null);

  const statusClass = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "bg-green-100 text-green-600";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "REJECTED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const handleApprove = async (id: string) => {
    const comment =
      window.prompt("Comment for the employee (optional):") ?? undefined;
    setActingId(id);
    try {
      await approveLeaveReq(id, comment ? { comment } : undefined);
      toast.success("Leave request approved successfully");
      onActionComplete();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          status?: number;
          data?: { message?: string };
        };
        message?: string;
      };
      const status = axiosErr.response?.status;
      if (status === 409) {
        toast.error("This request was already reviewed by someone else.");
      } else if (status === 404) {
        toast.error("This leave request no longer exists.");
      } else if (status === 403) {
        toast.error("You don't have permission to approve leave requests.");
      } else {
        toast.error(
          axiosErr.response?.data?.message ||
            axiosErr.message ||
            "Failed to approve leave request.",
        );
      }
      onActionComplete();
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason =
      window.prompt("Reason for rejection (optional):") ?? undefined;

    setActingId(id);
    try {
      await rejectLeaveReq(id, reason ? { reason } : undefined);
      toast.success("Leave request rejected successfully");
      onActionComplete();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          status?: number;
          data?: { message?: string };
        };
        message?: string;
      };
      const status = axiosErr.response?.status;
      if (status === 409) {
        toast.error("This request was already reviewed by someone else.");
      } else if (status === 404) {
        toast.error("This leave request no longer exists.");
      } else if (status === 403) {
        toast.error("You don't have permission to reject leave requests.");
      } else {
        toast.error(
          axiosErr.response?.data?.message ||
            axiosErr.message ||
            "Failed to reject leave request.",
        );
      }
      onActionComplete();
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <Loader variant="section" label="Loading leave requests" />
    );
  }

  if (requests.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-8 text-center">
        No leave requests found.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-xs text-gray-400 border-b">
            <tr className="h-12">
              <th className="text-left">Employee</th>
              <th className="text-left">Department</th>
              <th className="text-left">Leave Type</th>
              <th className="text-left">From</th>
              <th className="text-left">To</th>
              <th className="text-left">Days</th>
              <th className="text-left">Status</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((item) => (
              <tr key={item.id} className="border-b h-14 text-sm">
                <td>{item.employee?.name ?? "—"}</td>
                <td>{item.department?.name ?? "—"}</td>
                <td>{item.leaveType}</td>
                <td>{item.from}</td>
                <td>{item.to}</td>
                <td>{item.days}d</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusClass(item.status)}`}
                  >
                    {item.status?.toLowerCase()}
                  </span>
                </td>
                <td>
                  {item.status?.toUpperCase() === "PENDING" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        disabled={actingId === item.id}
                        className="bg-blue-500 text-white text-xs px-3 py-1 rounded disabled:opacity-50"
                      >
                        {actingId === item.id ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        disabled={actingId === item.id}
                        className="bg-red-100 text-red-500 text-xs px-3 py-1 rounded disabled:opacity-50"
                      >
                        {actingId === item.id ? "..." : "Reject"}
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6">
        <p className="text-xs text-gray-400">
          Page {page} of {totalPages} · {total} total
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="w-8 h-8 border rounded disabled:opacity-40"
          >
            ‹
          </button>
          <button className="w-8 h-8 rounded bg-blue-500 text-white">
            {page}
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="w-8 h-8 border rounded disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </>
  );
}
