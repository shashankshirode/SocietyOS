export type JobStatus =
  | 'SCHEDULED'
  | 'RUNNING'
  | 'SUCCEEDED'
  | 'FAILED_RETRYABLE'
  | 'FAILED_FINAL'
  | 'CANCELLED';

export type JobType =
  | 'DOCUMENT_EXPIRY_EVALUATION'
  | 'DOCUMENT_EXPIRY_REMINDER'
  | 'DOCUMENT_RETENTION_EVALUATION'
  | 'DOCUMENT_PURGE'
  | 'DOCUMENT_ORPHAN_CLEANUP'
  | 'NOC_CERTIFICATE_STORAGE'
  | 'NOC_QR_VERIFICATION'
  | 'PARKING_TEMPORARY_ALLOCATION_EXPIRY'
  | 'PARKING_VISITOR_PARKING_EXPIRY'
  | 'PARKING_VIOLATION_REPEAT_OFFENCE'
  | 'FACILITY_HOLD_EXPIRY'
  | 'FACILITY_NO_SHOW_PROCESSING'
  | 'FACILITY_WAITLIST_OFFER_EXPIRY'
  | 'FACILITY_WAITLIST_PROMOTION';


export type JobPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export interface JobDefinition {
  id: string;
  type: JobType;
  name: string;
  description: string;
  schedule: JobSchedule;
  payload: Record<string, unknown>;
  societyId?: string;
  priority: JobPriority;
  maxRetries: number;
  retryDelayMs: number;
  timeoutMs: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type JobSchedule =
  | { kind: 'CRON'; expression: string; timezone: string }
  | { kind: 'INTERVAL'; intervalMs: number }
  | { kind: 'ONCE'; at: string }
  | { kind: 'MANUAL' };

export interface JobExecution {
  id: string;
  jobId: string;
  jobType: JobType;
  status: JobStatus;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  attempt: number;
  maxRetries: number;
  payload: Record<string, unknown>;
  societyId?: string;
  result?: JobResult;
  error?: JobError;
  correlationId: string;
  traceId?: string;
  lockId?: string;
  lockedAt?: string;
  lockedBy?: string;
}

export interface JobResult {
  success: boolean;
  processedCount?: number;
  succeededCount?: number;
  failedCount?: number;
  details: Record<string, unknown>;
  metrics?: Record<string, number>;
}

export interface JobError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  retryable: boolean;
  occurredAt: string;
}

export interface JobLock {
  id: string;
  jobId: string;
  executionId: string;
  acquiredAt: string;
  expiresAt: string;
  owner: string;
}

export interface JobScheduleConfig {
  id: string;
  jobId: string;
  nextRunAt: string;
  lastRunAt?: string;
  lastRunStatus?: JobStatus;
  consecutiveFailures: number;
  isActive: boolean;
}

export interface JobMetrics {
  jobId: string;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  avgDurationMs: number;
  lastRunAt?: string;
  lastRunStatus?: JobStatus;
  lastError?: JobError;
  nextScheduledAt?: string;
}

export interface JobWorkerConfig {
  workerId: string;
  jobTypes: JobType[];
  concurrency: number;
  pollIntervalMs: number;
  heartbeatIntervalMs: number;
  lockTtlMs: number;
}

export interface JobRegistryEntry {
  definition: JobDefinition;
  executions: JobExecution[];
  schedule: JobScheduleConfig;
  metrics: JobMetrics;
}

export interface JobQueueItem {
  executionId: string;
  priority: JobPriority;
  enqueuedAt: string;
  executeAt: string;
}

export type JobFilter = {
  jobType?: JobType;
  societyId?: string;
  status?: JobStatus;
  fromDate?: string;
  toDate?: string;
  limit?: number;
  offset?: number;
};

export interface JobExecutionSummary {
  jobId: string;
  jobType: JobType;
  totalExecutions: number;
  successful: number;
  failed: number;
  lastRunAt?: string;
  lastStatus?: JobStatus;
  avgDurationMs: number;
}

export function isTerminalStatus(status: JobStatus): boolean {
  return status === 'SUCCEEDED' || status === 'FAILED_FINAL' || status === 'CANCELLED';
}

export function isRetryableStatus(status: JobStatus): boolean {
  return status === 'FAILED_RETRYABLE';
}

export function isActiveStatus(status: JobStatus): boolean {
  return status === 'SCHEDULED' || status === 'RUNNING';
}

import type { JobPorts } from './job.ports';
export type { JobPorts } from './job.ports';
export type { JobPorts as JobPortsInterface } from './job.ports';

export interface JobExecutor {
  execute(execution: JobExecution, ports: JobPorts): Promise<JobResult>;
}