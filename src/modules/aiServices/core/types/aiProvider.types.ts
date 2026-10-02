export type AiProviderType = 'OPENAI' | 'ANTHROPIC' | 'AZURE_OPENAI' | 'LOCAL' | 'CUSTOM';

export type AiProviderConfig = {
  id: string;
  name: string;
  type: AiProviderType;
  endpoint?: string;
  apiKeyRef?: string;
  organizationId?: string;
  projectId?: string;
  region?: string;
  enabled: boolean;
  capabilities: string[];
  rateLimitPerMinute: number;
  timeoutMs: number;
  maxRetries: number;
  circuitBreakerThreshold: number;
  circuitBreakerRecoveryMs: number;
  healthCheckIntervalMs: number;
  createdAt: string;
  updatedAt: string;
};

export type AiProviderHealth = {
  providerId: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'CIRCUIT_OPEN';
  lastCheckAt: string;
  consecutiveFailures: number;
  lastFailureAt?: string;
  lastFailureReason?: string;
  circuitOpenedAt?: string;
  nextRetryAt?: string;
  latencyP50Ms: number;
  latencyP95Ms: number;
  latencyP99Ms: number;
  errorRate: number;
  requestCount: number;
  successCount: number;
  failureCount: number;
};

export type AiProviderCircuitBreaker = {
  providerId: string;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureThreshold: number;
  recoveryTimeoutMs: number;
  consecutiveFailures: number;
  lastFailureAt: number;
  lastStateChangeAt: string;
};

export type AiProviderCapability = {
  capability: string;
  supportedModels: string[];
  maxInputTokens: number;
  maxOutputTokens: number;
  supportedLanguages: string[];
  supportsStreaming: boolean;
  supportsFunctionCalling: boolean;
};

export type AiProviderRegistry = {
  providers: Map<string, AiProviderConfig>;
  health: Map<string, AiProviderHealth>;
  circuitBreakers: Map<string, AiProviderCircuitBreaker>;
  capabilities: Map<string, AiProviderCapability>;
};

export type AiProviderSelectionCriteria = {
  capability: string;
  preferredModelTypes?: string[];
  maxLatencyMs?: number;
  minConfidenceThreshold?: number;
  requireStreaming?: boolean;
  requireFunctionCalling?: boolean;
  excludedProviderIds?: string[];
};

export type AiProviderFailoverPolicy = {
  primaryProviderId: string;
  fallbackProviderIds: string[];
  failoverTrigger: 'TIMEOUT' | 'ERROR_RATE' | 'CIRCUIT_OPEN' | 'RATE_LIMIT' | 'ALL';
  maxFailoverAttempts: number;
  failoverTimeoutMs: number;
};

export type CreateAiProviderConfigCommand = {
  name: string;
  type: AiProviderType;
  endpoint?: string;
  apiKeyRef?: string;
  organizationId?: string;
  projectId?: string;
  region?: string;
  capabilities: string[];
  rateLimitPerMinute: number;
  timeoutMs: number;
  maxRetries: number;
  circuitBreakerThreshold: number;
  circuitBreakerRecoveryMs: number;
  healthCheckIntervalMs: number;
};

export type UpdateAiProviderConfigCommand = {
  name?: string;
  endpoint?: string;
  apiKeyRef?: string;
  organizationId?: string;
  projectId?: string;
  region?: string;
  enabled?: boolean;
  capabilities?: string[];
  rateLimitPerMinute?: number;
  timeoutMs?: number;
  maxRetries?: number;
  circuitBreakerThreshold?: number;
  circuitBreakerRecoveryMs?: number;
  healthCheckIntervalMs?: number;
};