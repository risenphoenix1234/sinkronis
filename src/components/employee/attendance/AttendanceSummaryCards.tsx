import { AttendanceSummary, AttendanceSummaryData } from "@/types/employee/attendance";

interface Props {
  summary?: AttendanceSummaryData | AttendanceSummary | null;
}

export default function AttendanceSummaryCards({ summary }: Props) {
  const present =
    (summary as AttendanceSummaryData)?.presentDays ??
    (summary as AttendanceSummary)?.present ??
    0;

  const late =
    (summary as AttendanceSummaryData)?.lateDays ??
    (summary as AttendanceSummary)?.late ??
    0;

  const absent =
    (summary as AttendanceSummaryData)?.absentDays ??
    (summary as AttendanceSummary)?.absent ??
    0;

  const workingDays = summary?.workingDays ?? 0;

  const cards = [
    {
      label: "Present",
      value: present,
      boxBg: "bg-[#E8F8F0]",
      dotColor: "bg-[#10B981]",
    },
    {
      label: "Late",
      value: late,
      boxBg: "bg-[#FEF6E6]",
      dotColor: "bg-[#B45309]",
    },
    {
      label: "Absent",
      value: absent,
      boxBg: "bg-[#FEECEC]",
      dotColor: "bg-[#EF4444]",
    },
    {
      label: "Working Days",
      value: workingDays,
      boxBg: "bg-[#EBF5FB]",
      dotColor: "bg-[#1976D2]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
        >
          <div>
            <p className="text-xs font-medium text-slate-400">{card.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
              {card.value}
            </p>
          </div>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.boxBg}`}
          >
            <div className={`h-3.5 w-3.5 rounded-full ${card.dotColor}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
