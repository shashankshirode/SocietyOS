import { AiEvaluationRecord, AiHumanReview, AiResponse } from '../types';
import { humanReviewService } from './humanReviewService';

const evaluations: Map<string, AiEvaluationRecord> = new Map();

function generateId(): string {
  return `eval_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getNow(): string {
  return new Date().toISOString();
}

export const evaluationService = {
  recordEvaluation(record: Omit<AiEvaluationRecord, 'id' | 'evaluatedAt'>): AiEvaluationRecord {
    const evaluation: AiEvaluationRecord = {
      ...record,
      id: `eval_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      evaluatedAt: getNow(),
    };
    evaluations.set(evaluation.id, evaluation);
    return evaluation;
  },

  computePeriodicEvaluations(): AiEvaluationRecord[] {
    const capabilities = [
      'COMPLAINT_CLASSIFICATION',
      'NOTICE_DRAFTING',
      'DOCUMENT_SEARCH',
      'BILL_EXPLANATION',
      'MEETING_SUMMARY',
      'MAINTENANCE_RISK',
    ];

    const results: AiEvaluationRecord[] = [];

    for (const capability of capabilities) {
      const reviews = humanReviewService.getAllReviews().filter(r => r.capability === capability);
      const responses = this.getResponsesForCapability(capability);

      if (reviews.length === 0 && responses.length === 0) continue;

      const totalRequests = responses.length;
      const successfulRequests = responses.filter(r => r.status === 'SUCCESS').length;
      const failedRequests = responses.filter(r => r.status === 'FAILED').length;
      const reviewRequiredRequests = responses.filter(r => r.status === 'REQUIRES_REVIEW').length;

      const acceptedReviews = reviews.filter(r => r.feedback === 'ACCEPTED').length;
      const correctedReviews = reviews.filter(r => r.feedback === 'CORRECTED').length;
      const rejectedReviews = reviews.filter(r => r.feedback === 'REJECTED').length;

      const avgConfidence = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.originalOutput as any)?.confidence || 0, 0) / reviews.length
        : 0;

      const avgProcessingTimeMs = responses.length > 0
        ? responses.reduce((sum, r) => sum + (r.processingTimeMs || 0), 0) / responses.length
        : 0;

      let accuracyMetrics: AiEvaluationRecord['accuracyMetrics'] = undefined;
      if (correctedReviews + acceptedReviews > 0) {
        const truePositives = acceptedReviews;
        const falsePositives = correctedReviews;
        const precision = truePositives / (truePositives + falsePositives) || 0;
        const recall = truePositives / (truePositives + rejectedReviews) || 0;
        const f1Score = precision && recall ? 2 * precision * recall / (precision + recall) : 0;
        accuracyMetrics = { precision, recall, f1Score };
      }

      const driftDetected = this.detectDrift(capability, avgConfidence);

      const evaluation = this.recordEvaluation({
        capability,
        modelId: this.getCurrentModelForCapability(capability) || 'unknown',
        modelVersion: 'current',
        templateVersion: 1,
        evaluatedAt: getNow(),
        totalRequests,
        successfulRequests,
        failedRequests,
        reviewRequiredRequests,
        acceptedReviews,
        correctedReviews,
        rejectedReviews,
        avgConfidence,
        avgProcessingTimeMs,
        accuracyMetrics,
        driftDetected,
        driftDetails: driftDetected ? 'Confidence drift detected' : undefined,
      });

      results.push(evaluation);
    }

    return results;
  },

  getEvaluations(capability?: string): AiEvaluationRecord[] {
    const all = Array.from(evaluations.values());
    if (capability) return all.filter(e => e.capability === capability);
    return all;
  },

  getLatestEvaluation(capability: string): AiEvaluationRecord | undefined {
    const evals = this.getEvaluations(capability);
    return evals.sort((a, b) => new Date(b.evaluatedAt).getTime() - new Date(a.evaluatedAt).getTime())[0];
  },

  detectDrift(capability: string, currentAvgConfidence: number): boolean {
    const history = this.getEvaluations(capability);
    if (history.length < 3) return false;

    const recentAvg = history.slice(-3).reduce((sum, e) => sum + e.avgConfidence, 0) / 3;
    const olderAvg = history.slice(-6, -3).reduce((sum, e) => sum + e.avgConfidence, 0) / 3;

    return Math.abs(recentAvg - olderAvg) > 0.1;
  },

  getDriftTrends(): Record<string, { driftDetected: boolean; confidenceTrend: 'IMPROVING' | 'STABLE' | 'DEGRADING' }> {
    const capabilities = [
      'COMPLAINT_CLASSIFICATION',
      'NOTICE_DRAFTING',
      'DOCUMENT_SEARCH',
      'BILL_EXPLANATION',
      'MEETING_SUMMARY',
      'MAINTENANCE_RISK',
    ];

    const trends: Record<string, { driftDetected: boolean; confidenceTrend: 'IMPROVING' | 'STABLE' | 'DEGRADING' }> = {};

    for (const capability of capabilities) {
      const history = this.getEvaluations(capability);
      if (history.length < 2) {
        trends[capability] = { driftDetected: false, confidenceTrend: 'STABLE' };
        continue;
      }

      const latest = history[history.length - 1];
      const previous = history[history.length - 2];

      let trend: 'IMPROVING' | 'STABLE' | 'DEGRADING' = 'STABLE';
      if (latest.avgConfidence > previous.avgConfidence + 0.05) trend = 'IMPROVING';
      else if (latest.avgConfidence < previous.avgConfidence - 0.05) trend = 'DEGRADING';

      trends[capability] = {
        driftDetected: latest.driftDetected,
        confidenceTrend: trend,
      };
    }

    return trends;
  },

  getResponsesForCapability(capability: string): AiResponse[] {
    return [];
  },

  getCurrentModelForCapability(capability: string): string {
    return 'current';
  },

  getAllEvaluations(): AiEvaluationRecord[] {
    return Array.from(evaluations.values());
  },

  clearEvaluations(): void {
    evaluations.clear();
  },
};