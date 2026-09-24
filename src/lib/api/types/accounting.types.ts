export interface AccountingSummary {
  totalRevenue: number;
  outstanding: number;
  overdueAmount: number;
  walletBalance: number;
  pendingApprovals: number;
  vatCollected: number;
}

export interface AccountingAlert {
  id: string;
  type: string;
  message: string;
  severity: string;
}

export interface InvoiceStatusCounts {
  paid: number;
  sent: number;
  overdue: number;
  draft: number;
}

export interface RecentInvoiceItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: "PAID" | "SENT" | "OVERDUE" | "DRAFT";
}

export interface RecentWalletActivityItem {
  id: string;
  description: string;
  reference: string;
  timestamp: string;
  amount: number;
  direction: "CREDIT" | "DEBIT";
}

export interface PaymentRequestSummaryItem {
  id: string;
  requestedBy: string;
  invoiceReference: string;
  amount: number;
  status: string;
}

export interface AccountingDashboardResponse {
  success: boolean;
  message: string;
  data: {
    summary: AccountingSummary;
    alerts: AccountingAlert[];
    invoiceStatus: InvoiceStatusCounts;
    recentInvoices: RecentInvoiceItem[];
    recentWalletActivity: RecentWalletActivityItem[];
    paymentRequests: PaymentRequestSummaryItem[];
  };
}
export interface CustomerSummary {
  totalCustomers: number;
  activeCustomers: number;
}

export interface Customer {
  id: string;
  companyName: string;
  taxId: string | null;
  contactPerson: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export interface CustomersListResponse {
  success: boolean;
  message: string;
  data: {
    summary: CustomerSummary;
    customers: Customer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface CreateCustomerPayload {
  companyName: string;
  taxId?: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateCustomerPayload {
  companyName?: string;
  taxId?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
}

export interface Customer {
  id: string;
  customerId: string;
  companyName: string;
  taxId: string | null;
  contactPerson: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  status: "ACTIVE" | "INACTIVE";
  since: string;
  invoiceCount: number;
  projectCount: number;
}

export interface CustomerFinancialSummary {
  totalBilled: number;
  totalPaid: number;
  invoiceCount: number;
  overdueCount: number;
  projectCount: number;
}

export interface CustomerInvoiceSummary {
  id: string;
  invoiceNumber: string;
  projectName: string | null;
  agentName: string | null;
  issueDate: string;
  dueDate: string;
  total: number;
  status: "PAID" | "SENT" | "OVERDUE" | "DRAFT";
}

export interface CustomerProjectSummary {
  id: string;
  name: string;
  status: string;
}

export interface CustomerPaymentHistoryItem {
  id: string;
  invoiceNumber: string;
  amount: number;
  paidAt: string;
  method: string;
}

export interface CustomerDetail {
  id: string;
  customerId: string;
  companyName: string;
  status: "ACTIVE" | "INACTIVE";
  email: string;
  taxId: string | null;
  customerSince: string;
  contactPerson: string | null;
  phone: string | null;
  address: string | null;
  financialSummary: CustomerFinancialSummary;
  invoices: CustomerInvoiceSummary[];
  projects: CustomerProjectSummary[];
  paymentHistory: CustomerPaymentHistoryItem[];
}

export interface CustomerDetailResponse {
  success: boolean;
  message: string;
  data: CustomerDetail;
}

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  agentName: string | null;
  projectName: string | null;
  subtotal: number;
  vatAmount: number;
  total: number;
  issueDate: string;
  dueDate: string;
  status: "PAID" | "SENT" | "OVERDUE" | "DRAFT";
}

export interface InvoicesListResponse {
  success: boolean;
  message: string;
  data: {
    invoices: InvoiceListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}
export interface CreateInvoiceLineItem {
  catalogueItemId: string;
  quantity: string;
}

export interface CreateInvoicePayload {
  clientId: string;
  assignedAgentId?: string;
  projectId?: string;
  dueDate: string;
  notes?: string;
  whtApplicable?: boolean;
  whtRate?: 5 | 10;
  items: CreateInvoiceLineItem[];
}
export interface CatalogueItem {
  id: string;
  itemCode: string;
  name: string;
  type: "ITEM" | "PRODUCT" | "SERVICE";
  unitPrice: number;
  unit: string;
  description: string | null;
  vatApplicable: boolean;
  status: "ACTIVE" | "INACTIVE";
}

export interface CatalogueItemsResponse {
  success: boolean;
  message: string;
  data: {
    items: CatalogueItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface CreateCatalogueItemPayload {
  name: string;
  type: "ITEM" | "PRODUCT" | "SERVICE";
  unitPrice: string;
  unit: string;
  description?: string;
  vatApplicable?: boolean;
}

export interface CatalogueItemResponse {
  success: boolean;
  message: string;
  data: CatalogueItem;
}

export interface ProjectSummary {
  totalProjects: number;
  activeProjects: number;
}

export interface ProjectListItem {
  id: string;
  projectId: string;
  name: string;
  clientName: string;
  agentName: string | null;
  value: number;
  startDate: string;
  endDate: string | null;
  status: "ACTIVE" | "ON_HOLD" | "COMPLETED";
}

export interface ProjectsListResponse {
  success: boolean;
  message: string;
  data: {
    summary: ProjectSummary;
    projects: ProjectListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface CreateProjectPayload {
  name: string;
  clientId: string;
  value: string;
  startDate: string;
  assignedAgentId?: string;
  endDate?: string;
  status?: "ACTIVE" | "ON_HOLD" | "COMPLETED";
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: ProjectListItem;
}

export interface InvoiceClientRef {
  id: string;
  reference: string;
  name: string;
  email: string;
  taxId: string | null;
}

export interface InvoiceProjectRef {
  id: string;
  reference: string;
  name: string;
  clientId: string;
}

export interface InvoiceAgentRef {
  id: string;
  reference: string;
  name: string;
}

export interface InvoiceCatalogueItemRef {
  reference: string;
  name: string;
  unit: string;
}

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  catalogueItemId: string;
  lineSubtotal: number;
  vatApplicable: boolean;
  vatRate: number;
  vatAmount: number;
  catalogueItem: InvoiceCatalogueItemRef;
}

export interface InvoiceStatusHistoryItem {
  id: string;
  status: string;
  description: string;
  actorUserId: string;
  createdAt: string;
  actor: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface InvoiceAllowedActions {
  edit: boolean;
  send: boolean;
  recordPayment: boolean;
  delete: boolean;
}

export interface Invoice {
  id: string;
  organizationId: string;
  clientId: string;
  invoiceNo: string;
  issueDate: string;
  dueDate: string;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE";
  subtotal: number;
  taxAmount: string;
  total: number;
  whtApplicable: boolean;
  whtRate: number | null;
  whtAmount: number;
  amountPayable: number;
  notes: string | null;
  projectId: string | null;
  assignedAgentId: string | null;
  sentAt: string | null;
  paidAt: string | null;
  voidedAt: string | null;
  paymentReference: string | null;
  createdAt: string;
  updatedAt: string;
  client: InvoiceClientRef;
  project: InvoiceProjectRef | null;
  assignedAgent: InvoiceAgentRef | null;
  items: InvoiceLineItem[];
  payments: unknown[];
  paymentRequests: unknown[];
  statusHistory: InvoiceStatusHistoryItem[];
  vat: number;
  paidAmount: number;
  balanceDue: number;
  allowedActions: InvoiceAllowedActions;
}

export interface InvoicesListResponse {
  success: boolean;
  message: string;
  data: {
    invoices: Invoice[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface CreateInvoiceLineItem {
  catalogueItemId: string;
  quantity: string;
}

export interface CreateInvoicePayload {
  clientId: string;
  assignedAgentId?: string;
  projectId?: string;
  dueDate: string;
  notes?: string;
  whtApplicable?: boolean;
  whtRate?: 5 | 10;
  items: CreateInvoiceLineItem[];
}

export interface InvoiceResponse {
  success: boolean;
  message: string;
  data: Invoice;
}