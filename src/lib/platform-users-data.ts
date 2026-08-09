// src/lib/platform-users-data.ts
// Platform-wide user data — kept separate from pa-tenants-data.ts and platform-billing-data.ts.

export type UserStatus = "Active" | "Inactive";

export type ModuleName = "HRIS" | "Accounting" | "Payroll";

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  tenant: string;
  role: string;
  moduleAccess: ModuleName[];
  lastActive: string;
  status: UserStatus;
}

export const moduleStyles: Record<ModuleName, string> = {
  HRIS: "bg-blue-50 text-blue-700",
  Accounting: "bg-emerald-50 text-emerald-700",
  Payroll: "bg-purple-50 text-purple-700",
};

export const statusStyles: Record<UserStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-500",
};

export const allUsers: PlatformUser[] = [
  {
    id: "u1",
    name: "Amara Nwosu",
    email: "amara@bravogroup.ng",
    tenant: "Bravo Group",
    role: "HR Manager",
    moduleAccess: ["HRIS", "Payroll"],
    lastActive: "7 Jul 2026",
    status: "Active",
  },
  {
    id: "u2",
    name: "Chidi Okafor",
    email: "chidi@bravogroup.ng",
    tenant: "Bravo Group",
    role: "Finance Lead",
    moduleAccess: ["Accounting", "Payroll"],
    lastActive: "6 Jul 2026",
    status: "Active",
  },
  {
    id: "u3",
    name: "Kemi Bello",
    email: "kemi@bravogroup.ng",
    tenant: "Bravo Group",
    role: "Admin",
    moduleAccess: ["HRIS", "Accounting", "Payroll"],
    lastActive: "7 Jul 2026",
    status: "Active",
  },
  {
    id: "u4",
    name: "Dayo Adebayo",
    email: "dayo@kainostech.ng",
    tenant: "Kainos Technologies",
    role: "CTO",
    moduleAccess: ["HRIS", "Accounting", "Payroll"],
    lastActive: "6 Jul 2026",
    status: "Active",
  },
  {
    id: "u5",
    name: "Fatima Garba",
    email: "fatima@kainostech.ng",
    tenant: "Kainos Technologies",
    role: "HR Manager",
    moduleAccess: ["HRIS"],
    lastActive: "7 Jul 2026",
    status: "Active",
  },
  {
    id: "u6",
    name: "Tope Olajide",
    email: "tope@kainostech.ng",
    tenant: "Kainos Technologies",
    role: "Accountant",
    moduleAccess: ["Accounting"],
    lastActive: "5 Jul 2026",
    status: "Active",
  },
  {
    id: "u7",
    name: "Ngozi Eze",
    email: "ngozi@zenithventures.ng",
    tenant: "Zenith Ventures",
    role: "Admin",
    moduleAccess: ["HRIS"],
    lastActive: "5 Jul 2026",
    status: "Active",
  },
  {
    id: "u8",
    name: "Sola Adeyemi",
    email: "sola@zenithventures.ng",
    tenant: "Zenith Ventures",
    role: "Employee",
    moduleAccess: ["HRIS"],
    lastActive: "1 Jul 2026",
    status: "Inactive",
  },
  {
    id: "u9",
    name: "Emeka Dibia",
    email: "emeka@pinnaclefoods.ng",
    tenant: "Pinnacle Foods",
    role: "HR Manager",
    moduleAccess: ["HRIS", "Payroll"],
    lastActive: "7 Jul 2026",
    status: "Active",
  },
  {
    id: "u10",
    name: "Adesola Williams",
    email: "adesola@novahealthcare.ng",
    tenant: "Nova Healthcare",
    role: "Admin",
    moduleAccess: ["HRIS", "Accounting", "Payroll"],
    lastActive: "7 Jul 2026",
    status: "Active",
  },
];