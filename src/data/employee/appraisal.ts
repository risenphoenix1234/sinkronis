import {
  BehaviourObjective,
  Employee,
  Signatory,
  Objective,
  ReflectionQuestion,
} from "@/types/employee/appraisal";

export const employee = {
  id: "EMP-001",

  name: "Amina Hassan",

  department: "Human Resources",

  supervisor: "Michael James",

  jobTitle: "HR Manager",

  employmentDate: "12 March 2022",

  reviewPeriod: "Q2 2026",

  businessUnit: "Corporate Services",

  employeeId: "EMP001",

  location: "Lagos",
};

export const objectives: Objective[] = [];

export const behaviourObjectives: BehaviourObjective[] = [
  {
    id: 1,
    objective: "Collaboration & Communication",
    wt: 28,
    keyResult: "Actively collaborate cross-functionally on shared goals",
    kpis: 10,
    target: 0,
    initiatives: "Bi-weekly cross-team syncs; shared project boards",
    q1Ach: 0,
    q1Percent: "",
    q2Ach: 0,
    q2Percent: "",
    comment: "",
  },
  {
    id: 1,
    objective: "",
    wt: 28,
    keyResult: "Share knowledge and mentor peers consistently",
    kpis: 10,
    target: 0,
    initiatives: "Monthly knowledge-sharing sessions",
    q1Ach: 0,
    q1Percent: 0,
    q2Ach: 0,
    q2Percent: 0,
    comment: "",
  },
  {
    id: 1,
    objective: "Leadership & Initiiatives",
    wt: 13,
    keyResult: "Proactively identify and resolve blockers without escalation",
    kpis: 10,
    target: 0,
    initiatives: "Bi-weekly cross-team syncs; shared project boards",
    q1Ach: 0,
    q1Percent: 0,
    q2Ach: 0,
    q2Percent: 0,
    comment: "",
  },
];

export const appraisalData = [
  {
    objective: "Revenue Growth",
    kpis: ["Increase recurring revenue", "Improve customer retention"],
    employeeRating: 4,
    employeeComment: "Exceeded target for the quarter.",
    managerRating: 4,
    managerComment: "Strong delivery and ownership.",
  },
  {
    objective: "Operational Efficiency",
    kpis: ["Reduce processing time", "Improve cross-team collaboration"],
    employeeRating: 3,
    employeeComment: "Need more consistency in execution.",
    managerRating: 3,
    managerComment: "Good progress but still some gaps.",
  },
];

export const reflectionQuestions = [
  {
    id: 1,
    title: "1. What were your biggest achievements this quarter?",
    description:
      "Describe your key accomplishments and their impact on the team or organisation….",
    answer: "",
  },
  {
    id: 2,
    title: "2. What challenges did you face and how did you overcome them?",
    description:
      "Describe specific obstacles and the steps you took to resolve them…",
    answer: "",
  },
  {
    id: 3,
    title: "3. What support or resources do you need from your manager?",
    description:
      "Be specific about what would help you perform better in the next period…",
    answer: "",
  },
  {
    id: 4,
    title: "4. Where do you want to grow professionally next quarter?",
    description:
      "Describe your development goals, skills to build, or experiences to gain…",
    answer: "",
  },
];

export const signatories: Signatory[] = [
  {
    name: "Amina Hassan",
    role: "Employee",
    signed: false,
  },
  {
    name: "Michael James",
    role: "Manager",
    signed: false,
  },
  {
    name: "Human Resources",
    role: "HR",
    signed: false,
  },
];
