type Status = "Pending" | "Approved" | "Rejected";

interface LeaveRequest {
  employee: string;
  department: string;
  leaveType: string;
  from: string;
  to: string;
  days: number;
  status: Status;
}

export default function LeaveTable() {
  const requests: LeaveRequest[] = [
    {
      employee: "Amara Okafor",
      department: "Human Resources",
      leaveType: "Annual Leave",
      from: "20 May 2026",
      to: "24 May 2026",
      days: 5,
      status: "Pending",
    },
    {
      employee: "Chinweze Akinemi",
      department: "Finance",
      leaveType: "Sick Leave",
      from: "19 May 2026",
      to: "16 May 2026",
      days: 2,
      status: "Pending",
    },
    {
      employee: "Fatima Al-Hassan",
      department: "Operations",
      leaveType: "Maternity Leave",
      from: "01 Jun 2026",
      to: "29 Aug 2026",
      days: 90,
      status: "Approved",
    },
    {
      employee: "Tunde Balogun",
      department: "IT & Technology",
      leaveType: "Annual Leave",
      from: "18 May 2026",
      to: "20 May 2026",
      days: 3,
      status: "Approved",
    },
    {
      employee: "Ngozi Eze",
      department: "Sales & Marketing",
      leaveType: "Compassionate Leave",
      from: "08 May 2026",
      to: "10 May 2026",
      days: 3,
      status: "Approved",
    },
    {
      employee: "Adebayo Nwachukwu",
      department: "Customer Support",
      leaveType: "Study Leave",
      from: "25 May 2026",
      to: "28 May 2026",
      days: 4,
      status: "Rejected",
    },
  ];

  const statusClass = (status: Status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-600";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Rejected":
        return "bg-red-100 text-red-600";
    }
  };

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
            </tr>
          </thead>

          <tbody>
            {requests.map((item) => (
              <tr key={item.employee} className="border-b h-14 text-sm">
                <td>{item.employee}</td>

                <td>{item.department}</td>

                <td>{item.leaveType}</td>

                <td>{item.from}</td>

                <td>{item.to}</td>

                <td>{item.days}d</td>

                <td>
                  <span
                    className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-medium
                    ${statusClass(item.status)}
                  `}
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  <div className="flex gap-2">
                    <button
                      className="
                      bg-blue-500
                      text-white
                      text-xs
                      px-3
                      py-1
                      rounded
                    "
                    >
                      Approve
                    </button>

                    <button
                      className="
                      bg-red-100
                      text-red-500
                      text-xs
                      px-3
                      py-1
                      rounded
                    "
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}

      <div className="flex items-center justify-between mt-6">
        <p className="text-xs text-gray-400">Showing 1-6 of 6</p>

        <div className="flex gap-2">
          <button className="w-8 h-8 border rounded">‹</button>

          <button
            className="
            w-8
            h-8
            rounded
            bg-blue-500
            text-white
          "
          >
            1
          </button>

          <button className="w-8 h-8 border rounded">›</button>
        </div>
      </div>
    </>
  );
}
