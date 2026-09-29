"use client";

import { Attendance } from "@/types/hris/attendance";

interface EmployeeProfileProps {
  stats?: {
    onTime?: number;
    late?: number;
    absent?: number;
    onLeave?: number;
    noClockOut?: number;
    overtime?: number;
  };
}

const EmpployeeAttendanceProfile = ({ stats }: EmployeeProfileProps) => {
  return (
    <div className="">
      <div className="grid grid-cols-6 gap-4 mt-5">
        {[
          ["On Time", stats?.onTime ?? 0],
          ["Late", stats?.late ?? 0],
          ["Absent", stats?.absent ?? 0],
          ["On Leave", stats?.onLeave ?? 0],
          ["No Clock-out", stats?.noClockOut ?? 0],
          ["Overtime", stats?.overtime ?? 0],
        ].map(([title, value]) => (
          <div key={title} className="bg-white border rounded-lg p-4">
            <p className="text-xs text-gray-500">{title}</p>

            <h2 className="text-3xl font-bold mt-2">{value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmpployeeAttendanceProfile;
