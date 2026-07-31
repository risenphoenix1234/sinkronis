// lib/reports-data.ts
export type InvoiceRow = {
  id: string;
  client: string;
  agent: string;
  project: string;
  itemsServices: string;
  subtotal: number;
  vat: number;
  total: number;
  status: "Paid" | "Sent" | "Overdue" | "Draft";
  issueDate: string;
};

export const statusStyles: Record<InvoiceRow["status"], string> = {
  Paid: "bg-emerald-50 text-emerald-700",
  Sent: "bg-sky-50 text-sky-700",
  Overdue: "bg-rose-50 text-rose-600",
  Draft: "bg-slate-100 text-slate-500",
};

export const naira = (n: number) => `₦${n.toLocaleString()}`;

export const allInvoices: InvoiceRow[] = [
  { id: "INV-001", client: "Zenith Technologies Ltd", agent: "Emeka Okafor", project: "Zenith HRIS Deployment", itemsServices: "HR Software License +1 more", subtotal: 490000, vat: 36750, total: 526750, status: "Paid", issueDate: "01 Apr 2026" },
  { id: "INV-002", client: "Prestige Global Services", agent: "Sade Williams", project: "Prestige Payroll Setup", itemsServices: "Payroll Processing +1 more", subtotal: 14500, vat: 750, total: 15250, status: "Sent", issueDate: "05 May 2026" },
  { id: "INV-003", client: "BlueStar Logistics", agent: "Emeka Okafor", project: "BlueStar Annual Contract", itemsServices: "Annual Maintenance", subtotal: 120000, vat: 9000, total: 129000, status: "Overdue", issueDate: "01 Apr 2026" },
  { id: "INV-004", client: "Zenith Technologies Ltd", agent: "Emeka Okafor", project: "Zenith HRIS Deployment", itemsServices: "HR Software License", subtotal: 80000, vat: 6000, total: 86000, status: "Draft", issueDate: "14 May 2026" },
];

export type EntityType = "client" | "agent" | "project";

export type EntityDetail = {
  type: EntityType;
  slug: string;
  name: string;
  status: "Active" | "Inactive";
  meta: { label: string; value: string }[];
  invitedOrStarted: string;
};

export const entityDirectory: Record<EntityType, EntityDetail[]> = {
  client: [
    {
      type: "client",
      slug: "zenith-technologies",
      name: "Zenith Technologies Ltd",
      status: "Active",
      meta: [
        { label: "Contact", value: "Mr. Chidi Obi" },
        { label: "Email", value: "finance@zenithtechng.com" },
        { label: "Phone", value: "07012345678" },
        { label: "TIN", value: "12345678-0001" },
      ],
      invitedOrStarted: "Client since 10 Jan 2026",
    },
    {
      type: "client",
      slug: "bluestar-logistics",
      name: "BlueStar Logistics",
      status: "Active",
      meta: [
        { label: "Contact", value: "Mrs. Funmi Adeyemi" },
        { label: "Email", value: "accounts@bluestarlogistics.com" },
        { label: "Phone", value: "08023456789" },
        { label: "TIN", value: "23456789-0001" },
      ],
      invitedOrStarted: "Client since 14 Feb 2026",
    },
    {
      type: "client",
      slug: "prestige-global-services",
      name: "Prestige Global Services",
      status: "Active",
      meta: [
        { label: "Contact", value: "Mr. Tunde Bakare" },
        { label: "Email", value: "billing@prestigegs.com" },
        { label: "Phone", value: "09034567890" },
        { label: "TIN", value: "34567890-0001" },
      ],
      invitedOrStarted: "Client since 02 May 2026",
    },
  ],
  agent: [
    {
      type: "agent",
      slug: "emeka-okafor",
      name: "Emeka Okafor",
      status: "Active",
      meta: [
        { label: "Role", value: "Senior Sales Agent" },
        { label: "Email", value: "emeka.okafor@company.com" },
        { label: "Phone", value: "08011223344" },
        { label: "Invited", value: "10 Jan 2026" },
      ],
      invitedOrStarted: "Invited 10 Jan 2026",
    },
    {
      type: "agent",
      slug: "sade-williams",
      name: "Sade Williams",
      status: "Active",
      meta: [
        { label: "Role", value: "Sales Agent" },
        { label: "Email", value: "sade.williams@company.com" },
        { label: "Phone", value: "08099887766" },
        { label: "Invited", value: "22 Feb 2026" },
      ],
      invitedOrStarted: "Invited 22 Feb 2026",
    },
  ],
  project: [
    {
      type: "project",
      slug: "zenith-hris-deployment",
      name: "Zenith HRIS Deployment",
      status: "Active",
      meta: [
        { label: "Client", value: "Zenith Technologies Ltd" },
        { label: "Agent", value: "Emeka Okafor" },
        { label: "Start", value: "01 Feb 2026" },
        { label: "End", value: "30 Jul 2026" },
      ],
      invitedOrStarted: "Started 01 Feb 2026",
    },
    {
      type: "project",
      slug: "bluestar-annual-contract",
      name: "BlueStar Annual Contract",
      status: "Active",
      meta: [
        { label: "Client", value: "BlueStar Logistics" },
        { label: "Agent", value: "Emeka Okafor" },
        { label: "Start", value: "01 Apr 2026" },
        { label: "End", value: "31 Mar 2027" },
      ],
      invitedOrStarted: "Started 01 Apr 2026",
    },
    {
      type: "project",
      slug: "prestige-payroll-setup",
      name: "Prestige Payroll Setup",
      status: "Active",
      meta: [
        { label: "Client", value: "Prestige Global Services" },
        { label: "Agent", value: "Sade Williams" },
        { label: "Start", value: "05 May 2026" },
        { label: "End", value: "05 Aug 2026" },
      ],
      invitedOrStarted: "Started 05 May 2026",
    },
  ],
};

export function getEntity(type: EntityType, slug: string) {
  return entityDirectory[type].find((e) => e.slug === slug) ?? null;
}

export function getInvoicesForEntity(detail: EntityDetail): InvoiceRow[] {
  return allInvoices.filter((inv) => {
    if (detail.type === "client") return inv.client === detail.name;
    if (detail.type === "agent") return inv.agent === detail.name;
    return inv.project === detail.name;
  });
}