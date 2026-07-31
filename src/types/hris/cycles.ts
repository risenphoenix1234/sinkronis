// types/cycle.ts

export interface AppraisalCycle {
  id: number;
  title: string;
  status: "Active" | "Completed";
  template: string;
  description: string;
  duration: string;
  progress?: number;
  acknowledged?: string;
}