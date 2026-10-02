import type { Absent } from '../../shared/types/absence.types';
import type { VaultPorts } from '../../modules/resident/documents/vault/application/ports';
import type {
  JobDefinition,
  JobExecution,
  JobLock,
  JobScheduleConfig,
  JobMetrics,
  JobQueueItem,
  JobFilter,
  JobExecutionSummary,
  JobType,
  JobStatus,
} from './job.types';

export interface JobDefinitionStore {
  insert(definition: JobDefinition): Promise<boolean>;
  update(definition: JobDefinition): Promise<boolean>;
  delete(jobId: string): Promise<boolean>;
  read(jobId: string): Promise<JobDefinition | Absent>;
  list(filter?: { enabled?: boolean; jobType?: JobType }): Promise<JobDefinition[]>;
}

export interface JobExecutionStore {
  insert(execution: JobExecution): Promise<boolean>;
  update(execution: JobExecution): Promise<boolean>;
  read(executionId: string): Promise<JobExecution | Absent>;
  list(filter: JobFilter): Promise<JobExecution[]>;
  listByJobId(jobId: string, limit?: number): Promise<JobExecution[]>;
  getLatestByJobId(jobId: string): Promise<JobExecution | Absent>;
  getPendingExecutions(limit: number): Promise<JobExecution[]>;
  getStuckExecutions(thresholdMs: number): Promise<JobExecution[]>;
}

export interface JobLockStore {
  acquire(lock: JobLock): Promise<boolean>;
  release(lockId: string, owner: string): Promise<boolean>;
  read(lockId: string): Promise<JobLock | Absent>;
  listByJobId(jobId: string): Promise<JobLock[]>;
  cleanupExpired(): Promise<number>;
}

export interface JobScheduleStore {
  upsert(config: JobScheduleConfig): Promise<boolean>;
  read(jobId: string): Promise<JobScheduleConfig | Absent>;
  delete(jobId: string): Promise<boolean>;
  listActive(): Promise<JobScheduleConfig[]>;
  updateNextRun(jobId: string, nextRunAt: string): Promise<boolean>;
  incrementFailures(jobId: string): Promise<boolean>;
  resetFailures(jobId: string): Promise<boolean>;
}


export interface JobMetricsStore {
  upsert(metrics: JobMetrics): Promise<boolean>;
  read(jobId: string): Promise<JobMetrics | Absent>;
  list(): Promise<JobMetrics[]>;
  getSummary(jobType?: JobType): Promise<JobExecutionSummary[]>;
}

export interface JobQueueStore {
  enqueue(item: JobQueueItem): Promise<boolean>;
  dequeue(count: number): Promise<JobQueueItem[]>;
  peek(count: number): Promise<JobQueueItem[]>;
  remove(executionId: string): Promise<boolean>;
  size(): Promise<number>;
}

export interface JobPorts {
  definitions: JobDefinitionStore;
  executions: JobExecutionStore;
  locks: JobLockStore;
  schedules: JobScheduleStore;
  metrics: JobMetricsStore;
  queue: JobQueueStore;
  vault?: VaultPorts;
  notifications?: {
    notifyVerificationDecided?: (payload: {
      documentId: string;
      societyId: string;
      decidedBy: string;
      decision: string;
    }) => void;
  };
}

export interface JobWorkerPort {
  start(): Promise<void>;
  stop(): Promise<void>;
  isRunning(): boolean;
  getWorkerId(): string;
}

export interface JobSchedulerPort {
  registerJob(definition: JobDefinition): Promise<void>;
  unregisterJob(jobId: string): Promise<void>;
  triggerJob(jobId: string, payload?: Record<string, unknown>): Promise<JobExecution>;
  cancelExecution(executionId: string): Promise<boolean>;
  getExecution(executionId: string): Promise<JobExecution | Absent>;
  listExecutions(filter: JobFilter): Promise<JobExecution[]>;
  getJobMetrics(jobId: string): Promise<JobMetrics | Absent>;
  getAllMetrics(): Promise<JobMetrics[]>;
}