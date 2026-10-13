"use client";

import AttendanceMetricCard from "@/components/hris/dashboard/AttendanceMetricCard";
import Button from "@/components/ui/Button";
import { getHrisDashboard, approveLeaveReq, rejectLeaveReq } from "@/lib/api/hris";
import type { HrisDashboardData } from "@/lib/api/types/hrisTypes";
import { timeAgo } from "@/utils/timeAgo";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return null;

  const hires = data.newHires;
  const hiresTrendClass =
    hires.trend === "UP"
      ? "text-green-800"
      : hires.trend === "DOWN"
        ? "text-red-600"
        : "text-gray-500";
  const hiresTrendText =
    hires.trend === "UP"
      ? `+${Math.abs(hires.difference)} vs last month`
      : hires.trend === "DOWN"
        ? `-${Math.abs(hires.difference)} vs last month`
        : "No change vs last month";

  return (
    <section className="p-6">
      <div>
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-[#1D2939]">Welcome Back</h1>

          <div className="flex items-center font-light gap-3">
            <p>
              {data.currentDate} ({data.timeZone})
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 mb-4">
          <div className="bg-white p-4 w-full">
            <p className="text-xs text-gray-500">Total Employees</p>
            <h2 className="text-3xl font-bold mt-1">
              {data.employeeOverview.totalEmployees}
            </h2>
          </div>

          <div className="bg-white p-4 w-full">
            <p className="text-xs text-gray-500">Active</p>
            <h2 className="text-3xl font-bold mt-1">
              {data.employeeOverview.activeEmployees}
            </h2>
            <p className="text-xs text-green-800 mt-1">
              {data.employeeOverview.activeEmployeePercentage}% of total
            </p>
          </div>

          <div className="bg-white p-4 w-full">
            <p className="text-xs text-gray-500">On Leave Today</p>
            <h2 className="text-3xl font-bold mt-1">
              {data.employeeOverview.employeesOnLeave}
            </h2>
            <p className="text-xs text-green-800 mt-1">
              {data.employeeOverview.pendingLeaveApprovals} pending approval
            </p>
          </div>

          <div className="bg-white p-4 w-full">
            <p className="text-xs text-gray-500">New Hires (MTD)</p>
            <h2 className="text-3xl font-bold mt-1">{hires.currentMonth}</h2>
            <p className={`text-xs mt-1 ${hiresTrendClass}`}>
              {hiresTrendText}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-8 bg-white rounded-lg p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-8">
              Today&apos;s Attendance
            </h3>

            <div className="grid grid-cols-3 gap-y-10">
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

          <div className="col-span-4 bg-white rounded-lg p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-5">
              Recent Activity
            </h3>

            <div className="space-y-5 h-48 overflow-y-auto">
              {data.recentActivity && data.recentActivity.length > 0 ? (
                data.recentActivity.map((activity) => (
                  <div key={activity.id}>
                    <p className="text-xs text-gray-700">
                      {activity.description}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {timeAgo(activity.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 py-6 text-center">
                  No recent activity
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 bg-white rounded-lg p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Pending Leave Requests
            </h3>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-medium">Employee</th>
                  <th className="pb-3 font-medium">Department</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Days</th>
                  <th className="pb-3 font-medium">From</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>

              <tbody>
                {data.pendingLeaveRequests.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-4">{item.employee?.name || "—"}</td>
                    <td>{item.department?.name || "—"}</td>
                    <td>{item.type?.replace(/_/g, " ") || item.type}</td>
                    <td>{item.days}</td>
                    <td>{item.from}</td>

                    <td>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
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
              <p className="text-xs text-gray-400 py-6 text-center">
                No pending leave requests
              </p>
            )}
          </div>

          <div className="col-span-4 bg-white rounded-lg p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-6">
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
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-600">
                        {dept.departmentName}
                      </span>
                      <span className="text-gray-500">{dept.headcount}</span>
                    </div>

                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {data.headcountByDepartment.length === 0 && (
              <p className="text-xs text-gray-400 py-6 text-center">
                No department data available
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}