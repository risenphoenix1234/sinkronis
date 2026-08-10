// src/lib/platform-settings-data.ts
// Platform Settings data — kept separate from other platform-admin data files.

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export const initialFeatureFlags: FeatureFlag[] = [
  {
    id: "beta-analytics-dashboard",
    name: "Beta Analytics Dashboard",
    description: "Enable the new analytics UI for all tenants",
    enabled: false,
  },
  {
    id: "new-invoice-editor",
    name: "New Invoice Editor",
    description: "Upgrade to the rich-text invoice editor",
    enabled: true,
  },
  {
    id: "bulk-user-import",
    name: "Bulk User Import",
    description: "Allow CSV import of users from the admin portal",
    enabled: true,
  },
  {
    id: "ai-powered-insights",
    name: "AI-Powered Insights",
    description: "Surface AI-generated performance and billing nudges",
    enabled: false,
  },
  {
    id: "multi-currency-support",
    name: "Multi-Currency Support",
    description: "Allow tenants to invoice in USD and GBP",
    enabled: false,
  },
];

export interface PasswordComplexityRule {
  id: string;
  label: string;
  enabled: boolean;
}

export const initialComplexityRules: PasswordComplexityRule[] = [
  { id: "uppercase", label: "Require uppercase letter (A-Z)", enabled: true },
  { id: "lowercase", label: "Require lowercase letter (a-z)", enabled: true },
  { id: "number", label: "Require at least one number (0-9)", enabled: true },
  { id: "special", label: "Require special character (!@#$...)", enabled: false },
];

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
}

export const AVAILABLE_VARIABLES = [
  "{{name}}",
  "{{company}}",
  "{{plan}}",
  "{{domain}}",
  "{{expiry_date}}",
  "{{amount}}",
  "{{due_date}}",
  "{{days}}",
];

export const initialEmailTemplates: EmailTemplate[] = [
  {
    id: "onboarding-welcome",
    name: "Onboarding Welcome",
    description: "Welcome to Sinkronis — Let's get started",
    subject: "Welcome to Sinkronis — Let's get started!",
    body: "",
  },
  {
    id: "invoice-generated",
    name: "Invoice Generated",
    description: "Your invoice for {{period}} is ready",
    subject: "Your invoice for {{period}} is ready",
    body: "",
  },
  {
    id: "plan-expiry-reminder",
    name: "Plan Expiry Reminder",
    description: "Your {{plan}} plan expires in {{days}} days",
    subject: "Your {{plan}} plan expires in {{days}} days",
    body: "",
  },
];

export interface PlatformConfig {
  defaultCurrency: string;
  vatRate: string;
  defaultTimezone: string;
  supportEmail: string;
}

export const initialPlatformConfig: PlatformConfig = {
  defaultCurrency: "NGN",
  vatRate: "7.5",
  defaultTimezone: "",
  supportEmail: "support@sinkronis.ng",
};