"use client";

import { Attendance } from "@/types/attendance";

interface EmployeeProfileProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Attendance | null;
}

const EmpployeeAttendanceProfile = () => {

  return (
    <div className="">

      <div className="grid grid-cols-6 gap-4 mt-5">
        {[
          ["On Time", 5],
          ["Late", 1],
          ["Absent", 1],
          ["On Leave", 2],
          ["No Clock-out", 1],
          ["Overtime", 1],
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
