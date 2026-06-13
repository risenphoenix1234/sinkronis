export interface DepartmentHeadcount {
  id: string;
  name: string;
  count: number;
  percent: number;
}

export const departments: DepartmentHeadcount[] = [
  {
    id: '1',
    name: 'Human Resources',
    count: 18,
    percent: 25,
  },
  {
    id: '2',
    name: 'Finance',
    count: 34,
    percent: 40,
  },
  {
    id: '3',
    name: 'Operations',
    count: 62,
    percent: 75,
  },
  {
    id: '4',
    name: 'Sales & Marketing',
    count: 48,
    percent: 60,
  },
  {
    id: '5',
    name: 'IT & Technology',
    count: 41,
    percent: 55,
  },
  {
    id: '6',
    name: 'Legal & Compliance',
    count: 15,
    percent: 20,
  },
];

export interface LeaveRequest {
  id: string;
  employee: string;
  department: string;
  type: string;
  days: number;
  from: string;
}

export const requests: LeaveRequest[] = [
  {
    id: '1',
    employee: 'Amara Okafor',
    department: 'Human Resources',
    type: 'Annual Leave',
    days: 5,
    from: '20 May 2026',
  },
  {
    id: '2',
    employee: 'Chukwuemeka Adeyemi',
    department: 'Finance',
    type: 'Sick Leave',
    days: 2,
    from: '15 May 2026',
  },
   {
    id: '2',
    employee: 'Emmanuel Adeyemi',
    department: 'Finance',
    type: 'Sick Leave',
    days: 2,
    from: '15 May 2026',
  },
   {
    id: '2',
    employee: 'Chukwuebuka Adebisi',
    department: 'Finance',
    type: 'Sick Leave',
    days: 2,
    from: '15 May 2026',
  },
   {
    id: '2',
    employee: 'Dos Miguel',
    department: 'Finance',
    type: 'Sick Leave',
    days: 2,
    from: '15 May 2026',
  },
   {
    id: '2',
    employee: 'Carlos Fenandes',
    department: 'Finance',
    type: 'Sick Leave',
    days: 2,
    from: '15 May 2026',
  },
];


