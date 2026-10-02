export type AiCapability =
  | 'COMPLAINT_CLASSIFICATION'
  | 'NOTICE_DRAFTING'
  | 'DOCUMENT_SEARCH'
  | 'BILL_EXPLANATION'
  | 'MEETING_SUMMARY'
  | 'MAINTENANCE_RISK'
  | 'VENDOR_INTELLIGENCE'
  | 'COLLECTION_INTELLIGENCE'
  | 'OPERATIONS_INSIGHTS';

export type AiProviderStatus =
  | 'HEALTHY'
  | 'DEGRADED'
  | 'DOWN'
  | 'CIRCUIT_OPEN'
  | 'NOT_CONFIGURED';

export type AiJobStatus =
  | 'QUEUED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REQUIRES_REVIEW'
  | 'CANCELLED'
  | 'STALE';

export type AiReviewStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'CORRECTED'
  | 'REJECTED';

export type AiResultSource =
  | 'AI_PROVIDER'
  | 'RULE_FALLBACK'
  | 'MANUAL'
  | 'CACHED';

export type AiConfidenceBand =
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'UNCERTAIN';

export type AiEvidenceType =
  | 'SOURCE_DOCUMENT'
  | 'REPORT_METRIC'
  | 'HISTORICAL_DATA'
  | 'ENTITY_REFERENCE'
  | 'EXTERNAL_API';

export type AiModelType =
  | 'TEXT_CLASSIFIER'
  | 'TEXT_GENERATOR'
  | 'MULTIMODAL'
  | 'EMBEDDING'
  | 'SUMMARIZATION'
  | 'CLASSIFICATION';

export type AiProvider = {
  id: string;
  name: string;
  type: 'OPENAI' | 'ANTHROPIC' | 'AZURE_OPENAI' | 'LOCAL' | 'CUSTOM';
  endpoint?: string;
  enabled: boolean;
  capabilities: AiCapability[];
  defaultModelId?: string;
  rateLimitPerMinute: number;
  timeoutMs: number;
  circuitBreakerThreshold: number;
  circuitBreakerRecoveryMs: number;
  createdAt: string;
  updatedAt: string;
};

export type AiModelConfig = {
  id: string;
  providerId: string;
  name: string;
  version: string;
  type: AiModelType;
  capabilities: AiCapability[];
  confidenceThreshold: number;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  systemPromptTemplateId?: string;
  enabled: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type AiPromptTemplate = {
  id: string;
  capability: AiCapability;
  version: number;
  name: string;
  description?: string;
  systemPrompt: string;
  userPromptTemplate: string;
  outputSchema: Record<string, unknown>;
  requiredInputFields: string[];
  optionalInputFields: string[];
  modelId: string;
  effectiveFrom: string;
  effectiveTo?: string;
  createdBy: string;
  createdAt: string;
};

export type AiRequest = {
  id: string;
  capability: AiCapability;
  modelId: string;
  templateId: string;
  templateVersion: number;
  input: Record<string, unknown>;
  minimizedInput: Record<string, unknown>;
  contextReferences: Array<{
    type: AiEvidenceType;
    entityId: string;
    entityType: string;
    asOf: string;
    excerpt?: string;
  }>;
  societyId: string;
  requestedBy: string;
  requestedAt: string;
  idempotencyKey: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  timeoutMs: number;
};

export type AiClassificationCandidate = {
  category: string;
  confidence: number;
  reasoning: string;
  suggestedPriority?: string;
  suggestedSlaHours?: number;
  tags: string[];
  evidenceReferences: Array<{
    type: AiEvidenceType;
    entityId: string;
    entityType: string;
    asOf: string;
  }>;
  warnings: string[];
};

export type AiDraftOutput = {
  content: string;
  format: 'PLAIN_TEXT' | 'MARKDOWN' | 'HTML';
  language: string;
  placeholders: Array<{
    key: string;
    description: string;
    required: boolean;
    exampleValue?: string;
  }>;
  factualReferences: Array<{
    field: string;
    value: unknown;
    source: string;
  }>;
  warnings: string[];
};

export type AiAnswerOutput = {
  answer: string;
  answerType: 'FOUND_IN_SOURCE' | 'INFERRED' | 'NOT_FOUND';
  confidence: number;
  sourceReferences: Array<{
    type: AiEvidenceType;
    entityId: string;
    entityType: string;
    documentId?: string;
    pageNumber?: number;
    chunkId?: string;
    asOf: string;
    excerpt?: string;
  }>;
  warnings: string[];
};

export type AiSummaryOutput = {
  summary: string;
  keyPoints: string[];
  actionItems: Array<{
    description: string;
    assigneeRole?: string;
    dueDate?: string;
    priority?: 'LOW' | 'NORMAL' | 'HIGH';
    sourceReference: string;
  }>;
  decisions: Array<{
    description: string;
    outcome: 'APPROVED' | 'REJECTED' | 'DEFERRED' | 'DISCUSSED';
    sourceReference: string;
  }>;
  confidence: number;
  sourceReferences: Array<{
    type: AiEvidenceType;
    entityId: string;
    entityType: string;
    asOf: string;
  }>;
  warnings: string[];
};

export type AiRiskOutput = {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  factors: Array<{
    factor: string;
    value: unknown;
    weight: number;
    description: string;
  }>;
  evidence: Array<{
    type: AiEvidenceType;
    entityId: string;
    entityType: string;
    metric: string;
    value: number;
    asOf: string;
  }>;
  recommendations: Array<{
    action: string;
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    rationale: string;
  }>;
  confidence: number;
  dataFreshness: string;
  modelVersion: string;
  warnings: string[];
};

export type AiResponse = {
  requestId: string;
  capability: AiCapability;
  modelId: string;
  modelVersion: string;
  templateId: string;
  templateVersion: number;
  source: AiResultSource;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'REQUIRES_REVIEW';
  primaryOutput:
    | AiClassificationCandidate
    | AiDraftOutput
    | AiAnswerOutput
    | AiSummaryOutput
    | AiRiskOutput;
  alternatives?: Array<AiClassificationCandidate | AiDraftOutput>;
  processingTimeMs: number;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  confidence: number;
  confidenceBand: AiConfidenceBand;
  warnings: string[];
  completedAt: string;
  expiresAt?: string;
};

export type AiHumanReview = {
  id: string;
  requestId: string;
  responseId: string;
  capability: AiCapability;
  reviewerId: string;
  reviewerRole: string;
  reviewedAt: string;
  status: AiReviewStatus;
  originalOutput: AiResponse['primaryOutput'];
  correctedOutput?: AiResponse['primaryOutput'];
  correctionReason?: string;
  feedback: 'ACCEPTED' | 'CORRECTED' | 'REJECTED';
  modelVersion: string;
  templateVersion: number;
};

export type AiEvaluationRecord = {
  id: string;
  capability: AiCapability;
  modelId: string;
  modelVersion: string;
  templateVersion: number;
  evaluatedAt: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  reviewRequiredRequests: number;
  acceptedReviews: number;
  correctedReviews: number;
  rejectedReviews: number;
  avgConfidence: number;
  avgProcessingTimeMs: number;
  accuracyMetrics?: {
    precision: number;
    recall: number;
    f1Score: number;
  };
  driftDetected: boolean;
  driftDetails?: string;
};

export type AiProviderMetrics = {
  providerId: string;
  periodStart: string;
  periodEnd: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  timeoutRequests: number;
  rateLimitedRequests: number;
  avgLatencyMs: number;
  totalTokens: number;
  estimatedCost: number;
  circuitBreakerTrips: number;
  uptimePercentage: number;
};

export type CreateAiProviderCommand = {
  name: string;
  type: AiProvider['type'];
  endpoint?: string;
  capabilities: AiCapability[];
  rateLimitPerMinute: number;
  timeoutMs: number;
  circuitBreakerThreshold: number;
  circuitBreakerRecoveryMs: number;
};

export type CreateAiModelCommand = {
  providerId: string;
  name: string;
  version: string;
  type: AiModelType;
  capabilities: AiCapability[];
  confidenceThreshold: number;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  systemPromptTemplateId?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  metadata: Record<string, unknown>;
};

export type CreateAiPromptTemplateCommand = {
  capability: AiCapability;
  name: string;
  description?: string;
  systemPrompt: string;
  userPromptTemplate: string;
  outputSchema: Record<string, unknown>;
  requiredInputFields: string[];
  optionalInputFields: string[];
  modelId: string;
  effectiveFrom: string;
  effectiveTo?: string;
};

export type SubmitAiReviewCommand = {
  requestId: string;
  responseId: string;
  reviewerId: string;
  reviewerRole: string;
  status: 'ACCEPTED' | 'CORRECTED' | 'REJECTED';
  correctedOutput?: AiResponse['primaryOutput'];
  correctionReason?: string;
};

export type RequestAiAnalysisCommand = {
  capability: AiCapability;
  input: Record<string, unknown>;
  societyId: string;
  requestedBy: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH';
  timeoutMs?: number;
  idempotencyKey?: string;
};