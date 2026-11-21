import type { JobPorts } from './job.ports';
import type {
  JobDefinition,
  JobExecution,
  JobLock,
  JobScheduleConfig,
  JobMetrics,
  JobQueueItem,
  JobType,
  JobStatus,
  JobSchedule,
  JobResult,
  JobError,
  JobFilter,
} from './job.types';
import { isTerminalStatus, isRetryableStatus } from './job.types';

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

function parseCronNext(expression: string, timezone: string, from: Date = new Date()): Date {
  const parts = expression.split(' ');
  const minutePart = parts[0];
  const hourPart = parts[1];
  if (parts.length !== 5 || minutePart === undefined || hourPart === undefined) return new Date(from.getTime() + 60000);

  const next = new Date(from);
  next.setSeconds(0, 0);

  const targetMinute = minutePart === '*' ? next.getMinutes() : parseInt(minutePart, 10);
  const targetHour = hourPart === '*' ? next.getHours() : parseInt(hourPart, 10);

  if (minutePart !== '*' || hourPart !== '*') {
    if (next.getMinutes() > targetMinute || (next.getMinutes() === targetMinute && next.getHours() >= targetHour)) {
      next.setDate(next.getDate() + 1);
    }
    next.setHours(targetHour, targetMinute, 0, 0);
  } else {
    next.setMinutes(next.getMinutes() + 1);
  }

  return next;
}


function calculateNextRun(schedule: JobSchedule, from: Date = new Date()): Date {
  switch (schedule.kind) {
    case 'CRON':
      return parseCronNext(schedule.expression, schedule.timezone, from);
    case 'INTERVAL':
      return new Date(from.getTime() + schedule.intervalMs);
    case 'ONCE':
      return new Date(schedule.at);
    case 'MANUAL':
      return new Date(from.getTime() + 86400000);
  }
}

export interface JobExecutor {
  execute(execution: JobExecution, ports: JobPorts): Promise<JobResult>;
}

export interface JobSchedulerConfig {
  workerId: string;
  pollIntervalMs: number;
  lockTtlMs: number;
  maxConcurrentJobs: number;
  stuckThresholdMs: number;
}

export class JobScheduler {
  private ports: JobPorts;
  private executors: Map<string, JobExecutor> = new Map();
  private config: JobSchedulerConfig;
  private running = false;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  constructor(ports: JobPorts, config: Partial<JobSchedulerConfig> = {}) {
    this.ports = ports;
    this.config = {
      workerId: `worker-${generateId('w')}`,
      pollIntervalMs: 5000,
      lockTtlMs: 300000,
      maxConcurrentJobs: 5,
      stuckThresholdMs: 600000,
      ...config,
    };
  }

  registerExecutor(jobType: JobType, executor: JobExecutor): void {
    this.executors.set(jobType, executor);
  }

  async start(): Promise<void> {
    if (this.running) return;
    this.running = true;

    await this.recoverStuckJobs();
    await this.schedulePendingJobs();

    this.pollTimer = setInterval(() => this.pollJobs(), this.config.pollIntervalMs);
    this.cleanupTimer = setInterval(() => this.cleanup(), this.config.lockTtlMs);
    this.heartbeatTimer = setInterval(() => this.heartbeat(), 30000);
  }

  async stop(): Promise<void> {
    this.running = false;
    if (this.pollTimer) clearInterval(this.pollTimer);
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.pollTimer = null;
    this.cleanupTimer = null;
    this.heartbeatTimer = null;
  }

  private async pollJobs(): Promise<void> {
    if (!this.running) return;

    try {
      const pending = await this.ports.executions.getPendingExecutions(this.config.maxConcurrentJobs);
      for (const execution of pending) {
        if (execution.status !== 'SCHEDULED') continue;
        if (Date.parse(execution.scheduledAt) > Date.now()) continue;

        const lockId = `lock-${execution.id}`;
        const lock: JobLock = {
          id: lockId,
          jobId: execution.jobId,
          executionId: execution.id,
          acquiredAt: now(),
          expiresAt: new Date(Date.now() + this.config.lockTtlMs).toISOString(),
          owner: this.config.workerId,
        };

        const acquired = await this.ports.locks.acquire(lock);
        if (!acquired) continue;

        execution.status = 'RUNNING';
        execution.startedAt = now();
        execution.lockId = lockId;
        execution.lockedAt = now();
        execution.lockedBy = this.config.workerId;
        await this.ports.executions.update(execution);

        this.executeJob(execution).catch(async (error) => {
          await this.handleExecutionError(execution, error);
        });
      }
    } catch (error) {
      console.error('[JobScheduler] Poll error:', error);
    }
  }

  private async executeJob(execution: JobExecution): Promise<void> {
    const executor = this.executors.get(execution.jobType);
    if (!executor) {
      await this.failExecution(execution, {
        code: 'NO_EXECUTOR',
        message: `No executor registered for job type ${execution.jobType}`,
        retryable: false,
        occurredAt: now(),
      });
      return;
    }

    try {
      const result = await executor.execute(execution, this.ports);
      await this.completeExecution(execution, result);
    } catch (error) {
      await this.handleExecutionError(execution, error);
    } finally {
      await this.releaseLock(execution);
    }
  }

  private async completeExecution(execution: JobExecution, result: JobResult): Promise<void> {
    execution.status = result.success ? 'SUCCEEDED' : 'FAILED_RETRYABLE';
    execution.completedAt = now();
    execution.result = result;
    await this.ports.executions.update(execution);

    await this.updateMetrics(execution, result.success);
    await this.scheduleNextRun(execution.jobId);
  }

  private async handleExecutionError(execution: JobExecution, error: unknown): Promise<void> {
    const jobError: JobError = {
      code: error instanceof Error ? 'EXECUTION_ERROR' : 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error',
      ...(error instanceof Error && error.stack ? { details: { stack: error.stack } } : {}),
      retryable: error instanceof Error,
      occurredAt: now(),
    };

    await this.failExecution(execution, jobError);
  }


  private async failExecution(execution: JobExecution, error: JobError): Promise<void> {
    execution.attempt += 1;
    execution.error = error;

    if (execution.attempt >= execution.maxRetries || !error.retryable) {
      execution.status = 'FAILED_FINAL';
      execution.completedAt = now();
    } else {
      execution.status = 'FAILED_RETRYABLE';
      const delay = Math.min(1000 * Math.pow(2, execution.attempt), 60000);
      execution.scheduledAt = new Date(Date.now() + delay).toISOString();
    }

    await this.ports.executions.update(execution);
    await this.updateMetrics(execution, false);
    await this.ports.schedules.incrementFailures(execution.jobId);
  }

  private async releaseLock(execution: JobExecution): Promise<void> {
    if (execution.lockId) {
      await this.ports.locks.release(execution.lockId, this.config.workerId);
    }
  }

  private async updateMetrics(execution: JobExecution, success: boolean): Promise<void> {
    const metricsId = execution.jobId;
    let metrics = await this.ports.metrics.read(metricsId);
    if (!metrics) {
      metrics = {
        jobId: metricsId,
        totalRuns: 0,
        successfulRuns: 0,
        failedRuns: 0,
        avgDurationMs: 0,
      };
    }

    metrics.totalRuns += 1;
    if (success) metrics.successfulRuns += 1;
    else metrics.failedRuns += 1;

    if (execution.startedAt && execution.completedAt) {
      const duration = Date.parse(execution.completedAt) - Date.parse(execution.startedAt);
      metrics.avgDurationMs = (metrics.avgDurationMs * (metrics.totalRuns - 1) + duration) / metrics.totalRuns;
    }

    metrics.lastRunAt = now();
    metrics.lastRunStatus = execution.status;
    if (!success && execution.error) metrics.lastError = execution.error;

    await this.ports.metrics.upsert(metrics);
  }

  private async scheduleNextRun(jobId: string): Promise<void> {
    const definition = await this.ports.definitions.read(jobId);
    if (!definition || !definition.enabled || definition.schedule.kind === 'MANUAL' || definition.schedule.kind === 'ONCE') {
      return;
    }

    const schedule = await this.ports.schedules.read(jobId);
    const nextRun = calculateNextRun(definition.schedule, new Date());
    const nextRunAt = nextRun.toISOString();

    if (schedule) {
      schedule.nextRunAt = nextRunAt;
      schedule.lastRunAt = now();
      schedule.lastRunStatus = 'SUCCEEDED';
      await this.ports.schedules.updateNextRun(jobId, nextRunAt);
    } else {
      const newSchedule: JobScheduleConfig = {
        id: `sched-${jobId}`,
        jobId,
        nextRunAt,
        consecutiveFailures: 0,
        isActive: true,
      };
      await this.ports.schedules.upsert(newSchedule);
    }

    await this.enqueueNextRun(jobId, nextRunAt);
  }

  private async enqueueNextRun(jobId: string, executeAt: string): Promise<void> {
    const executionId = `exec-${generateId('e')}`;
    const execution: JobExecution = {
      id: executionId,
      jobId,
      jobType: (await this.ports.definitions.read(jobId))?.type ?? 'DOCUMENT_EXPIRY_EVALUATION',
      status: 'SCHEDULED',
      scheduledAt: executeAt,
      attempt: 0,
      maxRetries: 3,
      payload: {},
      correlationId: `corr-${executionId}`,
    };
    await this.ports.executions.insert(execution);

    const queueItem: JobQueueItem = {
      executionId,
      priority: 'NORMAL',
      enqueuedAt: now(),
      executeAt,
    };
    await this.ports.queue.enqueue(queueItem);
  }

  private async schedulePendingJobs(): Promise<void> {
    const definitions = await this.ports.definitions.list({ enabled: true });
    for (const def of definitions) {
      const schedule = await this.ports.schedules.read(def.id);
      if (!schedule || !schedule.isActive) continue;
      if (Date.parse(schedule.nextRunAt) <= Date.now()) {
        await this.enqueueNextRun(def.id, schedule.nextRunAt);
      }
    }
  }

  private async recoverStuckJobs(): Promise<void> {
    const stuck = await this.ports.executions.getStuckExecutions(this.config.stuckThresholdMs);
    for (const execution of stuck) {
      execution.status = 'SCHEDULED';
      delete execution.startedAt;
      delete execution.lockId;
      delete execution.lockedAt;
      delete execution.lockedBy;
      execution.scheduledAt = now();
      await this.ports.executions.update(execution);

      if (execution.lockId) {
        await this.ports.locks.release(execution.lockId, execution.lockedBy ?? 'unknown');
      }
    }
  }

  private async cleanup(): Promise<void> {
    await this.ports.locks.cleanupExpired();
  }

  private async heartbeat(): Promise<void> {
    // Worker heartbeat - could be used for monitoring
  }

  async registerJob(definition: JobDefinition): Promise<void> {
    await this.ports.definitions.insert(definition);
    if (definition.enabled && definition.schedule.kind !== 'MANUAL') {
      const nextRun = calculateNextRun(definition.schedule);
      const schedule: JobScheduleConfig = {
        id: `sched-${definition.id}`,
        jobId: definition.id,
        nextRunAt: nextRun.toISOString(),
        consecutiveFailures: 0,
        isActive: true,
      };
      await this.ports.schedules.upsert(schedule);
      await this.enqueueNextRun(definition.id, schedule.nextRunAt);
    }

  }

  async unregisterJob(jobId: string): Promise<void> {
    await this.ports.definitions.delete(jobId);
    await this.ports.schedules.delete(jobId);
  }

  async triggerJob(jobId: string, payload: Record<string, unknown> = {}): Promise<JobExecution> {
    const executionId = `exec-${generateId('e')}`;
    const definition = await this.ports.definitions.read(jobId);
    const execution: JobExecution = {
      id: executionId,
      jobId,
      jobType: definition?.type ?? 'DOCUMENT_EXPIRY_EVALUATION',
      status: 'SCHEDULED',
      scheduledAt: now(),
      attempt: 0,
      maxRetries: 3,
      payload,
      correlationId: `corr-${executionId}`,
    };
    await this.ports.executions.insert(execution);

    const queueItem: JobQueueItem = {
      executionId,
      priority: 'NORMAL',
      enqueuedAt: now(),
      executeAt: now(),
    };
    await this.ports.queue.enqueue(queueItem);

    return execution;
  }

  async cancelExecution(executionId: string): Promise<boolean> {
    const execution = await this.ports.executions.read(executionId);
    if (!execution) return false;
    if (isTerminalStatus(execution.status)) return false;

    execution.status = 'CANCELLED';
    execution.completedAt = now();
    await this.ports.executions.update(execution);

    if (execution.lockId) {
      await this.ports.locks.release(execution.lockId, this.config.workerId);
    }

    return true;
  }

  async getExecution(executionId: string): Promise<JobExecution | undefined> {
    return this.ports.executions.read(executionId);
  }

  async listExecutions(filter: JobFilter): Promise<JobExecution[]> {
    return this.ports.executions.list(filter);
  }


  async getJobMetrics(jobId: string): Promise<JobMetrics | undefined> {
    return this.ports.metrics.read(jobId);
  }

  async getAllMetrics(): Promise<JobMetrics[]> {
    return this.ports.metrics.list();
  }
}

export function createJobScheduler(ports: JobPorts, config?: Partial<JobSchedulerConfig>): JobScheduler {
  return new JobScheduler(ports, config);
}