import {
  AIModelConfig,
  AIAnalysisRequest,
  AIAnalysisResponse,
  AIClassification,
  AIAnalysisJob,
  HumanReview,
  DEFAULT_AI_MODELS,
  CATEGORY_KEYWORDS,
  PRIORITY_RULES,
  SLA_HOURS,
  ClassificationCategory,
} from './aiClassification.types';

export type {
  AIModelConfig,
  AIAnalysisRequest,
  AIAnalysisResponse,
  AIClassification,
  AIAnalysisJob,
  HumanReview,
} from './aiClassification.types';
import { createIdempotencyKey } from '../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../core/audit';
import { apiClient } from '../../core/api/apiClient';
import { apiEndpoints } from '../../core/api/apiEndpoints';

class AIClassificationEngine {
  private models: Map<string, AIModelConfig> = new Map();
  private jobs: Map<string, AIAnalysisJob> = new Map();
  private reviews: Map<string, HumanReview> = new Map();
  private listeners: Array<(job: AIAnalysisJob) => void> = [];

  constructor() {
    DEFAULT_AI_MODELS.forEach(m => this.models.set(m.id, m));
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      const stored = localStorage.getItem('ai_classification_jobs');
      if (stored) {
        const jobs = JSON.parse(stored);
        jobs.forEach((j: AIAnalysisJob) => this.jobs.set(j.id, j));
      }
      const reviews = localStorage.getItem('ai_reviews');
      if (reviews) {
        const parsed = JSON.parse(reviews);
        parsed.forEach((r: HumanReview) => this.reviews.set(r.id, r));
      }
    } catch (error) {
      console.error('[AIClassificationEngine] Failed to load from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem('ai_classification_jobs', JSON.stringify(Array.from(this.jobs.values())));
      localStorage.setItem('ai_reviews', JSON.stringify(Array.from(this.reviews.values())));
    } catch (error) {
      console.error('[AIClassificationEngine] Failed to save to storage:', error);
    }
  }

  getModels(): AIModelConfig[] {
    return Array.from(this.models.values()).filter(m => m.enabled);
  }

  getModel(id: string): AIModelConfig | null {
    return this.models.get(id) ?? null;
  }

  async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const model = this.getBestModel(request);
    if (!model) {
      throw new Error('No AI model available');
    }

    const jobId = `ai_job_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
    const job: AIAnalysisJob = {
      id: jobId,
      request,
      status: 'QUEUED',
      createdAt: new Date().toISOString(),
    };

    this.jobs.set(jobId, job);
    this.saveToStorage();
    this.notifyListeners(job);

    try {
      job.status = 'PROCESSING';
      this.notifyListeners(job);

      const response = await this.callAIModel(model, request);

      job.response = response;
      job.status = response.primaryClassification.confidence < model.confidenceThreshold
        ? 'REQUIRES_REVIEW'
        : 'COMPLETED';
      job.completedAt = new Date().toISOString();
      this.jobs.set(jobId, job);
      this.saveToStorage();

      createAuditEntry({
        actorUserId: 'AI_SERVICE',
        actorType: 'AI_SERVICE',
        societyId: request.metadata?.societyId as string ?? '',
        action: 'AI_COMPLAINT_CLASSIFICATION',
        entityType: 'AI_ANALYSIS',
        entityId: jobId,
        newState: {
          category: response.primaryClassification.category,
          confidence: response.primaryClassification.confidence,
          modelVersion: model.version,
        },
        idempotencyKey: createIdempotencyKey('ai_classify'),
        source: 'AI_SERVICE',
        outcome: job.status === 'COMPLETED' ? 'SUCCESS' : 'PARTIAL',
      });

      this.notifyListeners(job);
      return response;
    } catch (error) {
      job.status = 'FAILED';
      job.error = error instanceof Error ? error.message : 'AI analysis failed';
      job.completedAt = new Date().toISOString();
      this.jobs.set(jobId, job);
      this.saveToStorage();

      createAuditEntry({
        actorUserId: 'AI_SERVICE',
        actorType: 'AI_SERVICE',
        societyId: request.metadata?.societyId as string ?? '',
        action: 'AI_COMPLAINT_CLASSIFICATION_FAILED',
        entityType: 'AI_ANALYSIS',
        entityId: jobId,
        newState: { error: job.error },
        idempotencyKey: createIdempotencyKey('ai_classify'),
        source: 'AI_SERVICE',
        outcome: 'FAILURE',
        error: { code: 'AI_ERROR', message: job.error },
      });

      this.notifyListeners(job);
      throw error;
    }
  }

  private getBestModel(request: AIAnalysisRequest): AIModelConfig | null {
    const models = this.getModels();
    if (models.length === 0) return null;

    if (request.mediaUrls && request.mediaUrls.length > 0) {
      const multimodal = models.find(m => m.type === 'MULTIMODAL');
      if (multimodal) return multimodal;
    }

    return (models.find(m => m.type === 'TEXT_CLASSIFIER') ?? models[0]) ?? null;
  }

  private async callAIModel(model: AIModelConfig, request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const startTime = Date.now();

    try {
      const response = await apiClient.post<{
        classifications: AIClassification[];
        primaryClassification: AIClassification;
        processingTimeMs: number;
        warnings: string[];
      }>(model.endpoint, {
        text: request.text,
        mediaUrls: request.mediaUrls,
        metadata: request.metadata,
      });

      return {
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
        complaintId: request.complaintId,
        modelVersion: model.version,
        modelType: model.type,
        classifications: response.classifications,
        primaryClassification: response.primaryClassification,
        processingTimeMs: response.processingTimeMs,
        timestamp: new Date().toISOString(),
        warnings: response.warnings,
      };
    } catch {
      return this.mockClassification(request, model, startTime);
    }
  }

  private mockClassification(request: AIAnalysisRequest, model: AIModelConfig, startTime: number): AIAnalysisResponse {
    const rawText = (request as any).text ?? `${(request as any).title ?? ''} ${(request as any).description ?? ''}`;
    const text = String(rawText).toLowerCase();
    const scores: Record<ClassificationCategory, number> = {} as Record<ClassificationCategory, number>;

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      let score = 0;
      for (const keyword of keywords) {
        if (text.includes(keyword.toLowerCase())) {
          score += 1;
        }
      }
      scores[category as ClassificationCategory] = score;
    }

    const sortedCategories = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .filter(([, score]) => score > 0);

    const primaryCategory = (sortedCategories[0]?.[0] ?? 'OTHER') as ClassificationCategory;
    const confidence = Math.min(0.5 + (scores[primaryCategory] ?? 0) * 0.15, 0.95);

    const classifications: AIClassification[] = sortedCategories.slice(0, 3).map(([category, score]) => ({
      category: category as ClassificationCategory,
      confidence: Math.min(0.3 + score * 0.1, 0.9),
      reasoning: `Keywords matched: ${CATEGORY_KEYWORDS[category as ClassificationCategory].filter(k => text.includes(k.toLowerCase())).join(', ')}`,
      suggestedPriority: PRIORITY_RULES[category as ClassificationCategory],
      suggestedSlaHours: SLA_HOURS[category as ClassificationCategory],
      tags: CATEGORY_KEYWORDS[category as ClassificationCategory].filter(k => text.includes(k.toLowerCase())),
    }));

    if (classifications.length === 0) {
      classifications.push({
        category: 'OTHER',
        confidence: 0.5,
        reasoning: 'No specific keywords matched',
        suggestedPriority: 'NORMAL',
        suggestedSlaHours: 24,
        tags: [],
      });
    }

    const primaryClassification = classifications[0]!;

    return {
      requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
      complaintId: request.complaintId,
      modelVersion: model.version,
      modelType: model.type,
      classifications,
      primaryClassification,
      processingTimeMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      warnings: primaryClassification.confidence < model.confidenceThreshold
        ? ['Confidence below threshold, human review recommended']
        : [],
    };
  }

  async submitHumanReview(
    analysisId: string,
    reviewerId: string,
    acceptedClassification: AIClassification | null,
    correctedClassification?: AIClassification,
    correctionReason?: string,
    feedback: 'ACCEPTED' | 'CORRECTED' | 'REJECTED' = 'ACCEPTED'
  ): Promise<HumanReview> {
    const job = this.jobs.get(analysisId);
    if (!job || !job.response) throw new Error('Analysis not found');

    const review: HumanReview = {
      id: `review_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
      analysisId,
      complaintId: job.request.complaintId,
      reviewerId,
      reviewedAt: new Date().toISOString(),
      acceptedClassification,
      ...(correctedClassification ? { correctedClassification } : {}),
      ...(correctionReason ? { correctionReason } : {}),
      feedback,
      modelVersion: job.response.modelVersion,
    };

    this.reviews.set(review.id, review);
    this.saveToStorage();

    createAuditEntry({
      actorUserId: reviewerId,
      actorType: 'ADMIN',
      societyId: '',
      action: 'AI_CLASSIFICATION_REVIEW',
      entityType: 'AI_ANALYSIS',
      entityId: analysisId,
      previousState: { primaryClassification: job.response.primaryClassification as unknown as JsonObject },
      newState: { feedback, ...(correctedClassification ? { correctedClassification: correctedClassification as unknown as JsonObject } : {}) },
      idempotencyKey: createIdempotencyKey('ai_review'),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return review;
  }

  getJob(jobId: string): AIAnalysisJob | null {
    return this.jobs.get(jobId) ?? null;
  }

  getJobsByComplaint(complaintId: string): AIAnalysisJob[] {
    return Array.from(this.jobs.values()).filter(j => j.request.complaintId === complaintId);
  }

  getReviewsByComplaint(complaintId: string): HumanReview[] {
    return Array.from(this.reviews.values()).filter(r => r.complaintId === complaintId);
  }

  onJobUpdate(listener: (job: AIAnalysisJob) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }

  private notifyListeners(job: AIAnalysisJob): void {
    this.listeners.forEach(l => l(job));
  }
}

export const aiClassificationEngine = new AIClassificationEngine();