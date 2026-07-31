import StatCard from "./StatCard";

export default function AttendanceSummary() {
  return (
    <div className="mt-4 grid grid-cols-4 gap-4">
      {[
        {
          label: "Present",
          value: 22,
          color: "bg-green-100",
          dot: "bg-green-500",
        },
        {
          label: "Late",
          value: 1,
          color: "bg-yellow-100",
          dot: "bg-yellow-500",
        },
        { label: "Absent", value: 1, color: "bg-red-100", dot: "bg-red-500" },
        {
          label: "Working Days",
          value: 22,
          color: "bg-blue-100",
          dot: "bg-blue-500",
        },
      ].map(({ label, value, color, dot }) => (
        <div
          key={label}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div
            className={`w-9 h-9  ${color} flex items-center justify-center`}
          >
            <span className={`w-3 h-3 rounded-2xl ${dot}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
