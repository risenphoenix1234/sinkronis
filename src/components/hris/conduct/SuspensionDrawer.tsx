// src/components/hris/conduct/SuspensionDrawer.tsx
"use client";

import { ConductRecord } from "@/lib/api/types/hrisTypes";
import StatusBadge from "@/components/ui/StatusBadge";
import { X } from "lucide-react";
import { resolveDepartmentName } from "@/utils/department";

interface NoteItem {
  id?: string;
  author?: string;
  date?: string;
  message?: string;
}

type SuspensionDrawerProps = {
  open: boolean;
  suspension?: ConductRecord | null;
  onClose: () => void;
};

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

export default function SuspensionDrawer({
  open,
  suspension,
  onClose,
}: SuspensionDrawerProps) {
  if (!open || !suspension) return null;

  const notes = normalizeNotes(suspension.notes);
  const history = normalizeHistory(suspension.history);
  const empName =
    suspension.employeeName ||
    suspension.employee?.name ||
    [suspension.employee?.firstName, suspension.employee?.lastName].filter(Boolean).join(" ") ||
    "";
  const empId =
    suspension.employeeId ||
    suspension.employee?.employeeId ||
    suspension.employee?.id ||
    "—";
  const empRole = suspension.role || suspension.employee?.role || "—";
  const empEmail = suspension.email || suspension.employee?.email || "—";

  const initials = empName
    ? empName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0] ?? "")
        .join("")
        .slice(0, 2)
        .toUpperCase() || "SU"
    : "SU";

  return (
    <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}>
      <div
        className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-[480px] flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAECF0] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700">
              {initials}
            </div>

            <div>
              <h2 className="font-semibold text-[#101828]">
                {empName || "Employee Suspension"}
              </h2>
              <p className="text-xs text-[#667085]">
                Employee ID: {empId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Details */}
        <div className="flex-1 overflow-y-auto space-y-4 p-5 pb-10 text-sm">
          <div className="flex justify-between items-center py-1">
            <span className="text-xs text-[#667085]">Status</span>
            <StatusBadge status={suspension.status} />
          </div>

          <InfoRow label="Role" value={empRole} />
          <InfoRow label="Email" value={empEmail} />
          <InfoRow label="Department" value={resolveDepartmentName(suspension.department)} />
          <InfoRow
            label="Suspension Reason / Type"
            value={
              suspension.queryType
                ? suspension.queryType.replace(/_/g, " ")
                : "—"
            }
          />
          <InfoRow label="Effective Date" value={suspension.date || "—"} />

          {/* History */}
          {history.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-medium text-[#667085] mb-2">History</p>
              <div className="space-y-1.5">
                {history.map((h, i) => (
                  <p key={i} className="text-xs text-slate-700 bg-slate-50 p-2 rounded">
                    {typeof h === "string" ? h : JSON.stringify(h)}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-medium text-[#667085] mb-2">Notes</p>
            {notes.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No notes recorded.</p>
            ) : (
              <div className="space-y-2">
                {notes.map((note, i) => (
                  <div key={note.id ?? i} className="rounded-lg border border-[#EAECF0] p-3 text-xs">
                    {note.author && (
                      <div className="flex justify-between font-medium text-slate-800 mb-1">
                        <span>{note.author}</span>
                        {note.date && <span className="text-slate-400">{note.date}</span>}
                      </div>
                    )}
                    <p className="text-slate-600">{note.message || JSON.stringify(note)}</p>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[#667085]">{label}</p>
      <p className="mt-0.5 font-medium text-[#101828]">{value}</p>
    </div>
  );
}
