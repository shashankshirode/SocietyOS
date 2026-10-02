import {
  NoticeDraftingRequest,
  NoticeDraftingResult,
  NoticeTemplate,
  DEFAULT_NOTICE_TEMPLATES,
  validateNoticeDraft,
} from './noticeDrafting.types';
import { aiOrchestrationService } from '../../../aiServices/core/services';
import { promptTemplateService } from '../../../aiServices/core/services';

export const noticeDraftingService = {
  async createDraft(
    request: NoticeDraftingRequest,
    options: { requestedBy: string; timeoutMs?: number }
  ): Promise<NoticeDraftingResult> {
    const aiCommand = {
      capability: 'NOTICE_DRAFTING' as const,
      input: {
        intent: request.intent,
        audience: request.audience,
        audienceFilters: request.audienceFilters,
        dates: request.dates,
        facts: request.facts,
        priority: request.priority,
        language: request.language,
      },
      societyId: request.societyId,
      requestedBy: options.requestedBy,
      priority: request.priority === 'URGENT' ? 'HIGH' : 'NORMAL',
      timeoutMs: options.timeoutMs,
    };

    const template = this.getTemplate(request.templateId || this.selectTemplate(request));
    const activePromptTemplate = promptTemplateService.getActiveTemplateForCapability('NOTICE_DRAFTING');

    const aiResponse = await aiOrchestrationService.requestAnalysis({
      capability: 'NOTICE_DRAFTING',
      input: aiCommand.input,
      societyId: request.societyId,
      requestedBy: options.requestedBy,
      priority: aiCommand.priority,
      timeoutMs: options.timeoutMs,
    });

    const draftOutput = aiResponse.primaryOutput as any;
    const result: NoticeDraftingResult = {
      requestId: aiResponse.requestId,
      draftId: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      content: this.applyTemplate(template, draftOutput.content, request.facts),
      format: draftOutput.format || 'PLAIN_TEXT',
      language: request.language,
      placeholders: draftOutput.placeholders || [],
      factualReferences: this.buildFactualReferences(request.facts, draftOutput.factualReferences || []),
      modelVersion: aiResponse.modelVersion,
      templateVersion: aiResponse.templateVersion,
      source: aiResponse.source,
      confidence: aiResponse.confidence,
      confidenceBand: aiResponse.confidenceBand,
      warnings: [...(aiResponse.warnings || []), ...this.validateDraft(draftOutput.content, request.facts)],
      requiresReview: aiResponse.status === 'REQUIRES_REVIEW' || aiResponse.confidence < 0.7,
      processingTimeMs: aiResponse.processingTimeMs,
      completedAt: aiResponse.completedAt,
    };

    const validation = validateNoticeDraft(result);
    if (!validation.valid) {
      result.warnings.push(...validation.errors);
      result.requiresReview = true;
    }

    return result;
  },

  selectTemplate(request: NoticeDraftingRequest): NoticeTemplate {
    const templates = this.getAvailableTemplates(request.language);
    const matched = templates.find(t => {
      const intentLower = request.intent.toLowerCase();
      return t.name.toLowerCase().includes(intentLower) ||
             intentLower.includes(t.name.toLowerCase());
    });
    return matched || templates[0];
  },

  getAvailableTemplates(language: string): NoticeTemplate[] {
    return DEFAULT_NOTICE_TEMPLATES.filter(t => t.supportedLanguages.includes(language));
  },

  getTemplate(templateId: string): NoticeTemplate {
    return DEFAULT_NOTICE_TEMPLATES.find(t => t.id === templateId) || DEFAULT_NOTICE_TEMPLATES[0];
  },

  applyTemplate(template: NoticeTemplate, content: string, facts: Record<string, unknown>): string {
    let result = content;
    for (const [key, value] of Object.entries(facts)) {
      const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(placeholder, String(value));
    }
    for (const ph of template.placeholders) {
      const placeholder = new RegExp(`\\{\\{${ph.key}\\}\\}`, 'g');
      if (result.includes(`{{${ph.key}}}`) && !facts[ph.key]) {
        result = result.replace(placeholder, `[${ph.description}]`);
      }
    }
    return result;
  },

  buildFactualReferences(
    facts: Record<string, unknown>,
    aiReferences: Array<{ field: string; value: unknown; source: string }>
  ): Array<{ field: string; value: unknown; source: string }> {
    const references = [...aiReferences];
    for (const [key, value] of Object.entries(facts)) {
      if (!references.some(r => r.field === key)) {
        references.push({ field: key, value, source: 'USER_PROVIDED' });
      }
    }
    return references;
  },

  validateDraft(content: string, facts: Record<string, unknown>): string[] {
    const warnings: string[] = [];

    const unresolved = content.match(/\{\{[^}]+\}\}/g);
    if (unresolved) {
      warnings.push(`Unresolved placeholders: ${unresolved.join(', ')}`);
    }

    for (const [key] of Object.entries(facts)) {
      if (!content.includes(key)) {
        warnings.push(`Fact '${key}' provided but not referenced in draft`);
      }
    }

    const sensitivePatterns = [
      /\b\d{10,}\b/,
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/,
    ];
    for (const pattern of sensitivePatterns) {
      if (pattern.test(content)) {
        warnings.push('Potential sensitive data detected in draft');
        break;
      }
    }

    return warnings;
  },

  async translateDraft(
    draft: NoticeDraftingResult,
    targetLanguage: string
  ): Promise<NoticeDraftingResult> {
    const translated = { ...draft };
    translated.language = targetLanguage;
    translated.warnings.push(`TRANSLATED: ${draft.language} → ${targetLanguage}`);
    translated.requiresReview = true;
    return translated;
  },

  getTemplates(): NoticeTemplate[] {
    return DEFAULT_NOTICE_TEMPLATES;
  },

  getTemplateById(id: string): NoticeTemplate | undefined {
    return DEFAULT_NOTICE_TEMPLATES.find(t => t.id === id);
  },
};