"use client";

import Button from "@/components/ui/Button";
// import { useHRISDashboard } from "@/hooks/useHRISDashbord";
import { departments, requests } from "@/utils/types";
import { useEffect, useState } from "react";

// src/app/hris/overview/page.tsx
export default function HRISDashboardPage() {
  // const { data, loading, error, refetch } = useHRISDashboard();

  // if (loading) {
  //   return (
  //     <div className="flex min-h-[400px] items-center justify-center">
  //       <p className="text-sm text-gray-500">Loading dashboard...</p>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
  //       <p className="text-sm text-red-500">{error}</p>

  //       <button
  //         type="button"
  //         onClick={refetch}
  //         className="rounded-lg bg-black px-4 py-2 text-sm text-white"
  //       >
  //         Try Again
  //       </button>
  //     </div>
  //   );
  // }
  return (
    <section className="p-6">
      <div>
        {/* Header */}

        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-[#1D2939]">Welcome Back</h1>

          <div className="flex items-center font-light gap-3">
            <p>Monday, 1 June 2026</p>
          </div>

          {/* <pre className="rounded-lg bg-gray-100 p-4 text-sm">
            {JSON.stringify(data, null, 2)}
          </pre> */}
        </div>

        {/* {StatCard} */}
        <div className="flex items-center justify-between gap-6 mb-4">
          <div className="bg-white p-4 w-full">
            <p className="text-xs text-gray-500">Total Employees</p>
            <h2 className="text-3xl font-bold mt-1">248</h2>
            <p className="text-xs text-green-800 mt-1">+3 this month</p>
          </div>

          <div className="bg-white p-4 w-full">
            <p className="text-xs text-gray-500">Active Employees</p>
            <h2 className="text-3xl font-bold mt-1">231</h2>
            <p className="text-xs text-green-800 mt-1">+93 of total</p>
          </div>

          <div className="bg-white p-4 w-full">
            <p className="text-xs text-gray-500">On Leave Today</p>
            <h2 className="text-3xl font-bold mt-1">12</h2>
            <p className="text-xs text-green-800 mt-1">5 pending approval</p>
          </div>

          <div className="bg-white p-4 w-full">
            <p className="text-xs text-gray-500">New Hires (MTD)</p>
            <h2 className="text-3xl font-bold mt-1">6</h2>
            <p className="text-xs text-green-800 mt-1">+2 vs last month</p>
          </div>
        </div>
        {/* Row 1 */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          {/* Attendance */}
          <div className="col-span-8 bg-white rounded-lg p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-8">
              Today's Attendance
            </h3>

            <div className="grid grid-cols-3 gap-y-10">
              <div>
                <p className="text-xs text-gray-500">On Time</p>
                <h2 className="text-3xl font-semibold mt-1">200</h2>
                <p className="text-xs text-green-600 mt-1">+12 vs Yesterday</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Late Clock-in</p>
                <h2 className="text-3xl font-semibold mt-1">45</h2>
                <p className="text-xs text-red-500 mt-1">-12 vs Yesterday</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Early Clock-in</p>
                <h2 className="text-3xl font-semibold mt-1">220</h2>
                <p className="text-xs text-green-600 mt-1">+10 vs Yesterday</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Absent</p>
                <h2 className="text-3xl font-semibold mt-1">65</h2>
                <p className="text-xs text-green-600 mt-1">+9 vs Yesterday</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">No Clock-in</p>
                <h2 className="text-3xl font-semibold mt-1">34</h2>
                <p className="text-xs text-red-500 mt-1">-1 vs Yesterday</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">No Clock-out</p>
                <h2 className="text-3xl font-semibold mt-1">0</h2>
                <p className="text-xs text-green-600 mt-1">0 vs Yesterday</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-span-4 bg-white rounded-lg p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-5">
              Recent Activity
            </h3>

            <div className="space-y-5">
              <div>
                <p className="text-xs text-gray-700">
                  Amara Okafor submitted a leave request
                </p>
                <p className="text-[11px] text-gray-400">2 mins ago</p>
              </div>

              <div>
                <p className="text-xs text-gray-700">
                  New employee Jide Mensah was added to Finance
                </p>
                <p className="text-[11px] text-gray-400">1 hr ago</p>
              </div>

              <div>
                <p className="text-xs text-gray-700">
                  Chukwuemeka Adeyemi clocked in
                </p>
                <p className="text-[11px] text-gray-400">2 hrs ago</p>
              </div>

              <div>
                <p className="text-xs text-gray-700">
                  Appraisal cycle Q2 2026 was created
                </p>
                <p className="text-[11px] text-gray-400">Yesterday</p>
              </div>

              <div>
                <p className="text-xs text-gray-700">
                  Fatima Al-Hassan conduct query resolved
                </p>
                <p className="text-[11px] text-gray-400">Yesterday</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-12 gap-4">
          {/* Pending Leave */}
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
                {requests.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-4">{item.employee}</td>
                    <td>{item.department}</td>
                    <td>{item.type}</td>
                    <td>{item.days}</td>
                    <td>{item.from}</td>

                    <td>
                      <div className="flex gap-2">
                        <Button size="sm">Approve</Button>

                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Headcount */}
          <div className="col-span-4 bg-white rounded-lg p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-6">
              Headcount by Department
            </h3>

            <div className="space-y-5">
              {departments.map((dept) => (
                <div key={dept.name}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-600">{dept.name}</span>
                    <span className="text-gray-500">{dept.count}</span>
                  </div>

                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${dept.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
