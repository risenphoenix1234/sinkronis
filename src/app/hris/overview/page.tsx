import Button from "@/components/ui/Button";
import { departments, requests } from "@/utils/types";

// src/app/hris/overview/page.tsx
export default function HRISOverviewPage() {
  return (
    <section className="p-6">
      <div>
        {/* Header */}
        
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-semibold text-[#1D2939]">Overview</h1>

          <div className="flex items-center gap-3">
            <Button variant={"outline"}>Export Report</Button>
            <Button variant={"outline"}>Filter</Button>
            <Button variant={"outline"}>September</Button>
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
