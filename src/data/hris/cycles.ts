// data/cycles.ts

import { AppraisalCycle } from "@/types/hris/appraisal";



export const cycles: AppraisalCycle[] = [
  {
    id: 1,
    title: "Q2 2026 Review",
    status: "Active",
    template: "Standard Performance Review",
    description:
      "Second quarter performance review for all employees.",
    duration:
      "Apr 2026 – Jun 2026 • Deadline: 15 Jul 2026",
    progress: 16,
    acknowledged: "1 of 6 employees acknowledged",
  },
  {
    id: 2,
    title: "Q1 2026 Review",
    status: "Completed",
    template: "Standard Performance Review",
    description: "First quarter performance review.",
    duration:
      "Jan 2026 – Mar 2026 • Deadline: 15 Apr 2026",
  },
  {
    id: 3,
    title: "Q4 2025 Review",
    status: "Completed",
    template: "Standard Performance Review",
    description: "Annual Q4 review.",
    duration:
      "Oct 2025 – Dec 2025 • Deadline: 15 Jan 2026",
  },
];