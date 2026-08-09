import { useRouter } from "next/navigation";

const employees = [
  {
    name: "Amara Nwosu",
    role: "HR Manager",
    department: "Human Resources",
    manager: "Chukwumeka Obi",
    status: "Acknowledged",
    score: "83%",
  },
  {
    name: "Tunde Adeyemi",
    role: "Operations Lead",
    department: "Operations",
    manager: "Chukwumeka Obi",
    status: "Pending HR Approval",
    score: "63%",
  },
  {
    name: "Amara Nwosu",
    role: "HR Manager",
    department: "Human Resources",
    manager: "Chukwumeka Obi",
    status: "Acknowledged",
    score: "83%",
  },
  {
    name: "Tunde Adeyemi",
    role: "Operations Lead",
    department: "Operations",
    manager: "Chukwumeka Obi",
    status: "Pending HR Approval",
    score: "63%",
  },
];

export default function EmployeeTable() {
  const router = useRouter();
  return (
    <div className="mt-6 overflow-hidden rounded-lg border bg-white">
      <div className="border-b px-5 py-4">
        <h3 className="font-semibold text-slate-800">
          All Employees — Q2 2026 Review
        </h3>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b text-left text-xs uppercase text-slate-500">
            <th className="px-5 py-4">Employee</th>
            <th className="px-5 py-4">Department</th>
            <th className="px-5 py-4">Manager</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Score</th>
            <th className="px-5 py-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.name} className="border-b">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-slate-500">{employee.role}</p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">{employee.department}</td>

              <td className="px-5 py-4">{employee.manager}</td>

              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    employee.status === "Acknowledged"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {employee.status}
                </span>
              </td>

              <td
                className={`px-5 py-4 font-semibold ${
                  employee.score === "83%" ? "text-green-600" : "text-blue-600"
                }`}
              >
                {employee.score}
              </td>

              <td className="px-5 py-4">
                {employee.status === "Acknowledged" ? (
                  <button
                    className="rounded-md bg-blue-100 px-4 py-2 text-sm text-blue-700"
                    onClick={() =>
                      router.push(`/hris/appraisal/${employee.name}`)
                    }
                  >
                    View
                  </button>
                ) : (
                  <button className="rounded-md bg-purple-600 px-4 py-2 text-sm text-white">
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
