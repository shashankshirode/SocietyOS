import {
  AiProvider,
  AiModelConfig,
  AiPromptTemplate,
  AiRequest,
  AiResponse,
  AiProviderStatus,
  AiProviderMetrics,
  AiResultSource,
  CreateAiProviderCommand,
  CreateAiModelCommand,
  CreateAiPromptTemplateCommand,
  RequestAiAnalysisCommand,
  AiCapability,
} from '../types';
import { AiProviderPort } from '../types/aiProviderPort';
import { LocalFallbackProvider } from '../providers/localFallbackProvider';

interface CircuitBreakerState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  consecutiveFailures: number;
  lastFailureAt: number;
  lastStateChange: string;
  nextRetryAt?: number;
}

const providers: Map<string, AiProvider> = new Map();
const models: Map<string, AiModelConfig> = new Map();
const templates: Map<string, AiPromptTemplate> = new Map();
const providerInstances: Map<string, any> = new Map();
const circuitBreakers: Map<string, CircuitBreakerState> = new Map();
const requestCounts: Map<string, { count: number; windowStart: number }> = new Map();
let localFallbackInstance: LocalFallbackProvider | null = null;

async function getLocalFallback(): Promise<LocalFallbackProvider> {
  if (!localFallbackInstance) {
    const { LocalFallbackProvider } = await import('../providers/localFallbackProvider');
    localFallbackInstance = new LocalFallbackProvider();
  }
  return localFallbackInstance;
}

function generateId(): string {
  return `ai_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getNow(): string {
  return new Date().toISOString();
}

function getCircuitBreakerStateInternal(providerId: string): CircuitBreakerState {
  if (!circuitBreakers.has(providerId)) {
    const provider = providers.get(providerId);
    circuitBreakers.set(providerId, {
      state: 'CLOSED',
      consecutiveFailures: 0,
      lastFailureAt: 0,
      lastStateChange: getNow(),
    });
  }
  return circuitBreakers.get(providerId)!;
}

function recordSuccessInternal(providerId: string): void {
  const cb = getCircuitBreakerStateInternal(providerId);
  cb.consecutiveFailures = 0;
  if (cb.state === 'HALF_OPEN') {
    cb.state = 'CLOSED';
    cb.lastStateChange = getNow();
    updateProviderStatusInternal(providerId, 'HEALTHY');
  }
}

function recordFailureInternal(providerId: string, threshold: number, recoveryTimeoutMs: number): void {
  const cb = getCircuitBreakerStateInternal(providerId);
  cb.consecutiveFailures += 1;
  cb.lastFailureAt = Date.now();

  if (cb.consecutiveFailures >= threshold) {
    cb.state = 'OPEN';
    cb.lastStateChange = getNow();
    cb.nextRetryAt = Date.now() + recoveryTimeoutMs;
    updateProviderStatusInternal(providerId, 'CIRCUIT_OPEN');
  }
}

function checkCircuitBreakerStateInternal(providerId: string): boolean {
  const cb = getCircuitBreakerStateInternal(providerId);
  if (cb.state === 'OPEN') {
    if (cb.nextRetryAt && Date.now() >= cb.nextRetryAt) {
      cb.state = 'HALF_OPEN';
      cb.lastStateChange = getNow();
      return true;
    }
    return false;
  }
  return true;
}

function updateProviderStatusInternal(providerId: string, status: string): void {
  console.log(`[AiOrchestration] Provider ${providerId} status changed to ${status}`);
}

function checkRateLimitInternal(providerId: string, limit: number): boolean {
  const now = Date.now();
  const current = requestCounts.get(providerId) || { count: 0, windowStart: now };

  if (now - current.windowStart > 60000) {
    requestCounts.set(providerId, { count: 1, windowStart: now });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count += 1;
  requestCounts.set(providerId, current);
  return true;
}


const localFallback = new LocalFallbackProvider();

export const aiOrchestrationService = {
  registerProvider(command: any): any {
    const provider: any = {
      id: generateId(),
      name: command.name,
      type: command.type,
      endpoint: command.endpoint,
      enabled: true,
      capabilities: command.capabilities,
      rateLimitPerMinute: command.rateLimitPerMinute,
      timeoutMs: command.timeoutMs,
      maxRetries: 3,
      circuitBreakerThreshold: command.circuitBreakerThreshold,
      circuitBreakerRecoveryMs: command.circuitBreakerRecoveryMs,
      healthCheckIntervalMs: command.healthCheckIntervalMs,
      createdAt: getNow(),
      updatedAt: getNow(),
    };
    providers.set(provider.id, provider);
    return provider;
  },

  getProvider(providerId: string): any {
    return providers.get(providerId);
  },

  getAllProviders(): any[] {
    return Array.from(providers.values());
  },

  registerModel(command: any): any {
    const model: any = {
      id: generateId(),
      providerId: command.providerId,
      name: command.name,
      version: command.version,
      type: command.type,
      capabilities: command.capabilities,
      confidenceThreshold: command.confidenceThreshold,
      maxTokens: command.maxTokens,
      temperature: command.temperature,
      topP: command.topP,
      systemPromptTemplateId: command.systemPromptTemplateId,
      enabled: true,
      effectiveFrom: command.effectiveFrom,
      effectiveTo: command.effectiveTo,
      metadata: command.metadata,
      createdAt: getNow(),
      updatedAt: getNow(),
    };
    models.set(model.id, model);
    return model;
  },

  getModel(modelId: string): any {
    return models.get(modelId);
  },

  getModelsForProvider(providerId: string): any[] {
    return Array.from(models.values()).filter(m => m.providerId === providerId && m.enabled);
  },

  registerPromptTemplate(command: any): any {
    const template: any = {
      id: generateId(),
      capability: command.capability,
      version: 1,
      name: command.name,
      description: command.description,
      systemPrompt: command.systemPrompt,
      userPromptTemplate: command.userPromptTemplate,
      outputSchema: command.outputSchema,
      requiredInputFields: command.requiredInputFields,
      optionalInputFields: command.optionalInputFields,
      modelId: command.modelId,
      effectiveFrom: command.effectiveFrom,
      effectiveTo: command.effectiveTo,
      createdBy: 'SYSTEM',
      createdAt: getNow(),
    };
    templates.set(template.id, template);
    return template;
  },

  getPromptTemplate(templateId: string): any {
    return templates.get(templateId);
  },

  getPromptTemplatesForCapability(capability: string): any[] {
    return Array.from(templates.values()).filter(t => t.capability === capability);
  },

  async requestAnalysis(command: any): Promise<any> {
    const model = this.selectModelForCapability(command.capability);
    if (!model) {
      return this.executeWithFallback(command, 'NO_MODEL_CONFIGURED');
    }

    const template = this.getPromptTemplatesForCapability(command.capability)
      .find(t => t.modelId === model.id);
    if (!template) {
      return this.executeWithFallback(command, 'NO_TEMPLATE_CONFIGURED');
    }

    const provider = providers.get(model.providerId);
    if (!provider || !provider.enabled) {
      return this.executeWithFallback(command, 'PROVIDER_NOT_AVAILABLE');
    }

    const request: any = {
      id: generateId(),
      capability: command.capability,
      modelId: model.id,
      templateId: template.id,
      templateVersion: template.version,
      input: command.input,
      minimizedInput: this.minimizeInput(command.input, command.capability),
      contextReferences: [],
      societyId: command.societyId,
      requestedBy: command.requestedBy,
      requestedAt: getNow(),
      idempotencyKey: command.idempotencyKey || `ai_${command.capability}_${Date.now()}`,
      priority: command.priority || 'NORMAL',
      timeoutMs: command.timeoutMs || provider.timeoutMs,
    };

    const instance = providerInstances.get(provider.id);
    if (!instance) {
      return this.executeWithFallback(command, 'PROVIDER_INSTANCE_NOT_INITIALIZED');
    }

    if (!checkCircuitBreakerStateInternal(provider.id)) {
      return this.executeWithFallback(command, 'CIRCUIT_OPEN');
    }

    if (!checkRateLimitInternal(provider.id, provider.rateLimitPerMinute)) {
      return this.executeWithFallback(command, 'RATE_LIMITED');
    }

    try {
      const response = await this.executeWithTimeout(instance, request, provider.timeoutMs);
      recordSuccessInternal(provider.id);
      return response;
    } catch (error) {
      recordFailureInternal(provider.id, provider.circuitBreakerThreshold, provider.circuitBreakerRecoveryMs);
      return this.executeWithFallback(command, 'PROVIDER_ERROR', error);
    }
  },

  selectModelForCapability(capability: string): any {
    const availableModels = Array.from(models.values()).filter(m =>
      m.enabled && m.capabilities.includes(capability) && new Date(m.effectiveFrom) <= new Date()
    );
    if (availableModels.length === 0) return null;
    return availableModels.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  },

  minimizeInput(input: any, capability: string): any {
    const allowedFields: Record<string, string[]> = {
      'COMPLAINT_CLASSIFICATION': ['title', 'description', 'category'],
      'NOTICE_DRAFTING': ['intent', 'audience', 'dates', 'facts'],
      'DOCUMENT_SEARCH': ['query', 'filters'],
      'BILL_EXPLANATION': ['billId', 'chargeHeads', 'period'],
      'MEETING_SUMMARY': ['transcript', 'agenda', 'participants'],
      'MAINTENANCE_RISK': ['assetId', 'metrics', 'history'],
    };
    const allowed = allowedFields[capability] || [];
    const minimized: any = {};
    for (const field of allowed) {
      if (input[field] !== undefined) {
        minimized[field] = input[field];
      }
    }
    return minimized;
  },

  async executeWithTimeout(instance: any, request: any, timeoutMs: number): Promise<any> {
    return Promise.race([
      this.executeRequest(instance, request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs)
      ),
    ]);
  },

  async executeRequest(instance: any, request: any): Promise<any> {
    switch (request.capability) {
      case 'COMPLAINT_CLASSIFICATION':
        return instance.generateClassification(request);
      case 'NOTICE_DRAFTING':
        return instance.generateDraft(request);
      case 'DOCUMENT_SEARCH':
        return instance.generateAnswer(request);
      case 'BILL_EXPLANATION':
        return instance.generateAnswer(request);
      case 'MEETING_SUMMARY':
        return instance.generateSummary(request);
      case 'MAINTENANCE_RISK':
        return instance.generateRiskAssessment(request);
      default:
        return instance.generateText(request);
    }
  },

  async executeWithFallback(
    command: any,
    reason: string,
    error?: unknown
  ): Promise<any> {
    console.warn(`[AiOrchestration] Using fallback for ${command.capability}: ${reason}`, error);

    const request: any = {
      id: generateId(),
      capability: command.capability,
      modelId: 'local-fallback',
      templateId: 'fallback',
      templateVersion: 1,
      input: command.input,
      minimizedInput: this.minimizeInput(command.input, command.capability),
      contextReferences: [],
      societyId: command.societyId,
      requestedBy: command.requestedBy,
      requestedAt: getNow(),
      idempotencyKey: command.idempotencyKey || `fallback_${command.capability}_${Date.now()}`,
      priority: command.priority || 'NORMAL',
      timeoutMs: 5000,
    };

    const localFallback = await import('../providers/localFallbackProvider').then(m => new m.LocalFallbackProvider());
    const response = await localFallback.generateClassification(request);
    return {
      ...response,
      source: 'RULE_FALLBACK' as const,
      warnings: [...(response.warnings || []), `FALLBACK: ${reason}`],
    };
  },

  getProviderMetrics(providerId: string, periodStart: string, periodEnd: string): any {
    const provider = providers.get(providerId);
    if (!provider) return null;

    const cb = getCircuitBreakerStateInternal(providerId);
    return {
      providerId,
      periodStart,
      periodEnd,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      timeoutRequests: 0,
      rateLimitedRequests: 0,
      avgLatencyMs: 0,
      totalTokens: 0,
      estimatedCost: 0,
      circuitBreakerTrips: cb.state === 'OPEN' ? 1 : 0,
      uptimePercentage: cb.state === 'OPEN' ? 0 : 100,
    };
  },

  getProviderHealth(providerId: string): any {
    const provider = providers.get(providerId);
    if (!provider) return null;
    return {
      status: provider.enabled ? 'HEALTHY' : 'NOT_CONFIGURED',
      circuitBreaker: getCircuitBreakerStateInternal(providerId),
    };
  },

  resetCircuitBreaker(providerId: string): void {
    const cb = getCircuitBreakerStateInternal(providerId);
    cb.state = 'CLOSED';
    cb.consecutiveFailures = 0;
    cb.lastStateChange = getNow();
    cb.nextRetryAt = undefined;
    updateProviderStatusInternal(providerId, 'HEALTHY');
  },

  initializeProviderInstance(providerId: string, instance: any): void {
    providerInstances.set(providerId, instance);
  },

  getLocalFallback(): any {
    return localFallback;
  },
};
