// src/app/tenant-admin/organisation/work-schedule/page.tsx
"use client";

import { useMemo, useState } from "react";

const allDays = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

const breakOptions = ["0 mins", "30 mins", "45 mins", "60 mins", "90 mins"];

export default function WorkSchedulePage() {
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
  ]);
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("05:30 PM");
  const [breakDuration, setBreakDuration] = useState("60 mins");
  const [saving, setSaving] = useState(false);

  const toggleDay = (key: string) => {
    setSelectedDays((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    );
  };

  const summary = useMemo(() => {
    const dayCount = selectedDays.length;
    return `${dayCount} days/week · ${startTime.replace(
      " AM",
      ""
    )}–${endTime.replace(" PM", "")} · ${breakDuration} break`;
  }, [selectedDays, startTime, endTime, breakDuration]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 600);
  };

  return (
    <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">
        Default Work Schedule
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        This schedule feeds into HRIS attendance tracking as the baseline for
        all employees.
      </p>

      <div className="mt-5">
        <p className="mb-2 text-sm text-slate-500">Working Days</p>
        <div className="flex flex-wrap gap-2">
          {allDays.map((day) => {
            const isSelected = selectedDays.includes(day.key);
            return (
              <button
                key={day.key}
                onClick={() => toggleDay(day.key)}
                className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-[#2183C6] text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm text-slate-500">
            Work Start Time
          </label>
          <input
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-slate-500">
            Work End Time
          </label>
          <input
            type="text"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-slate-500">
            Break Duration (minutes)
          </label>
          <select
            value={breakDuration}
            onChange={(e) => setBreakDuration(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          >
            {breakOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 rounded-md bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
        Summary: {summary}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-5 rounded-md bg-[#2183C6] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1c70ab] disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Schedule"}
      </button>
    </div>
  );
}