

export type PlanCode =
  | 'FREE_LAUNCH'
  | 'STARTER'
  | 'GROWTH'
  | 'PREMIUM'
  | 'ENTERPRISE';

export type BillingMode =
  | 'DISABLED'
  | 'ENABLED'
  | 'MANUAL';

export type SubscriptionStatus =
  | 'ACTIVE'
  | 'TRIAL'
  | 'PAUSED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface HiddenCommercialControl {
  societyId: string;
  societyName: string;
  planCode: PlanCode;
  billingMode: BillingMode;
  subscriptionStatus: SubscriptionStatus;
  freeLaunchStatus: boolean;
  commercialNotes: string;
  futureBillingReadiness: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface FreeLaunchPlanMapping {
  societyId: string;
  societyName: string;
  launchBatch: string;
  freeLaunchStartDate: string;
  internalReviewDate: string;
  commercialOwnerPlaceholder: string;
  billingMode: BillingMode;
  notes: string;
}
