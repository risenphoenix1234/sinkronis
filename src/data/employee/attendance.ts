
import { AttendanceRecord, CalendarDay } from "@/types/employee/attendance";

export const calendarDays: CalendarDay[] = [
  { day: 1, status: "Present" },
  { day: 2, status: "Present" },
  { day: 3, status: "Late" },
  { day: 4, status: "Absent" },
  { day: 5 },

  { day: 6 },
  { day: 7, status: "Present" },
  { day: 8, status: "Present" },
  { day: 9, status: "Present" },
  { day: 10, status: "Present" },
  { day: 11, status: "Present" },
  { day: 12 },

  { day: 13 },
  { day: 14, status: "Present" },
  { day: 15, status: "Present" },
  { day: 16, status: "Present" },
  { day: 17, status: "Present" },
  { day: 18, status: "Present" },
  { day: 19 },

  { day: 20 },
  { day: 21, status: "Present" },
  { day: 22, status: "Present" },
  { day: 23, status: "Present" },
  { day: 24, status: "Present" },
  { day: 25, status: "Present" },
  { day: 26 },

  { day: 27 },
  { day: 28, status: "Present" },
  { day: 29, status: "Present" },
  { day: 30, status: "Present" },
  { day: 31, status: "Present" },
];


export const attendanceLog: AttendanceRecord[] = [
  { date: "Tue, 1 Jul 2026", clockIn: "08:02", clockOut: "17:14", hoursWorked: "9h 12m", status: "Present" },
  { date: "Wed, 2 Jul 2026", clockIn: "08:15", clockOut: "17:00", hoursWorked: "8h 45m", status: "Present" },
  { date: "Thu, 3 Jul 2026", clockIn: "08:00", clockOut: "17:05", hoursWorked: "9h 05m", status: "Present" },
  { date: "Fri, 4 Jul 2026", clockIn: "—",     clockOut: "—",     hoursWorked: "—",      status: "Absent"  },
  { date: "Mon, 7 Jul 2026", clockIn: "09:30", clockOut: "17:10", hoursWorked: "7h 40m", status: "Late"    },
];