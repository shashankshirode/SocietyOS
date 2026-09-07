import type { JsonObject } from '../../core/api/api.types';

export type BackupType = 'FULL' | 'INCREMENTAL' | 'DIFFERENTIAL' | 'SNAPSHOT' | 'LOG';
export type BackupStatus = 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
export type RestoreType = 'FULL_RESTORE' | 'POINT_IN_TIME' | 'TABLE_RESTORE' | 'SCHEMA_ONLY' | 'DATA_ONLY';
export type RestoreStatus = 'PLANNED' | 'VALIDATING' | 'RESTORING' | 'VALIDATING_POST' | 'COMPLETED' | 'FAILED' | 'ROLLED_BACK';
export type RecoveryPhase = 'INCIDENT' | 'RECOVERY_PLANNED' | 'RESTORING' | 'VALIDATING' | 'RECONCILING' | 'VERIFIED' | 'CLOSED';

export type BackupJob = {
  id: string;
  name: string;
  type: BackupType;
  status: BackupStatus;
  source: {
    database: string;
    schema?: string;
    tables?: string[];
    includeIndexes: boolean;
    includeTriggers: boolean;
  };
  destination: {
    storageType: 'S3' | 'AZURE_BLOB' | 'GCS' | 'LOCAL' | 'NFS';
    bucket: string;
    path: string;
    encryption: boolean;
    compression: boolean;
  };
  schedule: {
    cron: string;
    timezone: string;
    enabled: boolean;
    retentionDays: number;
  };
  lastRun?: {
    startedAt: string;
    completedAt?: string;
    status: BackupStatus;
    sizeBytes: number;
    durationMs: number;
    error?: string;
  };
  nextRunAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type BackupResult = {
  jobId: string;
  backupId: string;
  startedAt: string;
  completedAt: string;
  status: BackupStatus;
  sizeBytes: number;
  durationMs: number;
  tablesBackedUp: string[];
  checksum: string;
  manifest: {
    version: string;
    database: string;
    tables: Array<{
      name: string;
      rowCount: number;
      sizeBytes: number;
      checksum: string;
    }>;
  };
  error?: string;
};

export type RestorePlan = {
  id: string;
  name: string;
  incidentId?: string;
  restoreType: RestoreType;
  source: {
    backupId: string;
    pointInTime?: string;
    tables?: string[];
  };
  target: {
    database: string;
    schema?: string;
    newDatabaseName?: string;
  };
  validation: {
    schemaValidation: boolean;
    checksumValidation: boolean;
    rowCountValidation: boolean;
    referentialIntegrity: boolean;
    financialIdempotencyCheck: boolean;
  };
  steps: Array<{
    order: number;
    name: string;
    description: string;
    automated: boolean;
    estimatedDurationMs: number;
    rollbackAction?: string;
  }>;
  status: RestoreStatus;
  createdAt: string;
  createdBy: string;
  startedAt?: string;
  completedAt?: string;
  progress: {
    currentStep: number;
    totalSteps: number;
    tablesRestored: number;
    totalTables: number;
    bytesRestored: number;
    totalBytes: number;
  };
  error?: string;
};

export type RecoveryIncident = {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: RecoveryPhase;
  declaredAt: string;
  declaredBy: string;
  affectedSystems: string[];
  rpoTargetMs: number;
  rtoTargetMs: number;
  actualRpoMs?: number;
  actualRtoMs?: number;
  restorePlanId?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  postMortem?: string;
  timeline: Array<{
    timestamp: string;
    phase: RecoveryPhase;
    action: string;
    actor: string;
    details?: JsonObject;
  }>;
};

export type ValidationCheck = {
  name: string;
  type: 'SCHEMA' | 'CHECKSUM' | 'ROW_COUNT' | 'REFERENTIAL_INTEGRITY' | 'FINANCIAL_IDEMPOTENCY' | 'TENANT_ISOLATION' | 'RLS_POLICIES';
  status: 'PENDING' | 'RUNNING' | 'PASS' | 'FAIL' | 'WARNING' | 'SKIPPED';
  details?: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
};

export type DisasterRecoveryConfig = {
  rpoMs: number;
  rtoMs: number;
  backupRetentionDays: number;
  crossRegionReplication: boolean;
  autoFailover: boolean;
  notificationChannels: string[];
  runbookUrl: string;
  contactList: Array<{
    name: string;
    role: string;
    phone: string;
    email: string;
  }>;
};

export const DEFAULT_DR_CONFIG: DisasterRecoveryConfig = {
  rpoMs: 15 * 60 * 1000,
  rtoMs: 4 * 60 * 60 * 1000,
  backupRetentionDays: 90,
  crossRegionReplication: true,
  autoFailover: false,
  notificationChannels: ['SLACK', 'EMAIL', 'SMS', 'PAGERDUTY'],
  runbookUrl: 'https://runbooks.societyos.com/disaster-recovery',
  contactList: [
    { name: 'Platform Lead', role: 'INCIDENT_COMMANDER', phone: '+91-XXXXXXXXXX', email: 'platform-lead@societyos.com' },
    { name: 'Database Admin', role: 'DBA', phone: '+91-XXXXXXXXXX', email: 'dba@societyos.com' },
    { name: 'Security Lead', role: 'SECURITY', phone: '+91-XXXXXXXXXX', email: 'security@societyos.com' },
  ],
};

export const VALIDATION_CHECKS: ValidationCheck[] = [
  { name: 'Schema Validation', type: 'SCHEMA', status: 'PENDING' },
  { name: 'Checksum Validation', type: 'CHECKSUM', status: 'PENDING' },
  { name: 'Row Count Validation', type: 'ROW_COUNT', status: 'PENDING' },
  { name: 'Referential Integrity', type: 'REFERENTIAL_INTEGRITY', status: 'PENDING' },
  { name: 'Financial Idempotency', type: 'FINANCIAL_IDEMPOTENCY', status: 'PENDING' },
  { name: 'Tenant Isolation', type: 'TENANT_ISOLATION', status: 'PENDING' },
  { name: 'RLS Policies', type: 'RLS_POLICIES', status: 'PENDING' },
];