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

export type KeyResult = {
  id: number;
  description: string;
  weight: string;
  target: string;
  initiatives: string;
};

export type Objective = {
  id: number;
  name: string;
  weight: string;
  keyResults: KeyResult[];
};

export type Category = {
  name: string;
  weight: string;
  purple?: boolean;
};

export type Template = {
  name: string;
  description: string;
  objectives: string;
  behaviours: string;
  categories: Category[];
  default?: boolean;
};

export type Employee = {
  name: string;
  role: string;
  department: string;
  supervisorName: string;
  supervisorRole: string;
  startDate: string;
};
