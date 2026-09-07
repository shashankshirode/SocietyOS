import type { JsonObject } from '../api/api.types';

export type NotificationChannel = 'PUSH' | 'SMS' | 'EMAIL' | 'IN_APP' | 'WEBHOOK';

export type NotificationPreference = {
  key: string;
  label: string;
  enabled: boolean;
  important?: boolean;
};

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';

export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined' | 'unavailable' | 'error' | 'unknown';

export type NotificationPermissionResult = {
  status: 'granted' | 'denied' | 'undetermined';
  canAskAgain?: boolean;
};

export type NotificationSetupResult = {
  status: NotificationPermissionStatus;
  expoPushToken?: string;
  message: string;
};

export type NotificationStatus =
  | 'CREATED'
  | 'QUEUED'
  | 'SENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'FAILED'
  | 'RETRYING'
  | 'FALLBACK'
  | 'DLQ'
  | 'EXHAUSTED';

export type NotificationTemplate = {
  id: string;
  name: string;
  channel: NotificationChannel;
  subject?: string;
  bodyTemplate: string;
  locale?: string;
  variables: string[];
};

export type NotificationRecipient = {
  userId: string;
  societyId: string;
  unitId?: string;
  channels: {
    push?: { token: string; platform: 'ios' | 'android' | 'web' };
    sms?: { phoneNumber: string };
    email?: { emailAddress: string };
    inApp?: { userId: string };
    webhook?: { url: string; secret: string };
  };
  preferences: {
    quietHoursStart?: string;
    quietHoursEnd?: string;
    timezone: string;
    enabledChannels: NotificationChannel[];
    criticalOverride: boolean;
  };
};

export type NotificationPayload = {
  templateId: string;
  variables: Record<string, string | number | boolean>;
  priority: NotificationPriority;
  metadata?: JsonObject;
};

export type NotificationJob = {
  id: string;
  correlationId: string;
  createdAt: string;
  updatedAt: string;
  recipient: NotificationRecipient;
  payload: NotificationPayload;
  status: NotificationStatus;
  currentChannel: NotificationChannel;
  attempt: number;
  maxAttempts: number;
  retryPolicy: RetryPolicy;
  fallbackChain: NotificationChannel[];
  lastError?: {
    code: string;
    message: string;
    timestamp: string;
    providerResponse?: JsonObject;
  };
  deliveryReceipt?: {
    providerMessageId: string;
    deliveredAt: string;
    channel: NotificationChannel;
  };
  idempotencyKey: string;
};

export type RetryPolicy = {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitter: boolean;
  retryableErrors: string[];
};

export type ChannelConfig = {
  channel: NotificationChannel;
  provider: string;
  credentials: Record<string, string>;
  rateLimit: {
    requestsPerSecond: number;
    burstLimit: number;
  };
  timeoutMs: number;
  enabled: boolean;
};

export type NotificationRule = {
  id: string;
  name: string;
  eventType: string;
  conditions: JsonObject;
  templateId: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  fallbackChain: NotificationChannel[];
  retryPolicy: RetryPolicy;
  enabled: boolean;
};

export type DeadLetterEntry = {
  id: string;
  jobId: string;
  correlationId: string;
  reason: string;
  finalError: {
    code: string;
    message: string;
    timestamp: string;
  };
  job: NotificationJob;
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
  resolution?: string;
};

export type NotificationMetrics = {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalRetried: number;
  totalFallback: number;
  totalDlq: number;
  avgDeliveryTimeMs: number;
  byChannel: Record<NotificationChannel, {
    sent: number;
    delivered: number;
    failed: number;
  }>;
  byPriority: Record<NotificationPriority, {
    sent: number;
    delivered: number;
    failed: number;
  }>;
};

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  jitter: true,
  retryableErrors: ['TIMEOUT', 'RATE_LIMIT', 'PROVIDER_UNAVAILABLE', 'NETWORK_ERROR'],
};

export const DEFAULT_FALLBACK_CHAINS: Record<NotificationPriority, NotificationChannel[]> = {
  LOW: ['IN_APP'],
  NORMAL: ['PUSH', 'IN_APP'],
  HIGH: ['PUSH', 'SMS', 'IN_APP'],
  CRITICAL: ['PUSH', 'SMS', 'EMAIL', 'IN_APP'],
  EMERGENCY: ['PUSH', 'SMS', 'EMAIL', 'WEBHOOK', 'IN_APP'],
};

export const QUIET_HOURS_DEFAULT = {
  start: '22:00',
  end: '07:00',
};