// src/app/hris/dashboard/page.tsx
"use client";

import AttendanceMetricCard from "@/components/hris/dashboard/AttendanceMetricCard";
import Button from "@/components/ui/Button";
import { getHrisDashboard, approveLeaveReq, rejectLeaveReq } from "@/lib/api/hris";
import type { HrisDashboardData } from "@/lib/api/types/hrisTypes";
import { timeAgo } from "@/utils/timeAgo";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "@/components/ui/Loader";

type ApiError = {
  response?: {
    status?: number;
    data?: { message?: string };
  };
  message?: string;
};

const dashboardErrorMessage = (err: unknown): string => {
  const e = err as ApiError;
  if (e.response?.status === 403) {
    return "You don't have access to HRIS. Check that HRIS is enabled for your plan and that your role has HRIS permissions.";
  }
  return e.response?.data?.message || e.message || "Failed to load dashboard";
};

const leaveErrorMessage = (err: unknown, fallback: string): string => {
  const e = err as ApiError;
  const status = e.response?.status;
  if (status === 409) return "This request was already reviewed.";
  if (status === 404) return "This leave request no longer exists.";
  return e.response?.data?.message || e.message || fallback;
};

const removeLeaveRequest = (
  current: HrisDashboardData | null,
  leaveId: string,
): HrisDashboardData | null => {
  if (!current) return current;
  return {
    ...current,
    pendingLeaveRequests: current.pendingLeaveRequests.filter(
      (r) => r.id !== leaveId,
    ),
    employeeOverview: {
      ...current.employeeOverview,
      pendingLeaveApprovals: Math.max(
        0,
        current.employeeOverview.pendingLeaveApprovals - 1,
      ),
    },
  };
};

export default function HRISDashboardPage() {
  const [data, setData] = useState<HrisDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    getHrisDashboard()
      .then((res) => {
        const payload = res.data?.data;
        if (!payload) {
          throw new Error("Dashboard response was empty");
        }
        setData(payload);
      })
      .catch((err) => setError(dashboardErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleApproveLeave = async (leaveId: string) => {
    setApprovingId(leaveId);
    try {
      await approveLeaveReq(leaveId);
      toast.success("Leave request approved successfully");
      setData((current) => removeLeaveRequest(current, leaveId));
    } catch (err: unknown) {
      toast.error(leaveErrorMessage(err, "Failed to approve leave request."));
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectLeave = async (leaveId: string) => {
    const reason =
      window.prompt("Reason for rejection (optional):") ?? undefined;
    setRejectingId(leaveId);
    try {
      await rejectLeaveReq(leaveId, reason ? { reason } : undefined);
      toast.success("Leave request rejected successfully");
      setData((current) => removeLeaveRequest(current, leaveId));
    } catch (err: unknown) {
      toast.error(leaveErrorMessage(err, "Failed to reject leave request."));
    } finally {
      setRejectingId(null);
    }
  };

  if (loading) return <Loader variant="page" label="Loading" />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return null;

  const hires = data.newHires;
  const hiresTrendClass =
    hires.trend === "UP"
      ? "text-[#2E7D32]"
      : hires.trend === "DOWN"
        ? "text-[#C62828]"
        : "text-[#637381]";
  const hiresTrendText =
    hires.trend === "UP"
      ? `+${Math.abs(hires.difference)} vs last month`
      : hires.trend === "DOWN"
        ? `-${Math.abs(hires.difference)} vs last month`
        : "No change vs last month";

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#F4F6F8] p-6">
      <div>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-[#212B36]">Welcome Back</h1>

          <div className="flex items-center gap-3 font-light">
            <p className="text-xs text-[#637381]">
              {data.currentDate} ({data.timeZone})
            </p>
          </div>
        </div>

        <div className="mb-7 grid grid-cols-2 gap-5 lg:grid-cols-4">
          <div className="rounded-md bg-white p-5">
            <p className="text-xs text-[#637381]">Total Employees</p>
            <h2 className="mt-1 text-3xl font-bold text-[#212B36]">
              {data.employeeOverview.totalEmployees}
            </h2>
          </div>

          <div className="rounded-md bg-white p-5">
            <p className="text-xs text-[#637381]">Active Employees</p>
            <h2 className="mt-1 text-3xl font-bold text-[#212B36]">
              {data.employeeOverview.activeEmployees}
            </h2>
            <p className="mt-1 text-xs text-[#2E7D32]">
              {data.employeeOverview.activeEmployeePercentage}% of total
            </p>
          </div>

          <div className="rounded-md bg-white p-5">
            <p className="text-xs text-[#637381]">On Leave Today</p>
            <h2 className="mt-1 text-3xl font-bold text-[#212B36]">
              {data.employeeOverview.employeesOnLeave}
            </h2>
            <p className="mt-1 text-xs text-[#2E7D32]">
              {data.employeeOverview.pendingLeaveApprovals} pending approval
            </p>
          </div>

          <div className="rounded-md bg-white p-5">
            <p className="text-xs text-[#637381]">New Hires (MTD)</p>
            <h2 className="mt-1 text-3xl font-bold text-[#212B36]">{hires.currentMonth}</h2>
            <p className={`mt-1 text-xs ${hiresTrendClass}`}>
              {hiresTrendText}
            </p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-12 items-start gap-5">
          <div className="col-span-8 rounded-md bg-white p-5">
            <h3 className="mb-8 text-sm font-semibold text-[#212B36]">
              Today&apos;s Attendance
            </h3>

            <div className="grid grid-cols-3 gap-y-8">
              <AttendanceMetricCard
                label="On Time"
                metric={data.attendanceOverview.onTime}
              />
              <AttendanceMetricCard
                label="Late Clock-in"
                metric={data.attendanceOverview.lateClockIn}
              />
              <AttendanceMetricCard
                label="Early Clock-in"
                metric={data.attendanceOverview.earlyClockIn}
              />
              <AttendanceMetricCard
                label="Absent"
                metric={data.attendanceOverview.absent}
              />
              <AttendanceMetricCard
                label="No Clock-in"
                metric={data.attendanceOverview.noClockIn}
              />
              <AttendanceMetricCard
                label="No Clock-out"
                metric={data.attendanceOverview.noClockOut}
              />
            </div>
          </div>

          <div className="col-span-4 rounded-md bg-white p-5">
            <h3 className="mb-5 text-sm font-semibold text-[#212B36]">
              Recent Activity
            </h3>

            <div className="max-h-64 space-y-5 overflow-y-auto">
              {data.recentActivity && data.recentActivity.length > 0 ? (
                data.recentActivity.map((activity) => (
                  <div key={activity.id}>
                    <p className="text-xs text-[#212B36]">
                      {activity.description}
                    </p>
                    <p className="text-[11px] text-[#919EAB]">
                      {timeAgo(activity.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-xs text-[#919EAB]">
                  No recent activity
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 items-start gap-5">
          <div className="col-span-8 rounded-md bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-[#212B36]">
              Pending Leave Requests
            </h3>

            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-dotted border-[#EBEEF0] text-left text-[#919EAB]">
                  <th className="px-3 pb-3 font-normal">Employee</th>
                  <th className="px-3 pb-3 font-normal">Department</th>
                  <th className="px-3 pb-3 font-normal">Type</th>
                  <th className="px-3 pb-3 font-normal">Days</th>
                  <th className="px-3 pb-3 font-normal">From</th>
                  <th className="px-3 pb-3"></th>
                </tr>
              </thead>

              <tbody>
                {data.pendingLeaveRequests.map((item) => (
                  <tr key={item.id} className="even:bg-[#F2F2F7]">
                    <td className="px-3 py-3 text-[#212B36]">
                      {item.employee?.name || "—"}
                    </td>
                    <td className="px-3 py-3 text-[#637381]">
                      {item.department?.name || "—"}
                    </td>
                    <td className="px-3 py-3 text-[#637381]">
                      {item.type?.replace(/_/g, " ") || item.type}
                    </td>
                    <td className="px-3 py-3 font-semibold text-[#212B36]">
                      {item.days}d
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[#637381]">
                      {item.from}
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="h-7 px-3 text-xs"
                          disabled={
                            approvingId === item.id || rejectingId === item.id
                          }
                          onClick={() => handleApproveLeave(item.id)}
                        >
                          {approvingId === item.id ? "..." : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 border-[#EBEEF0] px-3 text-xs text-[#212B36]"
                          disabled={
                            rejectingId === item.id || approvingId === item.id
                          }
                          onClick={() => handleRejectLeave(item.id)}
                        >
                          {rejectingId === item.id ? "..." : "Reject"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data.pendingLeaveRequests.length === 0 && (
              <p className="py-6 text-center text-xs text-[#919EAB]">
                No pending leave requests
              </p>
            )}
          </div>

          <div className="col-span-4 rounded-md bg-white p-5">
            <h3 className="mb-6 text-sm font-semibold text-[#212B36]">
              Headcount by Department
            </h3>

            <div className="space-y-5">
              {data.headcountByDepartment.map((dept) => {
                const percent =
                  data.employeeOverview.totalEmployees > 0
                    ? (dept.headcount / data.employeeOverview.totalEmployees) *
                      100
                    : 0;

                return (
                  <div key={dept.departmentId}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-[#212B36]">
                        {dept.departmentName}
                      </span>
                      <span className="text-[#637381]">{dept.headcount}</span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-[#EDEFF2]">
                      <div
                        className="h-full rounded-full bg-[#2183C6]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {data.headcountByDepartment.length === 0 && (
              <p className="py-6 text-center text-xs text-[#919EAB]">
                No department data available
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}