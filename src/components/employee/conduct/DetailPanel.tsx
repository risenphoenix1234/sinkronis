import { Field } from "@/app/employee/conduct/page";
import {
  AnyEmployee,
  QueryEmployee,
  statusStyles,
  SuspensionEmployee,
} from "@/types/employee/conduct";
import { Plus, X } from "lucide-react";

export function DetailPanel({
  emp,
  onClose,
}: {
  emp: AnyEmployee;
  onClose: () => void;
}) {
  const isQuery = emp.type === "Query";

 function statusColor(status: string) {
  if (status === "Resolved") return "text-green-500";
  if (status === "Pending") return "text-amber-500";
  if (status === "In Progress") return "text-blue-500";
  if (status === "Open") return "text-red-500";

  return "text-gray-500";
}

  return (
    <aside className="w-[300px] min-w-[300px] border-l border-gray-200 bg-white flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-700 shrink-0">
              {emp.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {emp.name}
              </p>
              <p
                className={`text-xs font-medium mt-0.5 ${statusColor(emp.status)}`}
              >
                {emp.status}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 mt-0.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="px-5 py-4 space-y-4 border-b border-gray-100">
        <Field label="Employee ID" value={emp.id} />
        <Field label="Role" value={emp.role} />
        <Field label="Email" value={emp.email} />
        <Field label="Department" value={emp.department} />

        {isQuery ? (
          <>
            <Field
              label="Query Type"
              value={(emp as QueryEmployee).queryType}
            />
            <Field label="Date" value={(emp as QueryEmployee).date} />
          </>
        ) : (
          <>
            <Field
              label="Suspension Type"
              value={(emp as SuspensionEmployee).suspensionType}
            />
            <div className="grid grid-cols-2 gap-4">
              <Field label="From" value={(emp as SuspensionEmployee).from} />
              <Field label="To" value={(emp as SuspensionEmployee).to} />
            </div>
          </>
        )}
      </div>

      {/* Query History */}
      {emp.queryHistory.length > 0 && (
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-[11px] text-gray-400 mb-2">Query History</p>
          <div className="space-y-1.5">
            {emp.queryHistory.map((h, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="font-semibold text-gray-800">{h.label}</span>
                <span className="text-gray-400">({h.date})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {emp.notes.length > 0 && (
        <div className="px-5 py-4 flex-1">
          <p className="text-[11px] text-gray-400 mb-3">Notes</p>
          <div className="space-y-3">
            {emp.notes.map((note, i) => (
              <div key={i} className="bg-gray-50 rounded-lg px-3 py-2.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-800">
                    {note.author}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {note.timestamp}
                  </span>
                </div>
                {note.tag && (
                  <p
                    className={`text-[11px] font-medium mb-0.5 ${isQuery ? "text-blue-500" : "text-yellow-500"}`}
                  >
                    {note.tag}
                  </p>
                )}
                <p className="text-xs text-gray-600 leading-snug">
                  {note.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAB */}
      <div className="px-5 py-4 flex justify-end">
        <button className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center shadow transition">
          <Plus size={18} />
        </button>
      </div>
    </aside>
  );
}
