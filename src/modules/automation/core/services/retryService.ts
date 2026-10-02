import { AutomationActionAttempt, AutomationActionStatus, AutomationDeadLetter } from '../types';
import { actionDispatcher } from './actionDispatcher';
import { executionService } from './executionService';
import { v4 as uuidv4 } from 'uuid';

interface RetryPolicy {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  retryableErrors: [
    'TIMEOUT',
    'NETWORK_ERROR',
    'SERVICE_UNAVAILABLE',
    'RATE_LIMITED',
    'PROVIDER_TIMEOUT',
    'TEMPORARY_FAILURE',
  ],
};

const deadLetters: Map<string, AutomationDeadLetter> = new Map();
const retryQueues: Map<string, NodeJS.Timeout> = new Map();

function generateId(): string {
  return uuidv4();
}

function getNow(): string {
  return new Date().toISOString();
}

function calculateDelay(attempt: number, policy: RetryPolicy): number {
  const delay = Math.min(
    policy.baseDelayMs * Math.pow(policy.backoffMultiplier, attempt),
    policy.maxDelayMs
  );
  return delay + Math.random() * 1000;
}

export const retryService = {
  async retryAction(
    attempt: AutomationActionAttempt,
    context: {
      societyId: string;
      actorId: string;
      correlationId: string;
      executionId: string;
    }
  ): Promise<AutomationActionAttempt> {
    const policy = DEFAULT_RETRY_POLICY;

    if (attempt.retryCount >= policy.maxRetries) {
      await this.moveToDeadLetter(attempt, context, 'MAX_RETRIES_EXCEEDED');
      attempt.status = 'FAILED';
      attempt.error = { code: 'MAX_RETRIES_EXCEEDED', message: 'Maximum retry attempts reached' };
      attempt.completedAt = getNow();
      return attempt;
    }

    if (attempt.error && !policy.retryableErrors.includes(attempt.error.code)) {
      await this.moveToDeadLetter(attempt, context, 'NON_RETRYABLE_ERROR');
      attempt.status = 'FAILED';
      attempt.completedAt = getNow();
      return attempt;
    }

    attempt.retryCount += 1;
    attempt.status = 'RETRYING';

    const delay = calculateDelay(attempt.retryCount, policy);

    await new Promise(resolve => {
      const timeoutId = setTimeout(resolve, delay);
      retryQueues.set(`${attempt.actionId}_${attempt.retryCount}`, timeoutId);
    });

    retryQueues.delete(`${attempt.actionId}_${attempt.retryCount}`);

    return actionDispatcher.retryAction(attempt, context);
  },

  async moveToDeadLetter(
    attempt: AutomationActionAttempt,
    context: {
      societyId: string;
      actorId: string;
      correlationId: string;
      executionId: string;
    },
    reason: string
  ): Promise<AutomationDeadLetter> {
    const deadLetter: AutomationDeadLetter = {
      id: `dl_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      executionId: context.executionId,
      actionId: attempt.actionId,
      reason,
      error: attempt.error || { code: 'UNKNOWN', message: 'Unknown error' },
      failedAt: getNow(),
      retryCount: attempt.retryCount,
      status: 'PENDING',
    };

    deadLetters.set(deadLetter.id, deadLetter);
    return deadLetter;
  },

  getDeadLetter(deadLetterId: string): AutomationDeadLetter | undefined {
    return deadLetters.get(deadLetterId);
  },

  getDeadLettersByExecution(executionId: string): AutomationDeadLetter[] {
    return Array.from(deadLetters.values()).filter(dl => dl.executionId === executionId);
  },

  getAllDeadLetters(): AutomationDeadLetter[] {
    return Array.from(deadLetters.values());
  },

  async replayDeadLetter(deadLetterId: string, retryAllFailed = false): Promise<AutomationDeadLetter | null> {
    const deadLetter = deadLetters.get(deadLetterId);
    if (!deadLetter) return null;

    deadLetter.status = 'REPLAYED';
    deadLetter.retriedAt = getNow();
    deadLetters.set(deadLetterId, deadLetter);

    const execution = executionService.getExecution(deadLetter.executionId);
    if (!execution) {
      deadLetter.status = 'RESOLVED';
      deadLetter.resolution = 'Execution not found';
      deadLetters.set(deadLetterId, deadLetter);
      return deadLetter;
    }

    const attempt = execution.actionAttempts.find(a => a.actionId === deadLetter.actionId);
    if (!attempt) {
      deadLetter.status = 'RESOLVED';
      deadLetter.resolution = 'Action not found in execution';
      deadLetters.set(deadLetterId, deadLetter);
      return deadLetter;
    }

    const result = await this.retryAction(attempt, {
      societyId: execution.societyId,
      actorId: 'SYSTEM_AUTOMATION',
      correlationId: execution.correlationId,
      executionId: execution.id,
    });

    if (result.status === 'COMPLETED') {
      deadLetter.status = 'RESOLVED';
      deadLetter.resolution = 'Retry successful';
    } else {
      deadLetter.status = 'PENDING';
      deadLetter.retryCount = result.retryCount;
    }

    deadLetters.set(deadLetterId, deadLetter);
    return deadLetter;
  },

  async discardDeadLetter(deadLetterId: string, resolution: string): Promise<AutomationDeadLetter | null> {
    const deadLetter = deadLetters.get(deadLetterId);
    if (!deadLetter) return null;

    deadLetter.status = 'DISCARDED';
    deadLetter.retriedAt = getNow();
    deadLetter.resolution = resolution;
    deadLetters.set(deadLetterId, deadLetter);

    return deadLetter;
  },

  getDeadLetterStats(): {
    total: number;
    pending: number;
    retried: number;
    replayed: number;
    discarded: number;
    resolved: number;
  } {
    const letters = Array.from(deadLetters.values());
    return {
      total: letters.length,
      pending: letters.filter(l => l.status === 'PENDING').length,
      retried: letters.filter(l => l.status === 'RETRIED').length,
      replayed: letters.filter(l => l.status === 'REPLAYED').length,
      discarded: letters.filter(l => l.status === 'DISCARDED').length,
      resolved: letters.filter(l => l.status === 'RESOLVED').length,
    };
  },

  cleanupOldDeadLetters(olderThanDays = 30): number {
    const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    let cleaned = 0;
    deadLetters.forEach((dl, id) => {
      if (new Date(dl.failedAt) < cutoff && (dl.status === 'RESOLVED' || dl.status === 'DISCARDED')) {
        deadLetters.delete(id);
        cleaned++;
      }
    });
    return cleaned;
  },

  cancelPendingRetries(actionId: string): void {
    const keysToCancel: string[] = [];
    retryQueues.forEach((timeoutId, key) => {
      if (key.startsWith(actionId)) {
        clearTimeout(timeoutId);
        keysToCancel.push(key);
      }
    });
    keysToCancel.forEach(key => retryQueues.delete(key));
  },

  getPendingRetryCount(): number {
    return retryQueues.size;
  },
};