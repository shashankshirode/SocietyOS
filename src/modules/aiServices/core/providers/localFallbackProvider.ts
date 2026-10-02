import {
  AiProvider,
  AiRequest,
  AiResponse,
  AiResultSource,
  AiConfidenceBand,
  AiClassificationCandidate,
  AiDraftOutput,
  AiAnswerOutput,
  AiSummaryOutput,
  AiRiskOutput,
} from '../types/aiRequest.types';
import { AiProviderPort } from '../types/aiProviderPort';

export class LocalFallbackProvider implements AiProviderPort {
  readonly providerId = 'local-fallback';
  readonly providerType = 'LOCAL' as const;

  private categoryKeywords: Record<string, string[]> = {
    PLUMBING: ['leak', 'pipe', 'water', 'tap', 'faucet', 'drain', 'toilet', 'flush', 'clog', 'blockage', 'sewer', 'drainage'],
    ELECTRICAL: ['power', 'electric', 'light', 'switch', 'socket', 'wire', 'circuit', 'breaker', 'outage', 'voltage', 'spark', 'shock'],
    HVAC: ['ac', 'air condition', 'cooling', 'heating', 'ventilation', 'thermostat', 'compressor', 'refrigerant', 'filter'],
    STRUCTURAL: ['crack', 'wall', 'ceiling', 'floor', 'beam', 'column', 'foundation', 'settlement', 'damp', 'mold', 'water damage'],
    SECURITY: ['theft', 'break', 'intruder', 'unauthorized', 'suspicious', 'trespass', 'vandalism', 'camera', 'alarm', 'gate'],
    HOUSEKEEPING: ['clean', 'dirt', 'garbage', 'trash', 'sweep', 'mop', 'dust', 'lobby', 'corridor', 'common area'],
    PEST_CONTROL: ['rat', 'mouse', 'cockroach', 'ant', 'termite', 'mosquito', 'bedbug', 'pest', 'infestation', 'fumigation'],
    WATER_SUPPLY: ['water supply', 'no water', 'low pressure', 'tank', 'pump', 'municipal', 'borewell', 'shortage'],
    POWER_BACKUP: ['generator', 'dg', 'ups', 'inverter', 'battery', 'backup power', 'load shedding'],
    LIFT: ['lift', 'elevator', 'stuck', 'door', 'floor', 'button', 'alarm', 'maintenance', 'service'],
    FIRE_SAFETY: ['fire', 'smoke', 'extinguisher', 'hydrant', 'sprinkler', 'alarm', 'evacuation', 'drill', 'noc'],
    WASTE_MANAGEMENT: ['garbage', 'waste', 'segregation', 'recycle', 'compost', 'pickup', 'collection', 'bin', 'dump'],
    NOISE: ['noise', 'loud', 'music', 'party', 'construction', 'drilling', 'hammer', 'disturbance'],
    PARKING: ['parking', 'slot', 'vehicle', 'car', 'bike', 'unauthorized', 'blocked', 'rfid', 'sticker'],
    OTHER: [],
  };

  private priorityRules: Record<string, string> = {
    PLUMBING: 'HIGH',
    ELECTRICAL: 'HIGH',
    HVAC: 'NORMAL',
    STRUCTURAL: 'CRITICAL',
    SECURITY: 'EMERGENCY',
    HOUSEKEEPING: 'LOW',
    PEST_CONTROL: 'NORMAL',
    WATER_SUPPLY: 'CRITICAL',
    POWER_BACKUP: 'HIGH',
    LIFT: 'HIGH',
    FIRE_SAFETY: 'EMERGENCY',
    WASTE_MANAGEMMENT: 'NORMAL',
    NOISE: 'LOW',
    PARKING: 'LOW',
    OTHER: 'NORMAL',
  };

  private slaHours: Record<string, number> = {
    PLUMBING: 4,
    ELECTRICAL: 4,
    HVAC: 24,
    STRUCTURAL: 2,
    SECURITY: 1,
    HOUSEKEEPING: 24,
    PEST_CONTROL: 48,
    WATER_SUPPLY: 2,
    POWER_BACKUP: 4,
    LIFT: 2,
    FIRE_SAFETY: 1,
    WASTE_MANAGEMENT: 24,
    NOISE: 24,
    PARKING: 24,
    OTHER: 24,
  };

  async initialize(config: AiProvider): Promise<void> {
    console.log('[LocalFallbackProvider] Initialized as fallback provider');
  }

  async healthCheck(): Promise<{ healthy: boolean; latencyMs: number; details?: Record<string, unknown> }> {
    return { healthy: true, latencyMs: 1, details: { mode: 'local_fallback' } };
  }

  getCapabilities(): string[] {
    return ['COMPLAINT_CLASSIFICATION'];
  }

  getSupportedModels(): string[] {
    return ['local-keyword-classifier-v1'];
  }

  async generateText(request: AiRequest): Promise<AiResponse> {
    return this.generateDraft(request);
  }

  async generateClassification(request: AiRequest): Promise<AiResponse> {
    const startTime = Date.now();
    const text = String(request.input.text ?? request.input.title ?? request.input.description ?? '').toLowerCase();

    const scores: Record<string, number> = {};
    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      let score = 0;
      for (const keyword of keywords) {
        if (text.includes(keyword.toLowerCase())) {
          score += 1;
        }
      }
      scores[category] = score;
    }

    const sortedCategories = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .filter(([, score]) => score > 0);

    const primaryCategory = sortedCategories.length > 0 ? (sortedCategories[0][0] as string) : 'OTHER';
    const confidence = Math.min(0.5 + (scores[primaryCategory] ?? 0) * 0.15, 0.95);

    const classifications: AiClassificationCandidate[] = sortedCategories.slice(0, 3).map(([category, score]) => ({
      category,
      confidence: Math.min(0.3 + score * 0.1, 0.9),
      reasoning: `Keywords matched: ${this.categoryKeywords[category].filter(k => text.includes(k.toLowerCase())).join(', ')}`,
      suggestedPriority: this.priorityRules[category] || 'NORMAL',
      suggestedSlaHours: this.slaHours[category] || 24,
      tags: this.categoryKeywords[category].filter(k => text.includes(k.toLowerCase())),
      evidenceReferences: [],
      warnings: [],
    }));

    if (classifications.length === 0) {
      classifications.push({
        category: 'OTHER',
        confidence: 0.5,
        reasoning: 'No specific keywords matched',
        suggestedPriority: 'NORMAL',
        suggestedSlaHours: 24,
        tags: [],
        evidenceReferences: [],
        warnings: [],
      });
    }

    // Ensure we always have a primary classification (guaranteed non-empty after push above)
    const primaryClassification = classifications[0]!;

    const response: AiResponse = {
      requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
      capability: 'COMPLAINT_CLASSIFICATION',
      modelId: 'local-keyword-classifier-v1',
      modelVersion: '1.0.0-fallback',
      templateId: 'complaint-classification-v1',
      templateVersion: 1,
      source: 'RULE_FALLBACK' as const,
      status: primaryClassification.confidence < 0.7 ? 'REQUIRES_REVIEW' : 'SUCCESS',
      primaryOutput: primaryClassification,
      alternatives: classifications.slice(1),
      processingTimeMs: Date.now() - startTime,
      tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      confidence: primaryClassification.confidence,
      confidenceBand: this.getConfidenceBand(primaryClassification.confidence),
      warnings: primaryClassification.confidence < 0.7 ? ['FALLBACK_CLASSIFIER: Confidence below threshold, human review recommended'] : ['FALLBACK_CLASSIFIER: Result from deterministic keyword-based fallback'],
      completedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    return response;
  }

  async generateDraft(request: AiRequest): Promise<AiResponse> {
    const draft: AiDraftOutput = {
      content: `[FALLBACK DRAFT] ${String(request.input.intent || 'No intent provided')}`,
      format: 'PLAIN_TEXT',
      language: 'en',
      placeholders: [],
      factualReferences: [],
      warnings: ['FALLBACK_DRAFT: Generated by deterministic template, not AI'],
    };

    return this.createResponse(request, draft, 'NOTICE_DRAFTING');
  }

  async generateAnswer(request: AiRequest): Promise<AiResponse> {
    const answer = {
      answer: 'Information not available in fallback mode',
      answerType: 'NOT_FOUND' as const,
      confidence: 0.1,
      sourceReferences: [],
      warnings: ['FALLBACK_ANSWER: AI provider unavailable, using deterministic fallback'],
    };

    return this.createResponse(request, answer, 'DOCUMENT_SEARCH');
  }

  async generateSummary(request: AiRequest): Promise<AiResponse> {
    const summary = {
      summary: '[FALLBACK SUMMARY] Summary not available in fallback mode',
      keyPoints: [],
      actionItems: [],
      decisions: [],
      confidence: 0.1,
      sourceReferences: [],
      warnings: ['FALLBACK_SUMMARY: AI provider unavailable'],
    };

    return this.createResponse(request, summary, 'MEETING_SUMMARY');
  }

  async generateRiskAssessment(request: AiRequest): Promise<AiResponse> {
    const risk = {
      riskLevel: 'LOW' as const,
      riskScore: 10,
      factors: [],
      evidence: [],
      recommendations: [],
      confidence: 0.1,
      dataFreshness: new Date().toISOString(),
      modelVersion: 'fallback-v1',
      warnings: ['FALLBACK_RISK: AI provider unavailable'],
    };

    return this.createResponse(request, risk, 'MAINTENANCE_RISK');
  }

  private createResponse(request: AiRequest, output: any, capability: string): AiResponse {
    return {
      requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
      capability: capability as any,
      modelId: 'local-fallback-v1',
      modelVersion: '1.0.0-fallback',
      templateId: `${capability.toLowerCase()}-v1`,
      templateVersion: 1,
      source: 'RULE_FALLBACK' as const,
      status: 'SUCCESS',
      primaryOutput: output,
      processingTimeMs: 5,
      tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      confidence: 0.1,
      confidenceBand: 'UNCERTAIN' as const,
      warnings: [`FALLBACK: ${capability} generated by deterministic fallback, not AI`],
      completedAt: new Date().toISOString(),
    };
  }

  private getConfidenceBand(confidence: number): 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN' {
    if (confidence >= 0.8) return 'HIGH';
    if (confidence >= 0.6) return 'MEDIUM';
    if (confidence >= 0.4) return 'LOW';
    return 'UNCERTAIN';
  }

  estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}