import type { Absent } from '../../shared/types/absence.types';
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
import type {
  JobDefinitionStore,
  JobExecutionStore,
  JobLockStore,
  JobScheduleStore,
  JobMetricsStore,
  JobQueueStore,
  JobPorts,
} from './job.ports';

function createMemoryStore<T>(getKey: (item: T) => string): {
  store: Map<string, T>;
  insert: (item: T) => Promise<boolean>;
  update: (item: T) => Promise<boolean>;
  upsert: (item: T) => Promise<boolean>;
  delete: (id: string) => Promise<boolean>;
  read: (id: string) => Promise<T | Absent>;
  list: () => Promise<T[]>;
} {
  const store = new Map<string, T>();
  return {
    store,
    insert: async (item: T) => {
      const key = getKey(item);
      if (store.has(key)) return false;
      store.set(key, item);
      return true;
    },
    update: async (item: T) => {
      const key = getKey(item);
      if (!store.has(key)) return false;
      store.set(key, item);
      return true;
    },
    upsert: async (item: T) => {
      const key = getKey(item);
      store.set(key, item);
      return true;
    },
    delete: async (id: string) => store.delete(id),
    read: async (id: string) => store.get(id),
    list: async () => Array.from(store.values()),
  };
}

export function createJobMemoryStore(): JobPorts {
  const definitions = createMemoryStore<JobDefinition>((d) => d.id);
  const executions = createMemoryStore<JobExecution>((e) => e.id);
  const locks = createMemoryStore<JobLock>((l) => l.id);
  const schedules = createMemoryStore<JobScheduleConfig>((s) => s.jobId);
  const metrics = createMemoryStore<JobMetrics>((m) => m.jobId);
  const queue = createMemoryStore<JobQueueItem>((q) => q.executionId);

  const definitionStore: JobDefinitionStore = {
    ...definitions,
    list: async (filter?: { enabled?: boolean; jobType?: JobType }) => {
      const all = await definitions.list();
      return all.filter((d) => {
        if (filter?.enabled !== undefined && d.enabled !== filter.enabled) return false;
        if (filter?.jobType && d.type !== filter.jobType) return false;
        return true;
      });
    },
  };

  const executionStore: JobExecutionStore = {
    ...executions,
    list: async (filter: JobFilter) => {
      const all = await executions.list();
      return all
        .filter((e) => {
          if (filter.jobType && e.jobType !== filter.jobType) return false;
          if (filter.societyId && e.societyId !== filter.societyId) return false;
          if (filter.status && e.status !== filter.status) return false;
          if (filter.fromDate && e.scheduledAt < filter.fromDate) return false;
          if (filter.toDate && e.scheduledAt > filter.toDate) return false;
          return true;
        })
        .slice(filter.offset ?? 0, (filter.offset ?? 0) + (filter.limit ?? 50));
    },
    listByJobId: async (jobId: string, limit = 50) => {
      const all = await executions.list();
      return all.filter((e) => e.jobId === jobId).slice(0, limit);
    },
    getLatestByJobId: async (jobId: string) => {
      const all = await executions.list();
      const filtered = all.filter((e) => e.jobId === jobId);
      if (filtered.length === 0) return undefined;
      return filtered.sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt))[0];
    },
    getPendingExecutions: async (limit: number) => {
      const all = await executions.list();
      return all
        .filter((e) => e.status === 'SCHEDULED' || e.status === 'RUNNING')
        .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
        .slice(0, limit);
    },
    getStuckExecutions: async (thresholdMs: number) => {
      const all = await executions.list();
      const now = Date.now();
      return all.filter(
        (e) =>
          e.status === 'RUNNING' &&
          e.startedAt &&
          now - Date.parse(e.startedAt) > thresholdMs,
      );
    },
  };

  const lockStore: JobLockStore = {
    ...locks,
    acquire: async (lock: JobLock) => {
      const existing = locks.store.get(lock.id);
      if (existing && existing.expiresAt > new Date().toISOString()) return false;
      return locks.insert(lock);
    },
    release: async (lockId: string, owner: string) => {
      const existing = locks.store.get(lockId);
      if (!existing || existing.owner !== owner) return false;
      return locks.delete(lockId);
    },
    listByJobId: async (jobId: string) => {
      const all = await locks.list();
      return all.filter((l) => l.jobId === jobId);
    },
    cleanupExpired: async () => {
      const all = await locks.list();
      const now = new Date().toISOString();
      let count = 0;
      for (const lock of all) {
        if (lock.expiresAt <= now) {
          locks.store.delete(lock.id);
          count++;
        }
      }
      return count;
    },
  };

  const scheduleStore: JobScheduleStore = {
    ...schedules,
    listActive: async () => {
      const all = await schedules.list();
      return all.filter((s) => s.isActive);
    },
    updateNextRun: async (jobId: string, nextRunAt: string) => {
      const config = schedules.store.get(jobId);
      if (!config) return false;
      config.nextRunAt = nextRunAt;
      config.lastRunAt = new Date().toISOString();
      return schedules.update(config);
    },
    incrementFailures: async (jobId: string) => {
      const config = schedules.store.get(jobId);
      if (!config) return false;
      config.consecutiveFailures += 1;
      return schedules.update(config);
    },
    resetFailures: async (jobId: string) => {
      const config = schedules.store.get(jobId);
      if (!config) return false;
      config.consecutiveFailures = 0;
      return schedules.update(config);
    },
  };

  const metricsStore: JobMetricsStore = {
    ...metrics,
    getSummary: async (jobType?: JobType) => {
      const all = await metrics.list();
      return all
        .filter((m) => !jobType || m.jobId.startsWith(jobType))
        .map((m) => {
          const splitFirst = m.jobId.split('-')[0];
          return {
            jobId: m.jobId,
            jobType: (splitFirst ?? '') as JobType,
            totalExecutions: m.totalRuns,
            successful: m.successfulRuns,
            failed: m.failedRuns,
            ...(m.lastRunAt !== undefined ? { lastRunAt: m.lastRunAt } : {}),
            ...(m.lastRunStatus !== undefined ? { lastStatus: m.lastRunStatus } : {}),
            avgDurationMs: m.avgDurationMs,
          };
        });
    },

  };

  const queueStore: JobQueueStore = {
    ...queue,
    enqueue: async (item: JobQueueItem) => queue.insert(item),
    dequeue: async (count: number) => {
      const all = await queue.list();
      const sorted = all.sort((a, b) => a.executeAt.localeCompare(b.executeAt));
      const items = sorted.slice(0, count);
      for (const item of items) {
        queue.store.delete(item.executionId);
      }
      return items;
    },
    peek: async (count: number) => {
      const all = await queue.list();
      return all.sort((a, b) => a.executeAt.localeCompare(b.executeAt)).slice(0, count);
    },
    remove: async (executionId: string) => queue.delete(executionId),
    size: async () => queue.store.size,
  };

  return {
    definitions: definitionStore,
    executions: executionStore,
    locks: lockStore,
    schedules: scheduleStore,
    metrics: metricsStore,
    queue: queueStore,
  };
}

export type JobMemoryStore = ReturnType<typeof createJobMemoryStore>;

export const jobMemoryStore = createJobMemoryStore();