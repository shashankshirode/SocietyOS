import {
  AiProvider,
  AiProviderStatus,
  AiModelConfig,
  AiPromptTemplate,
  AiRequest,
  AiResponse,
  AiProviderMetrics,
  CreateAiProviderCommand,
  CreateAiModelCommand,
  CreateAiPromptTemplateCommand,
} from '../types';

export interface AiProviderPort {
  readonly providerId: string;
  readonly providerType: 'OPENAI' | 'ANTHROPIC' | 'AZURE_OPENAI' | 'LOCAL' | 'CUSTOM';

  initialize(config: AiProvider): Promise<void>;
  healthCheck(): Promise<{ healthy: boolean; latencyMs: number; details?: Record<string, unknown> }>;
  getCapabilities(): string[];
  getSupportedModels(): string[];

  generateText(request: AiRequest): Promise<AiResponse>;
  generateClassification(request: AiRequest): Promise<AiResponse>;
  generateDraft(request: AiRequest): Promise<AiResponse>;
  generateAnswer(request: AiRequest): Promise<AiResponse>;
  generateSummary(request: AiRequest): Promise<AiResponse>;
  generateRiskAssessment(request: AiRequest): Promise<AiResponse>;

  streamText?(request: AiRequest): AsyncIterable<Partial<AiResponse>>;
  estimateTokens?(text: string): number;
}

export interface AiProviderFactory {
  createProvider(config: AiProvider): AiProviderPort;
  getSupportedTypes(): string[];
}