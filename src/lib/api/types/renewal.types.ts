// src/lib/api/types/renewal.types.ts
import type { PlanKey } from "./admin.types";

export type RenewalBillingCycle = "MONTHLY" | "YEARLY";

export interface RenewSubscriptionBody {
  planKey: PlanKey;
  billingCycle: RenewalBillingCycle;
  confirm: boolean;
  automaticRenewal: boolean;
  idempotencyKey: string;
}

export type RenewalPeriodPolicy =
  | "EXTEND_FROM_PAID_THROUGH"
  | "START_AT_VERIFIED_PAYMENT";

export type SubscriptionPaymentStatus =
  | "CREATED"
  | "INITIALIZING"
  | "INITIALIZED"
  | "UNKNOWN"
  | "FAILED"
  | "VERIFIED"
  | "COMPLETED";

export interface SubscriptionPaymentAttempt {
  reference: string;
  status: SubscriptionPaymentStatus;
  authorizationUrl?: string | null;
  amount?: number;
  currency?: string;
  billingCycle?: string;
}