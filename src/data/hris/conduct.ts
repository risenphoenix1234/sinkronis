import { EmployeeQuery, Suspension } from "@/types/hris/conduct";

export const queries: EmployeeQuery[] = [
  {
    id: "1",
    employeeId: "003546AE",
    employeeName: "Michael Young",
    role: "Developer",
    email: "michaelyoung@gmail.com",
    department: "IT Department",
    queryType: "Performance-Related",
    date: "12.02.2025",
    status: "Resolved",

    history: [
      "Financial",
      "Workplace Incident",
    ],

    notes: [
      {
        id: "1",
        author: "HR",
        type: "query",
        date: "09.01.2025 12:00pm",
        message:
          "Performance Related: You failed to finish your tasks twice in a row.",
      },
      {
        id: "2",
        author: "Michael Young",
        type: "response",
        date: "09.01.2025 12:10pm",
        message:
          "The instructions weren't clear and my system was slow.",
      },
    ],
  },
  {
    id: "2",
    employeeId: "003546AE",
    employeeName: "Chloe Davis",
    role: "IT Manager",
    email: "chloe@gmail.com",
    department: "IT Department",
    queryType: "Performance-Related",
    date: "12.02.2025",
    status: "Open",
    history: [],
    notes: []
  },
  {
    id: "3",
    employeeId: "003546AE",
    employeeName: "Lukas Carter",
    role: "office Manager",
    email: "lukascarter@gmail.com",
    department: "Service Department",
    queryType: "Complaince-Related",
    date: "12.02.2025",
    status: "In Progress",
    history: [],
    notes: []
  },
  {
    id: "4",
    employeeId: "003546AE",
    employeeName: "William king",
    role: "Content Writter",
    email: "chloe@gmail.com",
    department: "Freelance",
    queryType: "Financial",
    date: "12.02.2025",
    status: "Resolved",
    history: [],
    notes: []
  },
  {
    id: "5",
    employeeId: "003546AE",
    employeeName: "Olivia White",
    role: "Benefit Coordinator",
    email: "chloe@gmail.com",
    department: "Specialist Department",
    queryType: "Operational",
    date: "12.02.2025",
    status: "In Progress",
    history: [],
    notes: []
  },
];

export const suspensions: Suspension[] = [
  {
    id: "003546AE",
    name: "Chloe Davis",
    role: "IT Manager",
    department: "IT Department",
    type: "Administrative",
    from: "12.02.2025",
    to: "14.02.2025",
    status: "Open",
  },
  {
    id: "003546AE",
    name: "Lucas Carter",
    role: "Office Manager",
    department: "Service Department",
    type: "Disciplinary",
    from: "13.02.2025",
    to: "15.02.2025",
    status: "In Progress",
  },
  {
    id: "003546AE",
    name: "William King",
    role: "Content Writer",
    department: "Freelance Department",
    type: "Conditional",
    from: "15.02.2025",
    to: "18.02.2025",
    status: "Resolved",
  },
  {
    id: "003546AE",
    name: "Olivia White",
    role: "Developer",
    department: "IT Department",
    type: "Disciplinary",
    from: "17.02.2025",
    to: "20.02.2025",
    status: "In Progress",
  },
];