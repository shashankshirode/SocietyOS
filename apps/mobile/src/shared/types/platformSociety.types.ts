

export type PlatformSocietyStatus =
  | 'DRAFT'
  | 'ONBOARDING'
  | 'ACTIVE'
  | 'SUSPENDED_PLACEHOLDER'
  | 'ARCHIVED_PLACEHOLDER';

export type PlatformSocietyType =
  | 'STANDALONE_BUILDING'
  | 'COOPERATIVE_HOUSING_SOCIETY'
  | 'GATED_APARTMENT'
  | 'VILLA_COMMUNITY'
  | 'LARGE_TOWNSHIP'
  | 'MIXED_USE_COMPLEX';

export type LaunchMode =
  | 'FREE_LAUNCH'
  | 'INTERNAL_DEMO'
  | 'PILOT'
  | 'PAID_PLACEHOLDER';

export type HierarchyTemplateCode =
  | 'STANDALONE_BUILDING'
  | 'COOPERATIVE_HOUSING_SOCIETY'
  | 'GATED_APARTMENT'
  | 'VILLA_COMMUNITY'
  | 'LARGE_TOWNSHIP'
  | 'MIXED_USE_COMPLEX';

export type FeatureFlagScope =
  | 'PLATFORM'
  | 'SOCIETY'
  | 'ROLE'
  | 'MODULE'
  | 'EXPERIMENT_PLACEHOLDER';

export type FeatureRiskLevel =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export interface PlatformSociety {
  id: string;
  name: string;
  city: string;
  state: string;
  type: PlatformSocietyType;
  status: PlatformSocietyStatus;
  planCode: string;
  billingMode: string;
  totalUnits: number;
  activeUsers: number;
  enabledModulesCount: number;
  lastActivity?: string;
  supportStatus?: string;
  createdAt: string;
  address?: string;
}

export interface SocietyOnboardingDraft {
  id: string;
  societyName: string;
  societyType: PlatformSocietyType;
  city: string;
  state: string;
  address?: string;
  numberOfTowersWings: number;
  approximateUnitCount: number;
  primaryContactName: string;
  primaryContactMobile: string;
  primaryContactEmail: string;
  initialAdminEmail: string;
  launchMode: LaunchMode;
  defaultLanguage: string;
  enabledModuleTemplate: string;
  notes?: string;
  status: 'DRAFT' | 'REVIEW' | 'READY_FOR_ACTIVATION' | 'ACTIVATED';
  createdAt: string;
  updatedAt: string;
}

export interface HierarchyTemplate {
  id: string;
  code: HierarchyTemplateCode;
  name: string;
  hierarchyLevels: string[];
  exampleUnits: string;
  recommendedModules: string[];
  configurationNotes: string;
}

export interface SocietyModuleConfig {
  moduleKey: string;
  moduleName: string;
  moduleGroup: string;
  featureFlagKey: string;
  enabled: boolean;
  recommendedPhase: string;
  dependencyNote?: string;
  visibleToSocietyUsers: boolean;
  backendEnforcementRequired: boolean;
}

export interface PlatformFeatureFlag {
  flagKey: string;
  displayName: string;
  moduleGroup: string;
  scope: FeatureFlagScope;
  defaultValue: boolean;
  societyOverride?: boolean;
  environmentPlaceholder: string;
  riskLevel: FeatureRiskLevel;
  lastChangedBy?: string;
  lastChangedAt?: string;
}

export interface FeatureFlagChangeRequest {
  flagKey: string;
  currentValue: boolean;
  newValue: boolean;
  scope: FeatureFlagScope;
  affectedSocietyCount: number;
  riskLevel: FeatureRiskLevel;
  impactSummary: string;
  rollbackNote: string;
  reason: string;
  confirmed: boolean;
}

export interface SocietyAdminUser {
  id: string;
  name: string;
  emailMasked: string;
  mobileMasked: string;
  role: string;
  status: 'ACTIVE' | 'DISABLED' | 'PENDING_INVITE';
  lastLoginPlaceholder?: string;
  mfaStatusPlaceholder: 'ENABLED' | 'DISABLED' | 'NOT_SET';
  societyId: string;
  societyName: string;
}

export interface PlatformUserRecord {
  id: string;
  displayName: string;
  society: string;
  societyId: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DISABLED';
  lastActivity?: string;
  riskNote?: string;
  emailMasked: string;
  mobileMasked: string;
}
