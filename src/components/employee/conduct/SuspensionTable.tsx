import { AnyEmployee, SuspensionEmployee } from "@/types/employee/conduct";

export function SuspensionTable({
  data,
  search,
  selected,
  onSelect,
}: {
  data: SuspensionEmployee[];
  search: string;
  selected: AnyEmployee | null;
  onSelect: (emp: SuspensionEmployee) => void;
}) {
  const filtered = data.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.suspensionType.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 bg-white sticky top-0 z-10">
          {[
            "Employee ID",
            "Name",
            "Role",
            "Department",
            "Suspension Type",
            "From",
          ].map((col) => (
            <th
              key={col}
              className="text-left px-6 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filtered.map((emp, i) => (
          <tr
            key={i}
            onClick={() => onSelect(emp)}
            className={`border-b border-gray-50 cursor-pointer transition-colors ${
              i % 2 === 1 ? "bg-gray-50/70" : "bg-white"
            } ${selected === emp ? "bg-blue-50/40" : "hover:bg-gray-50"}`}
          >
            <td className="px-6 py-3.5 text-gray-500 text-xs font-medium">
              {emp.id}
            </td>
            <td className="px-6 py-3.5 font-medium text-gray-800">
              {emp.name}
            </td>
            <td className="px-6 py-3.5 text-gray-600">{emp.role}</td>
            <td className="px-6 py-3.5 text-gray-600">{emp.department}</td>
            <td className="px-6 py-3.5 text-gray-600">{emp.suspensionType}</td>
            <td className="px-6 py-3.5 text-gray-600">{emp.from}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
