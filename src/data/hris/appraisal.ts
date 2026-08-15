import {
  Employee,
  KeyResult,
  Objective,
  Template,
} from "@/types/hris/appraisal";

export const quarters = ["Q1", "Q2", "Q3", "Q4"];

export const createKeyResult = (): KeyResult => ({
  id: Date.now(),
  description: "",
  weight: "0",
  target: "",
  initiatives: "",
});

export const createObjective = (): Objective => ({
  id: Date.now(),
  name: "",
  weight: "0",
  keyResults: [createKeyResult()],
});

export const ratingScale = [
  {
    rating: "5",
    title: "Outstanding",
    range: ">121%",
    background: "bg-green-100",
    text: "text-green-700",
  },
  {
    rating: "4",
    title: "Above Expectation",
    range: "101–120%",
    background: "bg-blue-100",
    text: "text-blue-700",
  },
  {
    rating: "3",
    title: "Meets Expectation",
    range: "80–100%",
    background: "bg-gray-100",
    text: "text-gray-600",
  },
  {
    rating: "2",
    title: "Below Expectation",
    range: "60–79%",
    background: "bg-yellow-100",
    text: "text-yellow-700",
  },
  {
    rating: "1",
    title: "Poor Performance",
    range: "0–59%",
    background: "bg-red-100",
    text: "text-red-600",
  },
];

export const templates: Template[] = [
  {
    name: "Standard Performance Review",
    description: "General-purpose OKR/KRA template suitable for all roles.",
    objectives: "A: 3 objectives • 6 KRs",
    behaviours: "B: 2 behavioural • 3 KRs",
    default: true,
    categories: [
      {
        name: "Revenue & Business Growth",
        weight: "30%",
      },
      {
        name: "Operational Excellence",
        weight: "30%",
      },
      {
        name: "Customer & Stakeholder Experience",
        weight: "20%",
      },
      {
        name: "Collaboration & Communication",
        weight: "15%",
        purple: true,
      },
      {
        name: "Leadership & Initiative",
        weight: "5%",
        purple: true,
      },
    ],
  },
  {
    name: "Technical / Engineering Review",
    description:
      "OKR/KRA template tailored for engineering roles with delivery, quality, and reliability focus.",
    objectives: "A: 3 objectives • 5 KRs",
    behaviours: "B: 1 behavioural • 2 KRs",
    categories: [
      {
        name: "Technical Delivery & Quality",
        weight: "40%",
      },
      {
        name: "System Reliability & Performance",
        weight: "30%",
      },
      {
        name: "Engineering Culture & Growth",
        weight: "10%",
      },
      {
        name: "Engineering Collaboration",
        weight: "20%",
        purple: true,
      },
    ],
  },
];

export const employee: Employee = {
  name: "Amara Nwosu",
  role: "HR Manager",
  department: "Human Resources",
  supervisorName: "Chukwuemeka Obi",
  supervisorRole: "Chief People Officer",
  startDate: "12 March 2022",
};
