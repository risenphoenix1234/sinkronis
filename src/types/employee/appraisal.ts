export type BadgeVariant = "success" | "warning" | "danger" | "info" | "gray";

export interface Employee {
  id: string;
  name: string;
  department: string;
  supervisor: string;
  jobTitle: string;
  employmentDate: string;
  reviewPeriod: string;

  businessUnit?: string;
  employeeId?: string;
  location?: string;
}

export interface Objective {
  id: number;
  objective: string;
  wt: string;
  keyResult: string;
  kpis: number;
  target: number;
  achieved?: number;
  weight?: number;
  selfRating?: number;
  initiatives?: number;
  q1Ach: number;
  q1Percent: number;
  q2Acgh: number;
  q2Percent: number;
  comment: string;
}

export const phases = [
  "Self-Assessment",
  "Manager Review",
  "HR Review",
  "Final Approval",
];

export const currentPhaseIndex = 0;

export interface BehaviourObjective {
  id: number;
  objective: string;
  wt: number;
  keyResult: string;
  kpis: number;
  target: number | string;
  initiatives: string;
  q1Ach: number | string;
  q1Percent: number | string;
  q2Ach: number | string;
  q2Percent: number | string;
  comment: string;
}

export interface ReflectionQuestion {
  id: number;
  title: string;
  description?: string;
  answer: string;
}
export interface Signatory {
  name: string;
  role: string;
  signed: boolean;
  signedDate?: string;
  comment?: string;
}
