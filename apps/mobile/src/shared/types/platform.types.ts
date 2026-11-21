

export type PlatformAuditEventType =
  | 'SOCIETY_CREATED'
  | 'SOCIETY_ACTIVATED'
  | 'FEATURE_FLAG_CHANGED'
  | 'MODULE_CONFIGURATION_CHANGED'
  | 'HIDDEN_COMMERCIAL_CONTROL_VIEWED'
  | 'PLAN_MAPPING_CHANGED'
  | 'SUPPORT_TICKET_ESCALATED'
  | 'USER_LOOKUP_PERFORMED'
  | 'DATA_EXPORT_REQUESTED'
  | 'IMPERSONATION_PLACEHOLDER_OPENED'
  | 'PLATFORM_SETTINGS_CHANGED';

export type PlatformAlertType =
  | 'SOCIETY_ONBOARDING_BLOCKED'
  | 'HIGH_SUPPORT_VOLUME'
  | 'PAYMENT_FAILURE_SPIKE_PLACEHOLDER'
  | 'NOTIFICATION_FAILURE_PLACEHOLDER'
  | 'API_ERROR_SPIKE_PLACEHOLDER'
  | 'LOW_ADOPTION'
  | 'FEATURE_FLAG_RISK'
  | 'SECURITY_PRIVACY_REVIEW'
  | 'INTEGRATION_DOWN_PLACEHOLDER'
  | 'DATA_IMPORT_FAILED';

export type PlatformAlertStatus =
  | 'OPEN'
  | 'ACKNOWLEDGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED';

export type PlatformAlertSeverity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export type DataExportType =
  | 'SOCIETY_DATA_EXPORT'
  | 'AUDIT_LOG_EXPORT'
  | 'SUPPORT_TICKET_EXPORT'
  | 'USAGE_ANALYTICS_EXPORT'
  | 'BILLING_INTERNAL_EXPORT'
  | 'FEATURE_FLAG_CHANGE_EXPORT';

export type DataExportStatus =
  | 'REQUESTED'
  | 'APPROVAL_REQUIRED'
  | 'APPROVED'
  | 'PROCESSING_PLACEHOLDER'
  | 'READY_PLACEHOLDER'
  | 'REJECTED'
  | 'EXPIRED';

export interface PlatformDashboardMetrics {
  totalSocieties: number;
  activeSocieties: number;
  onboardingSocieties: number;
  suspendedSocietiesPlaceholder: number;
  totalUnits: number;
  totalActiveUsers: number;
  monthlyActiveUsersPlaceholder: number;
  openSupportTickets: number;
  criticalAlerts: number;
  featureFlagsChangedThisWeek: number;
  societiesWithDisabledBilling: number;
  societiesUsingFreeLaunch: number;
  moduleAdoptionScore: number;
}

export interface PlatformAuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  event: PlatformAuditEventType;
  societyId?: string;
  societyName?: string;
  entityType: string;
  entityReference: string;
  correlationId: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  safeMetadata: Record<string, string>;
}

export interface PlatformOperationalAlert {
  id: string;
  type: PlatformAlertType;
  severity: PlatformAlertSeverity;
  societyId?: string;
  societyName?: string;
  message: string;
  createdAt: string;
  status: PlatformAlertStatus;
  ownerId?: string;
  ownerName?: string;
  acknowledgedAt?: string;
}

export interface DataExportRequest {
  id: string;
  type: DataExportType;
  societyId?: string;
  societyName?: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  reason: string;
  status: DataExportStatus;
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface PlatformSettingsGroup {
  id: string;
  groupName: string;
  description: string;
  settings: PlatformSettingItem[];
}

export interface PlatformSettingItem {
  key: string;
  label: string;
  value: string;
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT';
  editable: boolean;
  description: string;
}

export interface PlatformReleaseRecord {
  id: string;
  version: string;
  releaseDate: string;
  releaseNotes: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'RELEASED' | 'ROLLED_BACK';
  featureRolloutGroups: string[];
  betaSocieties: string[];
  internalOnlyFeatures: string[];
  rollbackNotes: string;
  riskFlags: string[];
  qaChecklistCompleted: boolean;
}

export interface SuperAdminUser {
  id: string;
  name: string;
  role: 'SUPER_ADMIN';
  organizationId: string;
  organizationName: string;
  email: string;
}

export interface SuperAdminHomeData {
  platformName: string;
  currentAdmin: SuperAdminUser;
  activeSocieties: number;
  onboardingSocieties: number;
  openSupportTickets: number;
  criticalAlerts: number;
  featureFlagChangesPending: number;
  recentAuditActions: PlatformAuditLogEntry[];
}
