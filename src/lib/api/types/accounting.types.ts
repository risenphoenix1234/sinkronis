// src/lib/api/types/accounting.types.ts
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

export type InvoiceStatus = "DRAFT" | "SENT" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "VOID";

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
  status: InvoiceStatus;
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

export interface AgentSummary {
  totalAgents: number;
  active: number;
  pendingInvites: number;
  inactive: number;
}

export interface AgentListItem {
  id: string;
  agentId: string | null;
  userId: string | null;
  name: string;
  email: string;
  phone: string | null;
  role: { id: string; name: string } | null;
  invoiceCount: number;
  projectCount: number;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  invitedAt: string;
  createdAt: string;
}

export interface AgentsListResponse {
  success: boolean;
  message: string;
  data: {
    summary: AgentSummary;
    agents: AgentListItem[];
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

export interface InviteAgentPayload {
  fullName: string;
  email: string;
  phone?: string;
  roleId: string;
}

export interface InviteAgentResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    agentId: string;
    email: string;
    expiresAt: string;
    deliveryStatus: string;
  };
}

export interface InviteAgentsBulkPayload {
  entries: string;
  roleId: string;
}

export interface BulkInviteResultItem {
  email: string;
  reason?: string;
}

export interface InviteAgentsBulkResponse {
  success: boolean;
  message: string;
  data: {
    invited: BulkInviteResultItem[];
    skipped: BulkInviteResultItem[];
    failed: BulkInviteResultItem[];
  };
}

export interface UpdateAgentPayload {
  fullName?: string;
  phone?: string | null;
  roleId?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface UpdateAgentResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    organizationId: string;
    userId: string;
    reference: string;
    phone: string | null;
    status: "ACTIVE" | "INACTIVE";
    invitedAt: string;
    deactivatedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AdminRole {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  isSystem: boolean;
  canModify: boolean;
  canDelete: boolean;
  lockedReason: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
}

export interface PaymentRequestSummary {
  pendingApproval: number;
  totalCompleted: number;
  declined: number;
}

export interface PaymentRequestBankDetails {
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
}

export interface PaymentRequestPerson {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface PaymentRequestItem {
  id: string;
  organizationId: string;
  title: string;
  vendorName: string | null;
  amount: number;
  currency: string;
  status: "PENDING" | "APPROVED" | "COMPLETED" | "DECLINED";
  requestedBy: string;
  approvedBy: string | null;
  approvedAt: string | null;
  invoiceId: string | null;
  projectId: string | null;
  clientId: string | null;
  requesterUserId: string;
  description: string | null;
  decisionReason: string | null;
  declinedBy: string | null;
  declinedAt: string | null;
  disbursementReference: string | null;
  disbursedAt: string | null;
  createdAt: string;
  updatedAt: string;
    requester: PaymentRequestPerson;
  bankDetails: PaymentRequestBankDetails;
  canApprove?: boolean;
  canReject?: boolean;
  canInitiatePayment?: boolean;
  approvalBlockedReason?: string | null;
  requiresIndependentApprover?: boolean;
}

export interface PaymentRequestsListResponse {
  success: boolean;
  message: string;
  data: {
    summary: PaymentRequestSummary;
    requests: PaymentRequestItem[];
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

export interface CreatePaymentRequestPayload {
  title: string;
  description?: string;
  amount: string;
}

export interface PaymentRequestResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    title: string;
    amount: string;
    currency: string;
    status: string;
  };
}

export interface ExpenseUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ExpenseItem {
  id: string;
  reference: string;
  expenseDate: string;
  category: string;
  categoryId: string | null;
  description: string;
  amount: number;
  receiptReference: string | null;
  status: "ACTIVE" | "VOID";
  loggedByUserId: string;
  loggedBy: ExpenseUser;
  voidedAt: string | null;
  voidedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpensesTopCategory {
  category: string;
  amount: number;
}

export interface ExpensesSummary {
  totalExpenses: number;
  thisMonth: number;
  totalEntries: number;
  topCategory: ExpensesTopCategory | null;
}

export interface ExpensesListResponse {
  success: boolean;
  message: string;
  data: {
    summary: ExpensesSummary;
    expenses: ExpenseItem[];
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

export interface CreateExpensePayload {
  category: string;
  description: string;
  amount: string;
  expenseDate: string;
  receiptReference?: string;
}

export type UpdateExpensePayload = Partial<CreateExpensePayload>;

export interface ExpenseResponse {
  success: boolean;
  message: string;
  data: ExpenseItem;
}

export interface ExpenseCategory {
  id: string;
  organizationId: string;
  reference: string;
  name: string;
  normalizedName: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseCategoriesListResponse {
  success: boolean;
  message: string;
  data: ExpenseCategory[];
}

export interface CreateExpenseCategoryPayload {
  name: string;
  description?: string;
}

export interface ExpenseCategoryResponse {
  success: boolean;
  message: string;
  data: ExpenseCategory;
}

export interface WalletAccountSummaryRef {
  id: string;
  name: string;
  currency: string;
  balance: number;
}

export interface WalletSummary {
  availableBalance: number;
  totalInflow: number;
  totalOutflow: number;
  transactionCount: number;
  wallets: WalletAccountSummaryRef[];
}

export interface WalletSummaryResponse {
  success: boolean;
  message: string;
  data: WalletSummary;
}

export interface WalletAccount {
  id: string;
  organizationId: string;
  name: string;
  balance: number;
  reservedBalance: number;
  currency: string;
  purpose: string;
  createdAt: string;
  updatedAt: string;
  spendableBalance: number;
}

export interface CreateWalletAccountPayload {
  name: string;
}

export interface WalletAccountResponse {
  success: boolean;
  message: string;
  data: WalletAccount;
}

export interface WalletTransactionItem {
  id: string;
  organizationId: string;
  walletAccountId: string;
  payrollRunId: string | null;
  taxRemittanceId: string | null;
  type: "MANUAL_FUNDING" | "WALLET_FUNDING" | string;
  direction: "CREDIT" | "DEBIT";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reference: string;
  transferReference: string | null;
  description: string | null;
  sourceType: "MANUAL_FUNDING" | "PAYSTACK_FUNDING" | string;
  sourceId: string | null;
  reversalOfId: string | null;
  createdById: string;
  createdAt: string;
}

export interface WalletTransactionsListResponse {
  success: boolean;
  message: string;
  data: {
    transactions: WalletTransactionItem[];
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

export interface ManualFundingPayload {
  walletAccountId: string;
  amount: string;
  externalReference: string;
  description?: string;
}

export interface ManualFundingResponse {
  success: boolean;
  message: string;
  data: WalletTransactionItem;
}

export interface PaystackInitializePayload {
  walletAccountId: string;
  amount: string;
}

export interface PaystackInitializeResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    provider: string;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    authorizationUrl: string;
    accessCode: string;
  };
}

export interface PaystackVerifyResponse {
  success: boolean;
  message: string;
  data: {
    reference: string;
    status: "PENDING" | "COMPLETED" | "FAILED";
    amount: number;
    currency: string;
    transactionId: string;
    idempotentReplay: boolean;
  };
}

export interface WalletReceiptResponse {
  success: boolean;
  message: string;
  data: WalletTransactionItem & {
    wallet: { name: string; currency: string };
  };
}

export interface ReportSummary {
  totalRevenue: number;
  outstanding: number;
  overdue: number;
  vatCollected: number;
  totalExpenses: number;
  netProfit: number;
}

export interface ReportGroup {
  id: string;
  name: string;
  invoiceCount: number;
  invoiceValue: number;
  revenuePaid: number;
  outstanding: number;
  vatCharged: number;
}

export interface ReportPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AccountingReportResponse {
  success: boolean;
  message: string;
  data: {
    appliedFilters: Record<string, unknown>;
    summary: ReportSummary;
    groups?: ReportGroup[];
    invoices: Invoice[];
    pagination: ReportPagination;
  };
}

export interface ReportFilters {
  clientId?: string;
  agentId?: string;
  itemServiceId?: string;
  projectId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export type ReportGroupBy = "CLIENT" | "AGENT" | "PROJECT";

export type ReportSortBy = "issueDate" | "dueDate" | "total" | "createdAt" | "status";

export interface ReportQuery extends ReportFilters {
  groupBy?: ReportGroupBy;
  page?: number;
  limit?: number;
  sortBy?: ReportSortBy;
  sortOrder?: "asc" | "desc";
}

export type ReportEntityKind = "client" | "agent" | "project";

export type DrillEntry = ReportGroup;

export interface EntityDetail {
  id: string;
  name: string;
  summary: ReportSummary;
  invoices: Invoice[];
  pagination: ReportPagination;
}

export interface InvoiceTemplate {
  id: string;
  organizationId: string;
  name: string;
  normalizedName: string;
  paymentTerms: string | null;
  headerNote: string | null;
  footerNote: string | null;
  isDefault: boolean;
  defaultKey: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceTemplatePayload {
  name: string;
  paymentTerms?: string;
  headerNote?: string;
  footerNote?: string;
}

export interface ReminderSettings {
  automaticRemindersEnabled: boolean;
  firstReminderDaysBeforeDue: number;
  overdueReminderFrequency: "EVERY_3_DAYS" | "EVERY_7_DAYS" | "EVERY_14_DAYS" | string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
}


 canApprove?: boolean;
  canReject?: boolean;
  canInitiatePayment?: boolean;
  approvalBlockedReason?: string | null;
  requiresIndependentApprover?: boolean;
 