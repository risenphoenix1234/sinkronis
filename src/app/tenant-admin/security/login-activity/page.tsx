// src/app/tenant-admin/security/login-activity/page.tsx
"use client";

type LoginEvent = {
  id: string;
  user: string;
  ipAddress: string;
  device: string;
  location: string;
  time: string;
  status: "Success" | "Failed";
};

const loginEvents: LoginEvent[] = [
  {
    id: "log-1",
    user: "Chukwuemeka Obi",
    ipAddress: "197.210.45.12",
    device: "Chrome / Windows 11",
    location: "Lagos",
    time: "Jun 8, 2026, 9:41 AM",
    status: "Success",
  },
  {
    id: "log-2",
    user: "Amara Nwosu",
    ipAddress: "105.112.85.34",
    device: "Chrome / macOS",
    location: "Abuja",
    time: "Jun 8, 2026, 8:15 AM",
    status: "Success",
  },
  {
    id: "log-3",
    user: "Unknown",
    ipAddress: "182.90.41.7",
    device: "Firefox / Linux",
    location: "Unknown",
    time: "Jun 7, 2026, 11:52 PM",
    status: "Failed",
  },
  {
    id: "log-4",
    user: "Tunde Adeyemi",
    ipAddress: "41.184.07.123",
    device: "Edge / Windows 10",
    location: "Ibadan",
    time: "Jun 6, 2026, 4:30 PM",
    status: "Success",
  },
  {
    id: "log-5",
    user: "Unknown",
    ipAddress: "176.84.43.98",
    device: "Chrome / Android",
    location: "Unknown",
    time: "Jun 5, 2026, 2:15 AM",
    status: "Failed",
  },
  {
    id: "log-6",
    user: "Fatima Bello",
    ipAddress: "197.210.41.55",
    device: "Safari / iPhone",
    location: "Lagos",
    time: "Jun 5, 2026, 9:02 PM",
    status: "Success",
  },
];

export default function LoginActivityPage() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">User</th>
              <th className="px-4 py-2.5 font-medium">IP Address</th>
              <th className="px-4 py-2.5 font-medium">Device</th>
              <th className="px-4 py-2.5 font-medium">Location</th>
              <th className="px-4 py-2.5 font-medium">Time</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loginEvents.map((event) => (
              <tr key={event.id} className="border-b border-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {event.user}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {event.ipAddress}
                </td>
                <td className="px-4 py-3 text-slate-600">{event.device}</td>
                <td className="px-4 py-3 text-slate-600">
                  {event.location}
                </td>
                <td className="px-4 py-3 text-slate-500">{event.time}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      event.status === "Success"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}