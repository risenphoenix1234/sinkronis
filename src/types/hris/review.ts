// types/review.ts

export interface Review {
  id: number;
  initials: string;
  name: string;
  role: string;
  department: string;
  cycle: string;
  status:
    | "Acknowledged"
    | "Pending HR Approval"
    | "Under Manager Review"
    | "Self-Assessment Submitted"
    | "Goals Proposed"
    | "Not Started";
  score?: string;
  rating?: string;
  action: string;
}