import type {
  NotificationJob,
  NotificationChannel,
  NotificationPriority,
  NotificationStatus,
  RetryPolicy,
  ChannelConfig,
  DeadLetterEntry,
  NotificationMetrics,
  NotificationRule,
  NotificationRecipient,
  NotificationPayload,
} from './notification.types';
import { DEFAULT_RETRY_POLICY, DEFAULT_FALLBACK_CHAINS } from './notification.types';
import { createIdempotencyKey } from '../api/idempotency';
import { auditService, createAuditEntry, type AuditActorType, type AuditAction, type AuditEntityType } from '../audit';

type ProviderSendFn = (job: NotificationJob, config: ChannelConfig) => Promise<{
  success: boolean;
  providerMessageId?: string;
  error?: { code: string; message: string };
}>;

const MOCK_PROVIDERS: Record<NotificationChannel, ProviderSendFn> = {
  PUSH: async (job) => {
    await new Promise(r => setTimeout(r, 100));
    if (Math.random() > 0.1) {
      return { success: true, providerMessageId: `push_${Date.now()}` };
    }
    return { success: false, error: { code: 'PROVIDER_UNAVAILABLE', message: 'Push service temporarily unavailable' } };
  },
  SMS: async (job) => {
    await new Promise(r => setTimeout(r, 200));
    if (Math.random() > 0.05) {
      return { success: true, providerMessageId: `sms_${Date.now()}` };
    }
    return { success: false, error: { code: 'RATE_LIMIT', message: 'SMS rate limit exceeded' } };
  },
  EMAIL: async (job) => {
    await new Promise(r => setTimeout(r, 150));
    if (Math.random() > 0.02) {
      return { success: true, providerMessageId: `email_${Date.now()}` };
    }
    return { success: false, error: { code: 'INVALID_RECIPIENT', message: 'Email address invalid' } };
  },
  IN_APP: async (job) => {
    await new Promise(r => setTimeout(r, 50));
    return { success: true, providerMessageId: `inapp_${Date.now()}` };
  },
  WEBHOOK: async (job) => {
    await new Promise(r => setTimeout(r, 300));
    if (Math.random() > 0.15) {
      return { success: true, providerMessageId: `webhook_${Date.now()}` };
    }
    return { success: false, error: { code: 'TIMEOUT', message: 'Webhook timeout' } };
  },
};

const CHANNEL_CONFIGS: Record<NotificationChannel, ChannelConfig> = {
  PUSH: {
    channel: 'PUSH',
    provider: 'FCM/APNS',
    credentials: {},
    rateLimit: { requestsPerSecond: 100, burstLimit: 200 },
    timeoutMs: 5000,
    enabled: true,
  },
  SMS: {
    channel: 'SMS',
    provider: 'Twilio',
    credentials: {},
    rateLimit: { requestsPerSecond: 10, burstLimit: 50 },
    timeoutMs: 10000,
    enabled: true,
  },
  EMAIL: {
    channel: 'EMAIL',
    provider: 'SendGrid',
    credentials: {},
    rateLimit: { requestsPerSecond: 50, burstLimit: 100 },
    timeoutMs: 15000,
    enabled: true,
  },
  IN_APP: {
    channel: 'IN_APP',
    provider: 'Internal',
    credentials: {},
    rateLimit: { requestsPerSecond: 1000, burstLimit: 2000 },
    timeoutMs: 2000,
    enabled: true,
  },
  WEBHOOK: {
    channel: 'WEBHOOK',
    provider: 'Custom',
    credentials: {},
    rateLimit: { requestsPerSecond: 20, burstLimit: 50 },
    timeoutMs: 10000,
    enabled: true,
  },
};

class NotificationEngine {
  private queue: NotificationJob[] = [];
  private processing = false;
  private deadLetterQueue: DeadLetterEntry[] = [];
  private metrics: NotificationMetrics = this.initMetrics();
  private rules: Map<string, NotificationRule> = new Map();
  private channelConfigs: Map<NotificationChannel, ChannelConfig> = new Map(Object.entries(CHANNEL_CONFIGS) as [NotificationChannel, ChannelConfig][]);
  private processingInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Array<(job: NotificationJob) => void> = [];

  private initMetrics(): NotificationMetrics {
    return {
      totalSent: 0,
      totalDelivered: 0,
      totalFailed: 0,
      totalRetried: 0,
      totalFallback: 0,
      totalDlq: 0,
      avgDeliveryTimeMs: 0,
      byChannel: {
        PUSH: { sent: 0, delivered: 0, failed: 0 },
        SMS: { sent: 0, delivered: 0, failed: 0 },
        EMAIL: { sent: 0, delivered: 0, failed: 0 },
        IN_APP: { sent: 0, delivered: 0, failed: 0 },
        WEBHOOK: { sent: 0, delivered: 0, failed: 0 },
      },
      byPriority: {
        LOW: { sent: 0, delivered: 0, failed: 0 },
        NORMAL: { sent: 0, delivered: 0, failed: 0 },
        HIGH: { sent: 0, delivered: 0, failed: 0 },
        CRITICAL: { sent: 0, delivered: 0, failed: 0 },
        EMERGENCY: { sent: 0, delivered: 0, failed: 0 },
      },
    };
  }

  registerRule(rule: NotificationRule): void {
    this.rules.set(rule.id, rule);
  }

  configureChannel(channel: NotificationChannel, config: Partial<ChannelConfig>): void {
    const existing = this.channelConfigs.get(channel);
    if (existing) {
      this.channelConfigs.set(channel, { ...existing, ...config });
    }
  }

  async enqueue(
    recipient: NotificationRecipient,
    payload: NotificationPayload,
    options?: {
      priority?: NotificationPriority;
      fallbackChain?: NotificationChannel[];
      retryPolicy?: Partial<RetryPolicy>;
      idempotencyKey?: string;
      correlationId?: string;
    }
  ): Promise<string> {
    const rule = this.findMatchingRule(payload.templateId);
    const priority = options?.priority ?? rule?.priority ?? 'NORMAL';
    const fallbackChain = options?.fallbackChain ?? rule?.fallbackChain ?? DEFAULT_FALLBACK_CHAINS[priority];
    const retryPolicy = { ...DEFAULT_RETRY_POLICY, ...rule?.retryPolicy, ...options?.retryPolicy };

    const availableChannels = fallbackChain.filter(c =>
      recipient.preferences.enabledChannels.includes(c) && this.channelConfigs.get(c)?.enabled
    );

    if (availableChannels.length === 0) {
      availableChannels.push('IN_APP');
    }

    const job: NotificationJob = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
      correlationId: options?.correlationId ?? `corr_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recipient,
      payload,
      status: 'CREATED',
      currentChannel: availableChannels[0] ?? 'IN_APP',
      attempt: 0,
      maxAttempts: retryPolicy.maxAttempts,
      retryPolicy,
      fallbackChain: availableChannels,
      idempotencyKey: options?.idempotencyKey ?? createIdempotencyKey('notification'),
    };

    this.queue.push(job);
    this.processQueue();

    return job.id;
  }

  private findMatchingRule(templateId: string): NotificationRule | null {
    for (const rule of this.rules.values()) {
      if (rule.templateId === templateId && rule.enabled) {
        return rule;
      }
    }
    return null;
  }

  private isInQuietHours(recipient: NotificationRecipient): boolean {
    const { quietHoursStart, quietHoursEnd, timezone } = recipient.preferences;
    if (!quietHoursStart || !quietHoursEnd) return false;

    const now = new Date();
    const tzOffset = this.getTimezoneOffset(timezone);
    const localHour = (now.getUTCHours() + tzOffset + 24) % 24;
    const localMinute = now.getUTCMinutes();

    const [startHour = 0, startMin = 0] = quietHoursStart.split(':').map(Number);
    const [endHour = 0, endMin = 0] = quietHoursEnd.split(':').map(Number);

    const start = startHour * 60 + startMin;
    const end = endHour * 60 + endMin;
    const current = localHour * 60 + localMinute;

    if (start <= end) {
      return current >= start && current < end;
    } else {
      return current >= start || current < end;
    }
  }

  private getTimezoneOffset(timezone: string): number {
    try {
      const date = new Date();
      const utc = date.toLocaleString('en-US', { timeZone: 'UTC', hour12: false });
      const local = date.toLocaleString('en-US', { timeZone: timezone, hour12: false });
      return new Date(local).getTime() - new Date(utc).getTime();
    } catch {
      return 0;
    }
  }

  private calculateDelay(policy: RetryPolicy, attempt: number): number {
    const delay = Math.min(
      policy.baseDelayMs * Math.pow(policy.backoffMultiplier, attempt),
      policy.maxDelayMs
    );
    if (policy.jitter) {
      return delay * (0.5 + Math.random() * 0.5);
    }
    return delay;
  }

  private isRetryableError(errorCode: string, policy: RetryPolicy): boolean {
    return policy.retryableErrors.includes(errorCode);
  }

  private getNextChannel(job: NotificationJob): NotificationChannel | null {
    const currentIndex = job.fallbackChain.indexOf(job.currentChannel);
    if (currentIndex >= 0 && currentIndex < job.fallbackChain.length - 1) {
      return job.fallbackChain[currentIndex + 1] ?? null;
    }
    return null;
  }

  async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift()!;

      if (this.isInQuietHours(job.recipient) && job.payload.priority !== 'EMERGENCY' && !job.recipient.preferences.criticalOverride) {
        job.status = 'QUEUED';
        this.queue.push(job);
        await new Promise(r => setTimeout(r, 60000));
        continue;
      }

      await this.processJob(job);
    }

    this.processing = false;
  }

  private async processJob(job: NotificationJob): Promise<void> {
    const config = this.channelConfigs.get(job.currentChannel);
    if (!config || !config.enabled) {
      const nextChannel = this.getNextChannel(job);
      if (nextChannel) {
        await this.fallback(job, nextChannel);
        return;
      }
      await this.moveToDlq(job, 'CHANNEL_DISABLED');
      return;
    }

    const provider = MOCK_PROVIDERS[job.currentChannel];
    if (!provider) {
      const nextChannel = this.getNextChannel(job);
      if (nextChannel) {
        await this.fallback(job, nextChannel);
        return;
      }
      await this.moveToDlq(job, 'NO_PROVIDER');
      return;
    }

    job.status = 'SENDING';
    job.attempt += 1;
    job.updatedAt = new Date().toISOString();
    this.metrics.totalSent += 1;
    this.metrics.byChannel[job.currentChannel].sent += 1;
    this.metrics.byPriority[job.payload.priority].sent += 1;
    this.notifyListeners(job);

    try {
      const result = await provider(job, config);

      if (result.success) {
        job.status = 'SENT';
        job.deliveryReceipt = {
          providerMessageId: result.providerMessageId!,
          deliveredAt: new Date().toISOString(),
          channel: job.currentChannel,
        };
        job.updatedAt = new Date().toISOString();
        this.metrics.totalDelivered += 1;
        this.metrics.byChannel[job.currentChannel].delivered += 1;
        this.metrics.byPriority[job.payload.priority].delivered += 1;
        this.logAudit(job, 'SUCCESS');
      } else {
        await this.handleFailure(job, result.error!);
      }
    } catch (error) {
      await this.handleFailure(job, {
        code: 'UNEXPECTED_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    this.notifyListeners(job);
  }

  private async handleFailure(job: NotificationJob, error: { code: string; message: string }): Promise<void> {
    job.lastError = {
      code: error.code,
      message: error.message,
      timestamp: new Date().toISOString(),
    };

    const isLastAttempt = job.attempt >= job.maxAttempts;
    const isRetryable = this.isRetryableError(error.code, job.retryPolicy);

    if (!isLastAttempt && isRetryable) {
      job.status = 'RETRYING';
      const delay = this.calculateDelay(job.retryPolicy, job.attempt);
      await new Promise(r => setTimeout(r, delay));
      this.queue.unshift(job);
      this.metrics.totalRetried += 1;
      this.logAudit(job, 'FAILURE', error);
    } else if (!isLastAttempt && !isRetryable) {
      const nextChannel = this.getNextChannel(job);
      if (nextChannel) {
        await this.fallback(job, nextChannel);
      } else {
        await this.moveToDlq(job, 'NON_RETRYABLE_ERROR');
      }
    } else {
      const nextChannel = this.getNextChannel(job);
      if (nextChannel) {
        await this.fallback(job, nextChannel);
      } else {
        job.status = 'EXHAUSTED';
        await this.moveToDlq(job, 'MAX_ATTEMPTS_EXHAUSTED');
      }
    }
  }

  private async fallback(job: NotificationJob, nextChannel: NotificationChannel): Promise<void> {
    job.status = 'FALLBACK';
    job.currentChannel = nextChannel;
    job.attempt = 0;
    job.updatedAt = new Date().toISOString();
    this.metrics.totalFallback += 1;
    this.queue.unshift(job);
    this.logAudit(job, 'FALLBACK', { code: 'FALLBACK', message: `Falling back to ${nextChannel}` });
  }

  private async moveToDlq(job: NotificationJob, reason: string): Promise<void> {
    job.status = 'DLQ';
    job.updatedAt = new Date().toISOString();

    const dlqEntry: DeadLetterEntry = {
      id: `dlq_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
      jobId: job.id,
      correlationId: job.correlationId,
      reason,
      finalError: job.lastError ?? { code: 'UNKNOWN', message: 'Unknown error', timestamp: new Date().toISOString() },
      job,
      createdAt: new Date().toISOString(),
      resolved: false,
    };

    this.deadLetterQueue.push(dlqEntry);
    this.metrics.totalDlq += 1;
    this.metrics.totalFailed += 1;
    this.metrics.byChannel[job.currentChannel].failed += 1;
    this.metrics.byPriority[job.payload.priority].failed += 1;

    this.logAudit(job, 'FAILURE', { code: 'DLQ', message: reason });
  }

  private logAudit(job: NotificationJob, outcome: 'SUCCESS' | 'FAILURE' | 'FALLBACK', error?: { code: string; message: string }): void {
    const entry = createAuditEntry({
      actorUserId: job.recipient.userId,
      actorType: 'SYSTEM',
      societyId: job.recipient.societyId,
      ...(job.recipient.unitId ? { unitId: job.recipient.unitId } : {}),
      action: 'NOTIFICATION_SEND',
      entityType: 'NOTIFICATION',
      entityId: job.id,
      previousState: { status: job.status },
      newState: { status: job.status, channel: job.currentChannel, attempt: job.attempt },
      idempotencyKey: job.idempotencyKey,
      source: 'SYSTEM_JOB',
      outcome: outcome === 'FALLBACK' ? 'PARTIAL' : outcome,
      ...(error ? { error } : {}),
    });
    auditService.log(entry);
  }

  getMetrics(): NotificationMetrics {
    return { ...this.metrics };
  }

  getDeadLetterQueue(): DeadLetterEntry[] {
    return [...this.deadLetterQueue];
  }

  async retryDlqEntry(dlqId: string): Promise<boolean> {
    const index = this.deadLetterQueue.findIndex(e => e.id === dlqId);
    if (index === -1) return false;

    const entry = this.deadLetterQueue[index];
    if (!entry) return false;

    entry.resolved = true;
    entry.resolvedAt = new Date().toISOString();
    entry.resolution = 'Retried manually';

    const job = { ...entry.job, id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`, attempt: 0, status: 'CREATED' as NotificationStatus };
    this.queue.push(job);
    this.processQueue();

    return true;
  }

  onJobUpdate(listener: (job: NotificationJob) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }

  private notifyListeners(job: NotificationJob): void {
    this.listeners.forEach(l => l(job));
  }

  startBackgroundProcessing(intervalMs = 5000): void {
    if (this.processingInterval) return;
    this.processingInterval = setInterval(() => this.processQueue(), intervalMs);
  }

  stopBackgroundProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }
}

export const notificationEngine = new NotificationEngine();