"use client";

import { useEffect, useMemo, useState } from "react";
import { getWorkSchedule, saveWorkSchedule } from "@/lib/api/admin";
import Loader from "@/components/ui/Loader";

const allDays = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
] as const;

type DayKey = (typeof allDays)[number]["key"];

const breakOptions = [0, 30, 45, 60, 90];

export default function WorkSchedulePage() {
  const [days, setDays] = useState<Record<DayKey, boolean>>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakDuration, setBreakDuration] = useState(60);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const schedule = await getWorkSchedule();
        setDays({
          monday: schedule.monday,
          tuesday: schedule.tuesday,
          wednesday: schedule.wednesday,
          thursday: schedule.thursday,
          friday: schedule.friday,
          saturday: schedule.saturday,
          sunday: schedule.sunday,
        });
        setStartTime(schedule.workStartTime);
        setEndTime(schedule.workEndTime);
        setBreakDuration(schedule.breakDurationMinutes);
      } catch (err) {
        setError("Failed to load work schedule.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleDay = (key: DayKey) => {
    setDays((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const summary = useMemo(() => {
    const dayCount = Object.values(days).filter(Boolean).length;
    return `${dayCount} days/week · ${startTime}–${endTime} · ${breakDuration} mins break`;
  }, [days, startTime, endTime, breakDuration]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveMessage(null);
    try {
      await saveWorkSchedule({
        ...days,
        workStartTime: startTime,
        workEndTime: endTime,
        breakDurationMinutes: breakDuration,
      });
      setSaveMessage("Work schedule saved.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save schedule.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
        <Loader variant="section" label="Loading work schedule" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">Default Work Schedule</h2>
      <p className="mt-1 text-sm text-slate-500">
        This schedule feeds into HRIS attendance tracking as the baseline for all employees.
      </p>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}
      {saveMessage && (
        <div className="mt-4 rounded-md bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          {saveMessage}
        </div>
      )}

      <div className="mt-5">
        <p className="mb-2 text-sm text-slate-500">Working Days</p>
        <div className="flex flex-wrap gap-2">
          {allDays.map((day) => {
            const isSelected = days[day.key];
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
          <label className="mb-1.5 block text-sm text-slate-500">Work Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-slate-500">Work End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-slate-500">Break Duration (minutes)</label>
          <select
            value={breakDuration}
            onChange={(e) => setBreakDuration(Number(e.target.value))}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          >
            {breakOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} mins
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