// src/lib/modules.ts
import {
  Settings2,
  Users,
  DollarSign,
  Landmark,
  Globe,
  User,
} from "lucide-react";

export type ModuleId =
  | "admin-setup"
  | "hris"
  | "accounting"
  | "payroll"
  | "platform-admin"
  | "employee";

export type ModuleDef = {
  id: ModuleId;
  href: string;
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  constant?: boolean;
};

export const MODULES: ModuleDef[] = [
  {
    id: "admin-setup",
    href: "/tenant-admin/overview",
    name: "Admin Setup",
    subtitle: "Configure your workspace",
    description:
      "Set up your organization profile, departments, roles and permissions, staff management and system configuration.",
    tags: [
      "Organization Profile",
      "Departments & Teams",
      "Roles & Permissions",
      "Staff Management",
      "System Config",
    ],
    icon: Settings2,
    iconBg: "bg-[#EAF3FB]",
    iconColor: "text-[#2388D0]",
    constant: true,
  },
  {
    id: "hris",
    href: "/hris/overview",
    name: "HRIS",
    subtitle: "Human Resource Information System",
    description:
      "Manage your entire workforce — from employee records and attendance tracking to leave approvals, appraisals and conduct logs.",
    tags: [
      "Employee Directory",
      "Clock In / Clock Out",
      "Leave Management",
      "Appraisal Cycles",
      "Conduct Logs",
    ],
    icon: Users,
    iconBg: "bg-[#E9F7EF]",
    iconColor: "text-[#3AA76D]",
  },
  {
    id: "accounting",
    href: "/accounting/dashboard",
    name: "Accounting",
    subtitle: "Invoicing & financial management",
    description:
      "End-to-end invoicing, client and project management, VAT compliance, payment workflows, wallet and financial reporting.",
    tags: [
      "Invoices & Clients",
      "Payment Requests",
      "VAT / Tax Reporting",
      "Wallet & Disbursements",
      "Agent Invitations",
    ],
    icon: DollarSign,
    iconBg: "bg-[#FDF3DF]",
    iconColor: "text-[#C08B1E]",
  },
  {
    id: "payroll",
    href: "/payroll/overview",
    name: "Payroll",
    subtitle: "Salary, PAYE & pension",
    description:
      "Process payroll runs, manage salary structures, PAYE and pension compliance, generate payslips and handle loans.",
    tags: [
      "Payroll Runs",
      "Salary Structures",
      "PAYE & Pension",
      "Payslips",
      "Loans & Advances",
    ],
    icon: Landmark,
    iconBg: "bg-[#E7F1FB]",
    iconColor: "text-[#2388D0]",
  },
  {
    id: "platform-admin",
    href: "/platform-admin/overview",
    name: "Platform Admin",
    subtitle: "Sinkronis tenant management",
    description:
      "Manage all tenant companies on the Sinkronis platform — subscriptions, billing, module enablement, analytics and support.",
    tags: ["Tenants", "Billing & Revenue", "Pricing & Plans", "Analytics", "Support"],
    icon: Globe,
    iconBg: "bg-[#EFEAFB]",
    iconColor: "text-[#7C5CD1]",
  },
  {
    id: "employee",
    href: "/employee/dashboard",
    name: "Employee Portal",
    subtitle: "My workspace",
    description:
      "Your personal workspace — view your payslips, apply for leave, track attendance, complete appraisals and manage requests.",
    tags: ["My Profile", "My Attendance", "My Leave", "My Appraisal", "My Payslips"],
    icon: User,
    iconBg: "bg-[#E6F7F5]",
    iconColor: "text-[#1FA98D]",
    constant: true,
  },
];

export const CONSTANT_IDS = MODULES.filter((m) => m.constant).map((m) => m.id);