import { Goal, PastAppraisal } from "@/types/employee/appraisal";

export const goals: Goal[] = [
  {
    id: 1,
    title: "Implement New Onboarding Process",
    target: "End of Q2",
    status: "Completed",
  },
  {
    id: 2,
    title: "Reduce Staff Turnover by 10%",
    target: "End of Q2",
    status: "In Progress",
  },
];

export const pastAppraisals: PastAppraisal[] = [
  {
    cycle: "Q1 2026 Review",
    period: "Jan – Mar 2026",
    finalScore: 83,
    rating: "Meets Expectations",
    dateCompleted: "15 Apr 2026",
  },
  {
    cycle: "Q4 2025 Review",
    period: "Oct – Dec 2025",
    finalScore: 87,
    rating: "Exceeds Expectations",
    dateCompleted: "20 Jan 2026",
  },
];
import { Section } from "@/types/employee/appraisal";

export const appraisalSections: Section[] = [
  {
    id: 1,
    title: "SECTION A",
    subtitle: "OBJECTIVE GOALS",
    color: "blue",
    weight: 60,
    objectives: [
      {
        id: 1,
        title: "Revenue & Business Growth",
        description: "Increase monthly revenue by 15%",
        weight: 20,
        target: 100,
        achievement: "",
        managerScore: 0,
        hrScore: 0,
        comment: "",
      },
      {
        id: 2,
        title: "Operational Excellence",
        description: "Improve operational efficiency",
        weight: 20,
        target: 100,
        achievement: "",
        managerScore: 0,
        hrScore: 0,
        comment: "",
      },
      {
        id: 3,
        title: "Employee Experience",
        description: "Improve employee satisfaction",
        weight: 20,
        target: 100,
        achievement: "",
        managerScore: 0,
        hrScore: 0,
        comment: "",
      },
    ],
  },

  {
    id: 2,
    title: "SECTION B",
    subtitle: "BEHAVIOURAL OBJECTIVES",
    color: "purple",
    weight: 20,
    objectives: [
      {
        id: 4,
        title: "Leadership",
        description: "Provide leadership",
        weight: 10,
        target: 100,
        achievement: "",
        managerScore: 0,
        hrScore: 0,
        comment: "",
      },
      {
        id: 5,
        title: "Collaboration",
        description: "Work with cross-functional teams",
        weight: 10,
        target: 100,
        achievement: "",
        managerScore: 0,
        hrScore: 0,
        comment: "",
      },
    ],
  },
];