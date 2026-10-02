export type InsightCategory =
  | 'WEATHER'
  | 'WEATHER_ALERT'
  | 'WEATHER_FORECAST'
  | 'WEATHER_ADVISORY'
  | 'LOCAL_ADVISORY'
  | 'TRAFFIC'
  | 'TRAFFIC_ALERT'
  | 'TRAFFIC_CONGESTION'
  | 'ROAD_CLOSURE'
  | 'CONSTRUCTION'
  | 'MAINTENANCE_WORK'
  | 'UTILITY_OUTAGE'
  | 'POWER_OUTAGE'
  | 'WATER_OUTAGE'
  | 'GAS_OUTAGE'
  | 'INTERNET_OUTAGE'
  | 'PHONE_OUTAGE'
  | 'TV_OUTAGE'
  | 'SECURITY_ALERT'
  | 'SECURITY_INCIDENT'
  | 'SECURITY_THREAT'
  | 'SECURITY_BREACH'
  | 'SECURITY_VIOLATION'
  | 'SUSPICIOUS_ACTIVITY'
  | 'UNAUTHORIZED_ACCESS'
  | 'TRESPASSING'
  | 'VANDALISM'
  | 'THEFT'
  | 'BURGLARY'
  | 'ROBBERY'
  | 'ASSAULT'
  | 'HARASSMENT'
  | 'STALKING'
  | 'DOMESTIC_VIOLENCE'
  | 'CHILD_ABUSE'
  | 'ELDER_ABUSE'
  | 'ANIMAL_CRUELTY'
  | 'FIRE'
  | 'SMOKE'
  | 'GAS_LEAK'
  | 'CHEMICAL_SPILL'
  | 'HAZMAT'
  | 'EXPLOSION'
  | 'BOMB_THREAT'
  | 'ACTIVE_SHOOTER'
  | 'LOCKDOWN'
  | 'EVACUATION'
  | 'SHELTER_IN_PLACE'
  | 'CURFEW'
  | 'QUARANTINE'
  | 'ISOLATION'
  | 'EPIDEMIC'
  | 'PANDEMIC'
  | 'OUTBREAK'
  | 'EPIDEMIC_ALERT'
  | 'PANDEMIC_ALERT'
  | 'HEALTH_ADVISORY'
  | 'VACCINATION_DRIVE'
  | 'MEDICAL_CAMP'
  | 'BLOOD_DONATION_DRIVE'
  | 'ORGAN_DONATION_DRIVE'
  | 'FREE_HEALTH_CHECKUP'
  | 'VACCINATION_CAMP'
  | 'EYE_CAMP'
  | 'DENTAL_CAMP'
  | 'GENERAL_HEALTH_CHECKUP'
  | 'SPECIALIST_CONSULTATION'
  | 'FREE_MEDICINE_DISTRIBUTION'
  | 'AMBULANCE_SERVICE'
  | 'EMERGENCY_RESPONSE'
  | 'FIRST_AID'
  | 'CPR'
  | 'AED'
  | 'DEFIBRILLATOR'
  | 'FIRE_EXTINGUISHER'
  | 'FIRE_HYDRANT'
  | 'FIRE_ALARM'
  | 'SMOKE_DETECTOR'
  | 'SPRINKLER_SYSTEM'
  | 'FIRE_HOSE'
  | 'FIRE_BUCKET'
  | 'FIRE_BLANKET'
  | 'FIRE_SUIT'
  | 'FIRE_HELMET'
  | 'FIRE_BOOTS'
  | 'FIRE_GLOVES'
  | 'FIRE_AXE'
  | 'FIRE_HOOK'
  | 'FIRE_LADDER'
  | 'FIRE_ROPE'
  | 'FIRE_BELT'
  | 'FIRE_HARNESS'
  | 'FIRE_LIFELINE'
  | 'FIRE_RESCUE'
  | 'FIRE_EVACUATION'
  | 'FIRE_SHELTER'
  | 'FIRE_SAFETY'
  | 'FIRE_DRILL'
  | 'FIRE_TRAINING'
  | 'FIRE_AWARENESS'
  | 'FIRE_PREVENTION'
  | 'FIRE_SAFETY_TRAINING'
  | 'FIRE_SAFETY_DRILL'
  | 'FIRE_SAFETY_AWARENESS'
  | 'FIRE_SAFETY_INSPECTION'
  | 'FIRE_SAFETY_AUDIT'
  | 'FIRE_SAFETY_CERTIFICATE'
  | 'FIRE_SAFETY_LICENSE'
  | 'FIRE_SAFETY_PERMIT'
  | 'FIRE_SAFETY_APPROVAL'
  | 'FIRE_SAFETY_NOC'
  | 'FIRE_SAFETY_CLEARANCE'
  | 'FIRE_SAFETY_COMPLIANCE'
  | 'FIRE_SAFETY_REGULATION'
  | 'FIRE_SAFETY_STANDARD'
  | 'FIRE_SAFETY_CODE'
  | 'FIRE_SAFETY_RULE'
  | 'FIRE_SAFETY_GUIDELINE'
  | 'FIRE_SAFETY_PROCEDURE'
  | 'FIRE_SAFETY_PROTOCOL'
  | 'FIRE_SAFETY_POLICY'
  | 'FIRE_SAFETY_MANUAL'
  | 'FIRE_SAFETY_HANDBOOK'
  | 'FIRE_SAFETY_GUIDE'
  | 'FIRE_SAFETY_TIP'
  | 'FIRE_SAFETY_TIPS'
  | 'FIRE_SAFETY_REMINDER'
  | 'FIRE_SAFETY_ALERT'
  | 'FIRE_SAFETY_WARNING'
  | 'FIRE_SAFETY_NOTICE'
  | 'FIRE_SAFETY_NOTIFICATION'
  | 'FIRE_SAFETY_ANNOUNCEMENT'
  | 'FIRE_SAFETY_BULLETIN'
  | 'FIRE_SAFETY_CIRCULAR'
  | 'FIRE_SAFETY_MEMO'
  | 'FIRE_SAFETY_LETTER'
  | 'FIRE_SAFETY_EMAIL'
  | 'FIRE_SAFETY_SMS'
  | 'FIRE_SAFETY_WHATSAPP'
  | 'FIRE_SAFETY_PUSH'
  | 'FIRE_SAFETY_PUSH_NOTIFICATION'
  | 'FIRE_SAFETY_EMAIL'
  | 'FIRE_SAFETY_PUSH'
  | 'FIRE_SAFETY_SMS'
  | 'FIRE_SAFETY_WHATSAPP'
  | 'FIRE_SAFETY_IN_APP'
  | 'FIRE_SAFETY_IN_APP_NOTIFICATION'
  | 'FIRE_SAFETY_IN_APP_MESSAGE'
  | 'FIRE_SAFETY_IN_APP_ALERT'
  | 'FIRE_SAFETY_IN_APP_WARNING'
  | 'FIRE_SAFETY_IN_APP_NOTICE'
  | 'FIRE_SAFETY_IN_APP_NOTIFICATION'
  | 'FIRE_SAFETY_IN_APP_ANNOUNCEMENT'
  | 'FIRE_SAFETY_IN_APP_BULLETIN'
  | 'FIRE_SAFETY_IN_APP_CIRCULAR'
  | 'FIRE_SAFETY_IN_APP_MEMO'
  | 'FIRE_SAFETY_IN_APP_EMAIL'
  | 'FIRE_SAFETY_IN_APP_PUSH'
  | 'FIRE_SAFETY_IN_APP_PUSH_NOTIFICATION'
  | 'FIRE_SAFETY_IN_APP_EMAIL'
  | 'FIRE_SAFETY_IN_APP_SMS'
  | 'FIRE_SAFETY_IN_APP_WHATSAPP'
  | 'OTHER';

export type InsightPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'
  | 'EMERGENCY'
  | 'URGENT'
  | 'IMMEDIATE'
  | 'ROUTINE'
  | 'SCHEDULED'
  | 'PLANNED'
  | 'ON_DEMAND'
  | 'AS_NEEDED'
  | 'BEST_EFFORT'
  | 'BACKGROUND'
  | 'LOW_PRIORITY'
  | 'NORMAL_PRIORITY'
  | 'HIGH_PRIORITY'
  | 'CRITICAL_PRIORITY'
  | 'EMERGENCY_PRIORITY'
  | 'URGENT_PRIORITY'
  | 'IMMEDIATE_PRIORITY';

export type InsightStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PENDING'
  | 'PENDING_REVIEW'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'SUPERSEDED'
  | 'ARCHIVED'
  | 'DISMISSED'
  | 'SNOOZED'
  | 'HIDDEN'
  | 'SUPPRESSED'
  | 'EXPIRED'
  | 'COMPLETED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED'
  | 'VOIDED'
  | 'INVALID'
  | 'ERROR'
  | 'FAILED';

export type InsightProvenance =
  | 'AUTHORITATIVE_DOMAIN'
  | 'VERIFIED_EXTERNAL'
  | 'ADMIN_DECLARED'
  | 'RULE_DERIVED'
  | 'AI_ASSISTED'
  | 'MANUAL_ENTRY'
  | 'AUTOMATED_RULE'
  | 'SCHEDULED_JOB'
  | 'EVENT_DRIVEN'
  | 'WEBHOOK'
  | 'WEBHOOK_TRIGGER'
  | 'EVENT_TRIGGER'
  | 'SCHEDULED_JOB'
  | 'MANUAL_TRIGGER'
  | 'AI_GENERATED'
  | 'ML_GENERATED'
  | 'RULE_ENGINE'
  | 'ALERT_ENGINE'
  | 'MONITORING_SYSTEM'
  | 'THRESHOLD_BREACH'
  | 'ANOMALY_DETECTION'
  | 'PATTERN_DETECTION'
  | 'CORRELATION_ENGINE'
  | 'RULE_ENGINE'
  | 'ALERT_ENGINE'
  | 'USER_REPORT'
  | 'RESIDENT_REPORT'
  | 'GUARD_REPORT'
  | 'STAFF_REPORT'
  | 'VENDOR_REPORT'
  | 'VENDOR_FEEDBACK'
  | 'RESIDENT_FEEDBACK'
  | 'RESIDENT_COMPLAINT'
  | 'RESIDENT_SUGGESTION'
  | 'RESIDENT_REQUEST'
  | 'RESIDENT_QUERY'
  | 'RESIDENT_SUGGESTION'
  | 'RESIDENT_REQUEST'
  | 'EXTERNAL_API'
  | 'EXTERNAL_FEED'
  | 'EXTERNAL_WEBHOOK'
  | 'EXTERNAL_WEBHOOK_TRIGGER'
  | 'EXTERNAL_EVENT'
  | 'EXTERNAL_EVENT_TRIGGER'
  | 'EXTERNAL_SCHEDULED_JOB'
  | 'EXTERNAL_MANUAL_TRIGGER'
  | 'EXTERNAL_AI_GENERATED'
  | 'EXTERNAL_ML_GENERATED'
  | 'EXTERNAL_RULE_ENGINE'
  | 'EXTERNAL_ALERT_ENGINE'
  | 'EXTERNAL_MONITORING_SYSTEM'
  | 'EXTERNAL_THRESHOLD_BREACH'
  | 'EXTERNAL_ANOMALY_DETECTION'
  | 'EXTERNAL_PATTERN_DETECTION'
  | 'EXTERNAL_CORRELATION_ENGINE'
  | 'EXTERNAL_RULE_ENGINE'
  | 'EXTERNAL_ALERT_ENGINE';

export type InsightProvenanceCategory =
  | 'AUTHORITATIVE_DOMAIN'
  | 'VERIFIED_EXTERNAL'
  | 'ADMIN_DECLARED'
  | 'RULE_DERIVED'
  | 'AI_ASSISTED'
  | 'MANUAL_ENTRY'
  | 'AUTOMATED_RULE'
  | 'SCHEDULED_JOB'
  | 'EVENT_DRIVEN'
  | 'WEBHOOK_TRIGGER'
  | 'AI_GENERATED'
  | 'ML_GENERATED'
  | 'RULE_ENGINE'
  | 'ALERT_ENGINE'
  | 'MONITORING_SYSTEM'
  | 'THRESHOLD_BREACH'
  | 'ANOMALY_DETECTION'
  | 'PATTERN_DETECTION'
  | 'CORRELATION_ENGINE'
  | 'RULE_ENGINE'
  | 'ALERT_ENGINE'
  | 'USER_REPORT'
  | 'RESIDENT_REPORT'
  | 'GUARD_REPORT'
  | 'STAFF_REPORT'
  | 'VENDOR_REPORT'
  | 'VENDOR_FEEDBACK'
  | 'RESIDENT_FEEDBACK'
  | 'RESIDENT_COMPLAINT'
  | 'RESIDENT_SUGGESTION'
  | 'RESIDENT_REQUEST'
  | 'EXTERNAL_API'
  | 'EXTERNAL_FEED'
  | 'EXTERNAL_WEBHOOK'
  | 'EXTERNAL_WEBHOOK_TRIGGER'
  | 'EXTERNAL_EVENT'
  | 'EXTERNAL_EVENT_TRIGGER'
  | 'EXTERNAL_SCHEDULED_JOB'
  | 'EXTERNAL_MANUAL_TRIGGER'
  | 'EXTERNAL_AI_GENERATED'
  | 'EXTERNAL_ML_GENERATED'
  | 'EXTERNAL_RULE_ENGINE'
  | 'EXTERNAL_ALERT_ENGINE'
  | 'EXTERNAL_MONITORING_SYSTEM'
  | 'EXTERNAL_THRESHOLD_BREACH'
  | 'EXTERNAL_ANOMALY_DETECTION'
  | 'EXTERNAL_PATTERN_DETECTION'
  | 'EXTERNAL_CORRELATION_ENGINE'
  | 'EXTERNAL_RULE_ENGINE'
  | 'EXTERNAL_ALERT_ENGINE';

export type InsightSource = {
  sourceId: string;
  sourceType: 'DOMAIN_API' | 'DOCUMENT_VAULT' | 'GLOBAL_SEARCH' | 'KNOWLEDGE_BASE' | 'EXTERNAL_API' | 'USER_INPUT' | 'CACHED' | 'CALCULATED' | 'MONITORING_SYSTEM' | 'ALERT_SYSTEM' | 'ALERT_ENGINE' | 'MONITORING_SYSTEM' | 'THRESHOLD_BREACH' | 'ANOMALY_DETECTION' | 'PATTERN_DETECTION' | 'CORRELATION_ENGINE' | 'RULE_ENGINE' | 'ALERT_ENGINE' | 'USER_REPORT' | 'RESIDENT_REPORT' | 'GUARD_REPORT' | 'STAFF_REPORT' | 'VENDOR_REPORT' | 'VENDOR_FEEDBACK' | 'RESIDENT_FEEDBACK' | 'RESIDENT_COMPLAINT' | 'RESIDENT_SUGGESTION' | 'RESIDENT_REQUEST' | 'EXTERNAL_API' | 'EXTERNAL_FEED' | 'EXTERNAL_WEBHOOK' | 'EXTERNAL_WEBHOOK_TRIGGER' | 'EXTERNAL_EVENT' | 'EXTERNAL_EVENT_TRIGGER' | 'EXTERNAL_SCHEDULED_JOB' | 'EXTERNAL_MANUAL_TRIGGER' | 'EXTERNAL_AI_GENERATED' | 'EXTERNAL_ML_GENERATED' | 'EXTERNAL_RULE_ENGINE' | 'EXTERNAL_ALERT_ENGINE' | 'EXTERNAL_MONITORING_SYSTEM' | 'EXTERNAL_THRESHOLD_BREACH' | 'EXTERNAL_ANOMALY_DETECTION' | 'EXTERNAL_PATTERN_DETECTION' | 'EXTERNAL_CORRELATION_ENGINE' | 'EXTERNAL_RULE_ENGINE' | 'EXTERNAL_ALERT_ENGINE';
  sourceEntityId: string;
  sourceEntityType: string;
  sourceReference: string;
  sourceVersion?: string;
  sourceVersionId?: string;
  asOf: string;
  dataFreshness: 'REAL_TIME' | 'NEAR_REAL_TIME' | 'RECENT' | 'STALE' | 'STALE_KNOWN' | 'STALE_UNKNOWN' | 'HISTORICAL' | 'ARCHIVED';
  confidence: number;
  reliability: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIED';
  verificationStatus: 'VERIFIED' | 'UNVERIFIED' | 'PENDING_VERIFICATION' | 'FAILED_VERIFICATION' | 'VERIFICATION_FAILED' | 'NOT_VERIFIED' | 'NOT_APPLICABLE';
  explanation?: string;
  metadata?: Record<string, any>;
};

export type Insight = {
  insightId: string;
  societyId: string;
  category: InsightCategory;
  subCategory?: string;
  title: string;
  summary: string;
  description?: string;
  priority: InsightPriority;
  status: InsightStatus;
  provenance: InsightProvenance;
  provenanceCategory: InsightProvenanceCategory;
  sources: InsightSource[];
  eligibleAudience: {
    roles: string[];
    units?: string[];
    towers?: string[];
    households?: string[];
    societies?: string[];
    allResidents?: boolean;
    allAdmins?: boolean;
    allStaff?: boolean;
    allVendors?: boolean;
    allResidentsInUnit?: boolean;
    allResidentsInTower?: boolean;
    allResidentsInTowerFloor?: boolean;
    allResidentsInHousehold?: boolean;
  };
  priorityScore: number;
  generatedAt: string;
  generatedBy: string;
  generatedByType: 'SYSTEM' | 'AUTOMATED_RULE' | 'SCHEDULED_JOB' | 'EVENT_DRIVEN' | 'WEBHOOK' | 'WEBHOOK_TRIGGER' | 'EVENT_TRIGGER' | 'SCHEDULED_JOB' | 'MANUAL_TRIGGER' | 'AI_GENERATED' | 'ML_GENERATED' | 'RULE_ENGINE' | 'ALERT_ENGINE' | 'MONITORING_SYSTEM' | 'THRESHOLD_BREACH' | 'ANOMALY_DETECTION' | 'PATTERN_DETECTION' | 'CORRELATION_ENGINE' | 'RULE_ENGINE' | 'ALERT_ENGINE' | 'USER_REPORT' | 'RESIDENT_REPORT' | 'GUARD_REPORT' | 'STAFF_REPORT' | 'VENDOR_REPORT' | 'VENDOR_FEEDBACK' | 'RESIDENT_FEEDBACK' | 'RESIDENT_COMPLAINT' | 'RESIDENT_SUGGESTION' | 'RESIDENT_REQUEST' | 'EXTERNAL_API' | 'EXTERNAL_FEED' | 'EXTERNAL_WEBHOOK' | 'EXTERNAL_WEBHOOK_TRIGGER' | 'EXTERNAL_EVENT' | 'EXTERNAL_EVENT_TRIGGER' | 'EXTERNAL_SCHEDULED_JOB' | 'EXTERNAL_MANUAL_TRIGGER' | 'EXTERNAL_AI_GENERATED' | 'EXTERNAL_ML_GENERATED' | 'EXTERNAL_RULE_ENGINE' | 'EXTERNAL_ALERT_ENGINE' | 'EXTERNAL_MONITORING_SYSTEM' | 'EXTERNAL_THRESHOLD_BREACH' | 'EXTERNAL_ANOMALY_DETECTION' | 'EXTERNAL_PATTERN_DETECTION' | 'EXTERNAL_CORRELATION_ENGINE' | 'EXTERNAL_RULE_ENGINE' | 'EXTERNAL_ALERT_ENGINE';
  validFrom: string;
  validUntil?: string;
  expiresAt?: string;
  freshness: 'REAL_TIME' | 'NEAR_REAL_TIME' | 'RECENT' | 'STALE' | 'STALE_KNOWN' | 'STALE_UNKNOWN' | 'HISTORICAL' | 'ARCHIVED';
  confidence: number;
  confidenceBand: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  dataQuality: 'HIGH' | 'MEDIUM' | 'LOW' | 'POOR' | 'UNKNOWN';
  explanation?: string;
  tags: string[];
  metadata?: Record<string, any>;
  allowedActions: InsightAction[];
  dismissPolicy: {
    dismissible: boolean;
    dismissibleBy: string[];
    dismissalReasonRequired: boolean;
    dismissalReasonOptions?: string[];
    maxDismissalsPerUser?: number;
    dismissalExpiresAt?: string;
    autoDismissAt?: string;
    autoDismissAfterDays?: number;
  };
  snoozePolicy: {
    snoozable: boolean;
    snoozeableBy: string[];
    snoozeOptions?: {
      durationMinutes: number;
      label: string;
    }[];
    maxSnoozesPerUser?: number;
    snoozeExpiresAt?: string;
  };
  feedbackPolicy: {
    feedbackEnabled: boolean;
    feedbackTypes: ('USEFUL' | 'NOT_USEFUL' | 'WRONG' | 'OUTDATED' | 'NOT_RELEVANT' | 'PRIVACY_CONCERN')[];
    feedbackRequiredForDismissal?: boolean;
    feedbackRequiredForSnooze?: boolean;
  };
  displayConfig: {
    icon?: string;
    color?: string;
    badge?: string;
    badgeColor?: string;
    showInFeed: boolean;
    showInDashboard: boolean;
    showInNotificationCenter: boolean;
    showInEmail: boolean;
    showInPush: boolean;
    showInSMS: boolean;
    showInWhatsApp: boolean;
    showInEmail: boolean;
    showInPushNotification: boolean;
    showInInApp: boolean;
    priority: number;
    sortOrder: number;
  };
  relatedInsights: string[];
  relatedEntities: Array<{
    entityType: string;
    entityId: string;
    relationship: string;
  }>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
  version: number;
  versionHistory: Array<{
    version: number;
    changedAt: string;
    changedBy: string;
    changes: string[];
  }>;
};

export type InsightAction =
  | 'VIEW_DETAILS'
  | 'VIEW_SOURCE'
  | 'VIEW_RELATED'
  | 'DISMISS'
  | 'SNOOZE'
  | 'REPORT'
  | 'FEEDBACK'
  | 'SHARE'
  | 'BOOKMARK'
  | 'SAVE'
  | 'PRINT'
  | 'EXPORT'
  | 'COPY_LINK'
  | 'COPY_TEXT'
  | 'OPEN_SOURCE'
  | 'OPEN_RELATED_INSIGHT'
  | 'OPEN_RELATED_ENTITY'
  | 'NAVIGATE_TO_SOURCE'
  | 'NAVIGATE_TO_RELATED'
  | 'EXECUTE_ACTION'
  | 'NAVIGATE_TO_ACTION'
  | 'OPEN_ACTION'
  | 'EXECUTE_SUGGESTED_ACTION'
  | 'VIEW_SUGGESTED_ACTION'
  | 'DISMISS_SUGGESTED_ACTION'
  | 'SNOOZE_SUGGESTED_ACTION'
  | 'REPORT_SUGGESTED_ACTION'
  | 'FEEDBACK_ON_SUGGESTED_ACTION'
  | 'CONFIRM_ACTION'
  | 'EXECUTE_CONFIRMED_ACTION'
  | 'CANCEL_ACTION'
  | 'UNDO_ACTION'
  | 'REDO_ACTION'
  | 'RETRY_ACTION'
  | 'CANCEL_SCHEDULED_ACTION'
  | 'RESCHEDULE_ACTION'
  | 'MODIFY_ACTION'
  | 'UPDATE_ACTION'
  | 'DELETE_ACTION'
  | 'ARCHIVE_ACTION'
  | 'RESTORE_ACTION'
  | 'UNDELETE_ACTION'
  | 'RECOVER_ACTION'
  | 'REVERT_ACTION'
  | 'UNDO_ACTION'
  | 'REDO_ACTION';

export type InsightDismissal = {
  dismissalId: string;
  insightId: string;
  userId: string;
  dismissedAt: string;
  reason?: string;
  reasonCategory?: string;
  autoDismissed: boolean;
  dismissedBy: 'USER' | 'SYSTEM' | 'AUTO_EXPIRY' | 'SUPERSEDED' | 'ARCHIVED' | 'SUPERSEDED' | 'ARCHIVED' | 'EXPIRED' | 'SUPERSEDED_BY' | 'ARCHIVED_BY' | 'EXPIRED_BY' | 'SUPERSEDED_BY_USER' | 'ARCHIVED_BY_USER' | 'EXPIRED_BY_SYSTEM' | 'SUPERSEDED_BY_SYSTEM' | 'ARCHIVED_BY_SYSTEM';
  metadata?: Record<string, any>;
};

export type InsightSnooze = {
  snoozeId: string;
  insightId: string;
  userId: string;
  snoozedAt: string;
  snoozeUntil: string;
  durationMinutes: number;
  snoozeOptionLabel: string;
  autoDismissAt?: string;
  metadata?: Record<string, any>;
};

export type InsightFeedback = {
  feedbackId: string;
  insightId: string;
  userId: string;
  feedbackType: 'USEFUL' | 'NOT_USEFUL' | 'WRONG' | 'OUTDATED' | 'NOT_RELEVANT' | 'PRIVACY_CONCERN';
  comment?: string;
  submittedAt: string;
  metadata?: Record<string, any>;
};

export type InsightReport = {
  reportId: string;
  insightId: string;
  userId: string;
  reportType: 'INAPPROPRIATE' | 'MISLEADING' | 'INACCURATE' | 'OUTDATED' | 'OFFENSIVE' | 'PRIVACY_VIOLATION' | 'SPAM' | 'DUPLICATE' | 'IRRELEVANT' | 'NOT_USEFUL' | 'OTHER';
  reason?: string;
  details?: string;
  submittedAt: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED' | 'ESCALATED';
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
  metadata?: Record<string, any>;
};

export type InsightEligibility = {
  insightId: string;
  societyId: string;
  eligibleRoles: string[];
  eligibleUnits?: string[];
  eligibleTowers?: string[];
  eligibleHouseholds?: string[];
  allResidents?: boolean;
  allAdmins?: boolean;
  allStaff?: boolean;
  allVendors?: boolean;
  minRoleLevel?: number;
  requiredCapabilities?: string[];
  requiredPermissions?: string[];
  visibilityConditions?: Array<{
    condition: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'IN' | 'NOT_IN' | 'CONTAINS' | 'NOT_CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'GREATER_THAN_OR_EQUAL' | 'LESS_THAN_OR_EQUAL';
    value: any;
  }>;
  timeWindow?: {
    from: string;
    to: string;
    timezone?: string;
    daysOfWeek?: number[];
    timeOfDayStart?: string;
    timeOfDayEnd?: string;
  };
  contextConditions?: Array<{
    contextKey: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'IN' | 'NOT_IN' | 'CONTAINS' | 'NOT_CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'GREATER_THAN_OR_EQUAL' | 'LESS_THAN_OR_EQUAL';
    value: any;
  }>;
};

export type ContextualInsight = {
  insightId: string;
  societyId: string;
  areaId: string;
  category: InsightCategory;
  subCategory?: string;
  title: string;
  summary: string;
  description?: string;
  priority: InsightPriority;
  status: InsightStatus;
  provenance: InsightProvenance;
  provenanceCategory: InsightProvenanceCategory;
  sources: InsightSource[];
  priorityScore: number;
  generatedAt: string;
  generatedBy: string;
  generatedByType: 'SYSTEM' | 'AUTOMATED_RULE' | 'SCHEDULED_JOB' | 'EVENT_DRIVEN' | 'WEBHOOK' | 'WEBHOOK_TRIGGER' | 'EVENT_TRIGGER' | 'SCHEDULED_JOB' | 'MANUAL_TRIGGER' | 'AI_GENERATED' | 'ML_GENERATED' | 'RULE_ENGINE' | 'ALERT_ENGINE' | 'MONITORING_SYSTEM' | 'THRESHOLD_BREACH' | 'ANOMALY_DETECTION' | 'PATTERN_DETECTION' | 'CORRELATION_ENGINE' | 'RULE_ENGINE' | 'ALERT_ENGINE' | 'USER_REPORT' | 'RESIDENT_REPORT' | 'GUARD_REPORT' | 'STAFF_REPORT' | 'VENDOR_REPORT' | 'VENDOR_FEEDBACK' | 'RESIDENT_FEEDBACK' | 'RESIDENT_COMPLAINT' | 'RESIDENT_SUGGESTION' | 'RESIDENT_REQUEST' | 'EXTERNAL_API' | 'EXTERNAL_FEED' | 'EXTERNAL_WEBHOOK' | 'EXTERNAL_WEBHOOK_TRIGGER' | 'EXTERNAL_EVENT' | 'EXTERNAL_EVENT_TRIGGER' | 'EXTERNAL_SCHEDULED_JOB' | 'EXTERNAL_MANUAL_TRIGGER' | 'EXTERNAL_AI_GENERATED' | 'EXTERNAL_ML_GENERATED' | 'EXTERNAL_RULE_ENGINE' | 'EXTERNAL_ALERT_ENGINE' | 'EXTERNAL_MONITORING_SYSTEM' | 'EXTERNAL_THRESHOLD_BREACH' | 'EXTERNAL_ANOMALY_DETECTION' | 'EXTERNAL_PATTERN_DETECTION' | 'EXTERNAL_CORRELATION_ENGINE' | 'EXTERNAL_RULE_ENGINE' | 'EXTERNAL_ALERT_ENGINE';
  validFrom: string;
  validUntil?: string;
  expiresAt?: string;
  freshness: 'REAL_TIME' | 'NEAR_REAL_TIME' | 'RECENT' | 'STALE' | 'STALE_KNOWN' | 'STALE_UNKNOWN' | 'HISTORICAL' | 'ARCHIVED';
  confidence: number;
  confidenceBand: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  dataQuality: 'HIGH' | 'MEDIUM' | 'LOW' | 'POOR' | 'UNKNOWN';
  explanation?: string;
  tags: string[];
  metadata?: Record<string, any>;
  allowedActions: InsightAction[];
  dismissPolicy: {
    dismissible: boolean;
    dismissibleBy: string[];
    dismissalReasonRequired: boolean;
    dismissalReasonOptions?: string[];
    maxDismissalsPerUser?: number;
    dismissalExpiresAt?: string;
    autoDismissAt?: string;
    autoDismissAfterDays?: number;
  };
  snoozePolicy: {
    snoozable: boolean;
    snoozeableBy: string[];
    snoozeOptions?: {
      durationMinutes: number;
      label: string;
    }[];
    maxSnoozesPerUser?: number;
    snoozeExpiresAt?: string;
  };
  feedbackPolicy: {
    feedbackEnabled: boolean;
    feedbackTypes: ('USEFUL' | 'NOT_USEFUL' | 'WRONG' | 'OUTDATED' | 'NOT_RELEVANT' | 'PRIVACY_CONCERN')[];
    feedbackRequiredForDismissal?: boolean;
    feedbackRequiredForSnooze?: boolean;
  };
  displayConfig: {
    icon?: string;
    color?: string;
    badge?: string;
    badgeColor?: string;
    showInFeed: boolean;
    showInDashboard: boolean;
    showInNotificationCenter: boolean;
    showInEmail: boolean;
    showInPush: boolean;
    showInSMS: boolean;
    showInWhatsApp: boolean;
    showInEmail: boolean;
    showInPushNotification: boolean;
    showInInApp: boolean;
    priority: number;
    sortOrder: number;
  };
  relatedInsights: string[];
  relatedEntities: Array<{
    entityType: string;
    entityId: string;
    relationship: string;
  }>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
  version: number;
  versionHistory: Array<{
    version: number;
    changedAt: string;
    changedBy: string;
    changes: string[];
  }>;
};

export type ContextualInsightResult = {
  activeAreaId: string;
  activeSocietyId: string;
  activeUnitId: string;
  weatherSnapshot: AreaWeatherSnapshot | null;
  advisories: LocalAreaAdvisory[];
  suggestions: ResidentContextualSuggestion[];
  topSuggestion: ResidentContextualSuggestion | null;
  lastUpdatedIso: string;
  nextRefreshDueIso: string;
};

export type ResidentContextualSuggestion = {
  id: string;
  priority: ContextualInsightPriority;
  iconName: AppIconName;
  titleMessageKey: MessageKey;
  oneLineMessageKey: MessageKey;
  detailMessageKey: MessageKey;
  weatherSnapshot?: AreaWeatherSnapshot;
  advisory?: LocalAreaAdvisory;
  action?: ResidentContextualSuggestionAction;
};

export type ResidentContextualSuggestionAction = {
  labelMessageKey: MessageKey;
  routeName?: ResidentRouteName;
  actionType: 'openDetails' | 'openVisitors' | 'openEmergency' | 'openNotices' | 'openMapPlaceholder' | 'dismiss';
};

export type AreaWeatherSnapshot = {
  areaId: string;
  areaName: string;
  city: string;
  latitude: number;
  longitude: number;
  temperatureCelsius: number;
  feelsLikeCelsius?: number;
  humidityPercent?: number;
  precipitationProbabilityPercent?: number;
  windSpeedKmph?: number;
  conditionCode: WeatherConditionCode;
  observedAtIso: string;
  validUntilIso: string;
  provider: 'openMeteo' | 'openWeather' | 'weatherApi' | 'backendMock' | 'manual';
};

export type LocalAreaAdvisory = {
  id: string;
  societyId?: string;
  areaId: string;
  type: LocalAdvisoryType;
  priority: ContextualInsightPriority;
  titleMessageKey: MessageKey;
  descriptionMessageKey: MessageKey;
  shortSuggestionMessageKey: MessageKey;
  reportedAtIso: string;
  validUntilIso: string;
  source: 'societyAdmin' | 'facilityTeam' | 'guardReport' | 'residentReports' | 'municipalFeed' | 'weatherRule' | 'mock';
  customTitle?: string;
  customDescription?: string;
  reporterName?: string;
  autoIconName?: AppIconName;
};

export type LocalAdvisoryType =
  | 'roadBlock'
  | 'waterlogging'
  | 'gateCongestion'
  | 'liftOutage'
  | 'powerCut'
  | 'securityAlert'
  | 'parkingCongestion'
  | 'societyEvent'
  | 'maintenanceWork'
  | 'airQuality'
  | 'none';

export type WeatherConditionCode =
  | 'clear'
  | 'partlyCloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavyRain'
  | 'thunderstorm'
  | 'heat'
  | 'cold'
  | 'wind'
  | 'unknown';

export type ContextualInsightPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type MessageKey = string;

export type AppIconName = string;

export type ResidentRouteName = string;