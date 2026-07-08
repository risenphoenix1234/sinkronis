import { employees } from "@/data/employee/attendance";

export default function AttendanceTable() {
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left text-sm text-gray-400">
            <th className="py-4">Name</th>

            <th>Clock-In & Out</th>

            <th>Department</th>

            <th>Note</th>

            <th>Status</th>

            <th>Work mode</th>

            <th>Day off</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee, index) => (
            <tr key={index} className="border-b">
              <td className="py-5">{employee.name}</td>

              <td>{employee.time}</td>

              <td>{employee.department}</td>

              <td>{employee.note}</td>

              <td>
                <span
                  className={
                    employee.status === "Present"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {employee.status}
                </span>
              </td>

              <td>{employee.mode}</td>

              <td>{employee.dayOff}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
