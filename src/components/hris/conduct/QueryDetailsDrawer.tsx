"use client";

import { EmployeeQuery } from "@/types/hris/conduct";
import { Plus } from "lucide-react";

interface Props {
  query: EmployeeQuery | null;
}

export default function QueryDetailsDrawer({ query }: Props) {
  if (!query) {
    return <aside className="w-[340px] border-l bg-white" />;
  }

  return (
    <aside className="w-[340px] border-l bg-white flex flex-col">
      <div className="p-5">
        {/* Profile */}

        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-300" />

          <div>
            <h3 className="font-semibold">{query.employeeName}</h3>

            <p className="text-green-600 text-xs">{query.status}</p>
          </div>
        </div>

        {/* Employee Details */}

        <div className="mt-5 space-y-3 text-sm">
          <Detail label="Employee ID" value={query.employeeId} />

          <Detail label="Role" value={query.role} />

          <Detail label="Email" value={query.email} />

          <Detail label="Department" value={query.department} />

          <Detail label="Query Type" value={query.queryType} />

          <Detail label="Date" value={query.date} />
        </div>

        {/* Query History */}

        <div className="mt-6">
          <h4 className="text-xs text-slate-500 mb-3">Query History</h4>

          <div className="space-y-2">
            {query.history.map((item) => (
              <div key={item} className="flex justify-between text-sm">
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}

        <div className="mt-6">
          <h4 className="text-xs text-slate-500 mb-3">Notes</h4>

          <div className="space-y-3">
            {query.notes.map((note) => (
              <div key={note.id} className="rounded-md border p-3">
                <div className="flex justify-between">
                  <span className="font-medium">{note.author}</span>

                  <span className="text-xs text-slate-400">{note.date}</span>
                </div>

                {note.type === "query" && (
                  <p className="text-orange-500 text-xs mt-1">New Query</p>
                )}

                <p className="mt-1 text-xs text-slate-600">{note.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action */}

      <button
        className="
          absolute
          bottom-5
          right-5
          h-12
          w-12
          rounded-full
          bg-blue-600
          text-white
          flex
          items-center
          justify-center
          shadow-lg
        "
      >
        <Plus size={20} />
      </button>
    </aside>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>

      <p className="font-medium">{value}</p>
    </div>
  );
}
