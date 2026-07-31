import { InboxItem } from "@/types/employee/inbox";

export const inboxData: InboxItem[] = [
  {
    id: 1,
    type: "goal",
    title: "Confirm your Q2 2026 performance goals",
    description:
      "Your manager has proposed goals for the Q2 cycle. Please review and confirm.",
    date: "Due: 15 Jul 2026",
    status: "Pending",
  },
  {
    id: 2,
    type: "assessment",
    title: "Self-assessment opens on 20 July",
    description:
      "Complete your self-assessment before the deadline.",
    date: "Opens: 20 Jul 2026",
    status: "Pending",
  },
  {
    id: 3,
    type: "leave",
    title: "Leave application approved",
    description:
      "Your Annual Leave request (20–25 Jul) was approved.",
    date: "2 Jul 2026",
    status: "Done",
  },
  {
    id: 4,
    type: "payslip",
    title: "June 2026 payslip is ready",
    description:
      "Your June 2026 payslip has been processed and is available to download.",
    date: "30 Jun 2026",
    status: "Done",
  },
  {
    id: 5,
    type: "dispute",
    title: "Complete dispute resolution",
    description:
      "Your attendance dispute for 4 July is pending HR review.",
    date: "Submitted 5 Jul",
    status: "Pending",
  },
];