"use client";

export default function DashboardPage() {
  const stats = [
    { title: "Attendance", value: "90%", color: "text-green-600" },
    { title: "Leave Count", value: "19", color: "text-green-600" },
    { title: "Days Absent", value: "2", color: "text-red-500" },
    { title: "On Leave", value: "0", color: "text-gray-500" },
    { title: "Late Arrivals", value: "2", color: "text-yellow-500" },
    { title: "Logged Hours", value: "153.3h", color: "text-gray-800" },
  ];

  const records = [
    "1 Jun 2026",
    "29 May 2026",
    "23 May 2026",
    "17 May 2026",
    "26 Apr 2026",
    "21 Apr 2026",
  ];

  const days = [1, 2, 3, 4, 5];
  const weeks = [1, 2, 3, 4, 5];

  return (
    <section className="bg-[#f7f7f7] min-h-screen p-6" space-y-6>
      {/* Employee Header */}

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          AO
        </div>

        <div>
          <h1 className="font-semibold text-lg">Amara Okafor</h1>

          <p className="text-xs text-gray-500">
            HR | Full Time | Employee ID: SNR-001
          </p>
        </div>
      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-6 gap-4 mb-4">
        {stats.map((item) => (
          <div key={item.title} className="bg-white rounded-md border p-4">
            <p className="text-xs text-gray-500">{item.title}</p>

            <h2 className={`text-2xl font-bold mt-2 ${item.color}`}>
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Alert */}

      <div className="bg-orange-50 border border-orange-200 text-orange-600 text-sm rounded-md px-4 py-2 mb-6">
        ⚠️ 1.2D underlogged this month
      </div>

      {/* Main Content */}

      <div className="grid grid-cols-12 gap-6">
        {/* Heatmap */}

        <div className="col-span-8 bg-white border rounded-md p-6">
          <div className="flex justify-between mb-6">
            <h3 className="font-semibold">May 2026</h3>

            <button>›</button>
          </div>

          <div className="grid grid-cols-6 gap-2 text-center">
            <div></div>

            {days.map((day) => (
              <div key={day} className="text-xs text-gray-400">
                {["Mon", "Tue", "Wed", "Thu", "Fri"][day - 1]}
              </div>
            ))}

            {weeks.map((week) => (
              <>
                <div
                  key={`week-${week}`}
                  className="text-gray-400 text-xs flex items-center"
                >
                  {week}
                </div>

                {days.map((day) => (
                  <div
                    key={`${week}-${day}`}
                    className={`h-10 rounded flex items-center justify-center text-xs font-medium

                    ${
                      (week + day) % 4 === 0
                        ? "bg-red-100 text-red-500"
                        : (week + day) % 3 === 0
                          ? "bg-blue-100 text-blue-500"
                          : (week + day) % 2 === 0
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-700"
                    }`}
                  >
                    {Math.floor(Math.random() * 10)}
                  </div>
                ))}
              </>
            ))}
          </div>

          {/* Legend */}

          <div className="flex gap-4 mt-8 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Present
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              Late
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              Absent
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              Leave
            </div>
          </div>
        </div>

        {/* Recent Records */}

        <div className="col-span-4 bg-white border rounded-md p-6">
          <h3 className="font-semibold mb-4">Recent Records</h3>

          <div className="space-y-5">
            {records.map((item) => (
              <div key={item} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{item}</p>

                  <p className="text-xs text-gray-400">Attendance</p>
                </div>

                <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
                  On Time
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
