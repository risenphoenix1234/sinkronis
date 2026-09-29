"use client";

import { ConductRecord } from "@/lib/api/types/hrisTypes";
import { X } from "lucide-react";
import { resolveDepartmentName } from "@/utils/department";

interface NoteItem {
  id?: string;
  author?: string;
  date?: string;
  type?: string;
  message?: string;
}

interface Props {
  open?: boolean;
  query: ConductRecord | null;
  onClose: () => void;
}

function normalizeNotes(rawNotes: unknown): NoteItem[] {
  if (!rawNotes) return [];
  if (Array.isArray(rawNotes)) {
    return rawNotes.map((n, idx) => {
      if (typeof n === "string") return { id: String(idx), message: n };
      if (n && typeof n === "object") return n as NoteItem;
      return { id: String(idx), message: String(n) };
    });
  }
  if (typeof rawNotes === "string") {
    const trimmed = rawNotes.trim();
    return trimmed ? [{ id: "note-0", message: trimmed }] : [];
  }
  if (typeof rawNotes === "object") {
    return [rawNotes as NoteItem];
  }
  return [];
}

function normalizeHistory(rawHistory: unknown): string[] {
  if (!rawHistory) return [];
  if (Array.isArray(rawHistory)) {
    return rawHistory.map((h) => (typeof h === "string" ? h : JSON.stringify(h)));
  }
  if (typeof rawHistory === "string") {
    const trimmed = rawHistory.trim();
    return trimmed ? [trimmed] : [];
  }
  return [];
}

export default function QueryDetailsDrawer({ open = true, query, onClose }: Props) {
  if (!open || !query) return null;

  const history = normalizeHistory(query.history);
  const notes = normalizeNotes(query.notes);
  const empName =
    query.employeeName ||
    query.employee?.name ||
    [query.employee?.firstName, query.employee?.lastName].filter(Boolean).join(" ") ||
    "";
  const empId = query.employeeId || query.employee?.employeeId || query.employee?.id || "—";
  const empRole = query.role || query.employee?.role || "—";
  const empEmail = query.email || query.employee?.email || "—";

  const initials = empName
    ? empName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0] ?? "")
        .join("")
        .slice(0, 2)
        .toUpperCase() || "EM"
    : "EM";

  return (
    <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}>
      <div
        className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-[420px] flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto p-5 pb-8">
        {/* Profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
              {initials}
            </div>

            <div>
              <h3 className="font-semibold text-slate-700">{empName || "Employee Query"}</h3>
              <p className="text-xs text-slate-500">{empId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close query details"
            className="rounded p-1 text-slate-400 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Employee Details */}
        <div className="mt-5 space-y-3 text-sm">
          <Detail label="Employee ID" value={empId} />
          <Detail label="Role" value={empRole} />
          <Detail label="Email" value={empEmail} />
          <Detail label="Department" value={resolveDepartmentName(query.department)} />
          <Detail
            label="Query Type"
            value={query.queryType ? query.queryType.replace(/_/g, " ") : "—"}
          />
          <Detail label="Date" value={query.date} />
        </div>

        {/* Query History */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-medium text-slate-500 mb-3">Query History</h4>

          {history.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No history recorded.</p>
          ) : (
            <div className="space-y-2">
              {history.map((item, i) => (
                <div key={i} className="rounded bg-slate-50 p-2 text-xs text-slate-700">
                  <span>{typeof item === "string" ? item : JSON.stringify(item)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-medium text-slate-500 mb-3">Notes</h4>

          {notes.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No notes recorded.</p>
          ) : (
            <div className="space-y-3">
              {notes.map((note, i) => (
                <div key={note.id ?? i} className="rounded-md border border-slate-200 p-3">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{note.author || "Note"}</span>
                    {note.date && <span className="text-slate-400">{note.date}</span>}
                  </div>

                  {note.type === "query" && (
                    <p className="text-orange-500 text-xs mt-1 font-medium">New Query</p>
                  )}

                  <p className="mt-1 text-xs text-slate-600">{note.message || JSON.stringify(note)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 p-4">
        <button
          onClick={onClose}
          className="w-full rounded-lg border border-[#D0D5DD] bg-white py-2 text-sm font-medium text-[#344054] hover:bg-slate-50 transition"
        >
          Close
        </button>
      </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium text-slate-800">{value || "—"}</p>
    </div>
  );
}

