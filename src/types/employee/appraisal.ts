export type GoalStatus = "Completed" | "In Progress" | "Not Started";
export type AppraisalRating =
  | "Meets Expectations"
  | "Exceeds Expectations"
  | "Below Expectations";

export interface Goal {
  id: number;
  title: string;
  target: string;
  status: GoalStatus;
}

export interface PastAppraisal {
  cycle: string;
  period: string;
  finalScore: number;
  rating: AppraisalRating;
  dateCompleted: string;
}

export type Phase =
  | "Goal Setting"
  | "Self-Assessment"
  | "Manager Review"
  | "HR Approval"
  | "Acknowledgment";

// ── Mock data ──────────────────────────────────────────────────────────────

export const phases: Phase[] = [
  "Goal Setting",
  "Self-Assessment",
  "Manager Review",
  "HR Approval",
  "Acknowledgment",
];

export interface Objective {
  id: number;
  title: string;
  description: string;
  weight: number;
  target: number;
  achievement: string;
  managerScore: number;
  hrScore: number;
  comment: string;
}

export interface Section {
  id: number;
  title: string;
  subtitle: string;
  color: "blue" | "purple";
  weight: number;
  objectives: Objective[];
}
export const currentPhaseIndex = 1; // Self-Assessment