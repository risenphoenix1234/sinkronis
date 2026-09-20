import {
  BehaviourObjective,
  Employee,
  Goal,
  Objective,
  PastAppraisal,
  ReflectionQuestion,
  Section,
} from "@/types/employee/appraisal";

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

export interface AppraisalItem {
  objective: string;
  kpis: string[];
  employeeRating: number;
  employeeComment: string;
  managerRating: number;
  managerComment: string;
}

export const employee: Employee = {
  id: "EMP-001",
  name: "Amara Nwosu",
  department: "Product Engineering",
  supervisor: "Tunde Bakare",
  jobTitle: "Senior Frontend Engineer",
  employmentDate: "15 Jan 2023",
  reviewPeriod: "Q2 2026 (Apr – Jun)",
  businessUnit: "Technology",
  employeeId: "SNK-2023-014",
  location: "Lagos, Nigeria",
};

export const objectives: Objective[] = [
  {
    id: 1,
    objective: "Revenue & Business Growth",
    wt: "20%",
    weight: 20,
    keyResult: "Deliver high-conversion checkout flows",
    kpis: 95,
    target: 100,
    achieved: 92,
    selfRating: 4,
    initiatives: 3,
    q1Ach: 90,
    q1Percent: 90,
    q2Acgh: 94,
    q2Percent: 94,
    comment: "Delivered on schedule with positive feedback.",
  },
  {
    id: 2,
    objective: "Operational Excellence",
    wt: "20%",
    weight: 20,
    keyResult: "Reduce build & load times by 25%",
    kpis: 85,
    target: 100,
    achieved: 88,
    selfRating: 4,
    initiatives: 2,
    q1Ach: 80,
    q1Percent: 80,
    q2Acgh: 96,
    q2Percent: 96,
    comment: "Optimized bundle sizes and caching.",
  },
  {
    id: 3,
    objective: "Employee Experience",
    wt: "20%",
    weight: 20,
    keyResult: "Mentor junior frontend engineers",
    kpis: 90,
    target: 100,
    achieved: 95,
    selfRating: 5,
    initiatives: 4,
    q1Ach: 90,
    q1Percent: 90,
    q2Acgh: 100,
    q2Percent: 100,
    comment: "Conducted weekly pair programming sessions.",
  },
];

export const behaviourObjectives: BehaviourObjective[] = [
  {
    id: 1,
    objective: "Leadership & Initiative",
    wt: 10,
    keyResult: "Proactive problem solving and team alignment",
    kpis: 90,
    target: 100,
    initiatives: "Led sprint design review",
    q1Ach: 85,
    q1Percent: 85,
    q2Ach: 95,
    q2Percent: 95,
    comment: "Consistently demonstrates strong ownership.",
  },
  {
    id: 2,
    objective: "Collaboration & Teamwork",
    wt: 10,
    keyResult: "Cross-functional cooperation with product & QA",
    kpis: 95,
    target: 100,
    initiatives: "Streamlined QA handoff process",
    q1Ach: 90,
    q1Percent: 90,
    q2Ach: 100,
    q2Percent: 100,
    comment: "Excellent communication across teams.",
  },
];

export const reflectionQuestions: ReflectionQuestion[] = [
  {
    id: 1,
    title: "What were your most significant accomplishments this cycle?",
    description: "Highlight key milestones and impact delivered.",
    answer: "Successfully led the frontend migration to App Router and optimized load speeds.",
  },
  {
    id: 2,
    title: "What challenges did you encounter and how did you overcome them?",
    description: "Describe obstacles and resolution strategies.",
    answer: "Cross-team API delays were mitigated by creating strict mock contracts and parallelizing work.",
  },
  {
    id: 3,
    title: "What are your primary growth goals for the next quarter?",
    description: "Outline technical and leadership areas you wish to develop.",
    answer: "Deepen expertise in cloud architectures and mentor upcoming associate developers.",
  },
];

export interface AppraisalItem {
  objective: string;
  kpis: string[];
  employeeRating: number;
  employeeComment: string;
  managerRating: number;
  managerComment: string;
}

export const appraisalData: AppraisalItem[] = [
  {
    objective: "Revenue & Business Growth",
    kpis: [
      "Increase monthly revenue by 15%",
      "Close at least 5 new enterprise deals",
    ],
    employeeRating: 4,
    employeeComment: "Hit the revenue target two months early.",
    managerRating: 4,
    managerComment: "Strong quarter, exceeded expectations on new deals.",
  },
  {
    objective: "Operational Excellence",
    kpis: [
      "Reduce process turnaround time by 20%",
      "Document all SOPs for the team",
    ],
    employeeRating: 3,
    employeeComment: "Completed most SOPs, still refining turnaround time.",
    managerRating: 3,
    managerComment: "Good progress, needs to finish remaining documentation.",
  },
];