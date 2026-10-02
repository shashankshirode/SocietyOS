import {
  ComplaintClassificationRequest,
  ComplaintClassificationResult,
  ComplaintRoutingRule,
  COMPLAINT_ROUTING_RULES,
  SAFETY_CATEGORIES,
  isSafetyCategory,
  getMinPriorityForCategory,
} from './complaintRouting.types';
import { aiOrchestrationService } from '../../../aiServices/core/services';

export const complaintRoutingService = {
  async classifyComplaint(
    request: ComplaintClassificationRequest,
    options: {
      requestedBy: string;
      priority?: 'LOW' | 'NORMAL' | 'HIGH';
      timeoutMs?: number;
    }
  ): Promise<ComplaintClassificationResult> {
    const aiCommand = {
      capability: 'COMPLAINT_CLASSIFICATION' as const,
      input: {
        title: request.title,
        description: request.description,
        mediaUrls: request.mediaUrls,
        metadata: {
          societyId: request.societyId,
          complaintId: request.complaintId,
        },
      },
      societyId: request.societyId,
      requestedBy: options.requestedBy,
      priority: options.priority,
      timeoutMs: options.timeoutMs,
    };

    const aiResponse = await aiOrchestrationService.requestAnalysis(aiCommand);

    const primary = aiResponse.primaryOutput as any;
    const alternatives = aiResponse.alternatives || [];

    const result: ComplaintClassificationResult = {
      requestId: aiResponse.requestId,
      complaintId: request.complaintId,
      primaryClassification: {
        category: primary.category,
        confidence: primary.confidence,
        reasoning: primary.reasoning,
        suggestedPriority: primary.suggestedPriority,
        suggestedSlaHours: primary.suggestedSlaHours,
        tags: primary.tags || [],
      },
      alternativeClassifications: alternatives.map((a: any) => ({
        category: a.category,
        confidence: a.confidence,
        reasoning: a.reasoning,
        suggestedPriority: a.suggestedPriority,
        suggestedSlaHours: a.suggestedSlaHours,
        tags: a.tags || [],
      })),
      modelVersion: aiResponse.modelVersion,
      templateVersion: aiResponse.templateVersion,
      source: aiResponse.source,
      confidence: aiResponse.confidence,
      confidenceBand: aiResponse.confidenceBand,
      warnings: aiResponse.warnings,
      evidenceReferences: primary.evidenceReferences || [],
      requiresReview: aiResponse.status === 'REQUIRES_REVIEW' || aiResponse.confidence < 0.7,
      processingTimeMs: aiResponse.processingTimeMs,
      completedAt: aiResponse.completedAt,
    };

    return this.applyDeterministicRules(result);
  },

  applyDeterministicRules(result: ComplaintClassificationResult): ComplaintClassificationResult {
    const category = result.primaryClassification.category;
    const routingRule = COMPLAINT_ROUTING_RULES[category];

    if (!routingRule) {
      return result;
    }

    const minPriority = getMinPriorityForCategory(category);
    const currentPriority = result.primaryClassification.suggestedPriority;

    if (this.priorityRank(minPriority) > this.priorityRank(currentPriority)) {
      result.primaryClassification.suggestedPriority = minPriority;
      result.warnings.push(`DETERMINISTIC_OVERRIDE: Priority raised to ${minPriority} due to safety category ${category}`);
    }

    result.primaryClassification.suggestedSlaHours = routingRule.slaHours;

    if (isSafetyCategory(category) && result.confidence < 0.7) {
      result.requiresReview = true;
      result.warnings.push('SAFETY_CATEGORY_LOW_CONFIDENCE: Mandatory human review for safety-sensitive category');
    }

    return result;
  },

  getRoutingRule(category: string): ComplaintRoutingRule | undefined {
    return COMPLAINT_ROUTING_RULES[category];
  },

  getAllRoutingRules(): ComplaintRoutingRule[] {
    return Object.values(COMPLAINT_ROUTING_RULES);
  },

  getSafetyCategories(): string[] {
    return SAFETY_CATEGORIES;
  },

  priorityRank(priority: string): number {
    const ranks: Record<string, number> = {
      LOW: 1,
      NORMAL: 2,
      HIGH: 3,
      CRITICAL: 4,
      EMERGENCY: 5,
    };
    return ranks[priority] || 0;
  },

  validateClassification(
    aiResult: ComplaintClassificationResult,
    humanDecision: 'ACCEPTED' | 'CORRECTED' | 'REJECTED',
    correctedCategory?: string
  ): { valid: boolean; finalCategory: string; finalPriority: string; finalSlaHours: number } {
    let finalCategory = aiResult.primaryClassification.category;
    let finalPriority = aiResult.primaryClassification.suggestedPriority;
    let finalSlaHours = aiResult.primaryClassification.suggestedSlaHours;

    if (humanDecision === 'CORRECTED' && correctedCategory) {
      finalCategory = correctedCategory;
      const rule = COMPLAINT_ROUTING_RULES[correctedCategory];
      if (rule) {
        finalSlaHours = rule.slaHours;
        finalPriority = getMinPriorityForCategory(correctedCategory);
      }
    }

    return {
      valid: true,
      finalCategory,
      finalPriority,
      finalSlaHours,
    };
  },
};