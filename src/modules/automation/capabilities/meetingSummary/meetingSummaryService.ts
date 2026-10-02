import {
  MeetingSummaryRequest,
  MeetingSummaryResult,
  validateMeetingSummary,
} from './meetingSummary.types';
import { aiOrchestrationService } from '../../../aiServices/core/services';

function generateDeterministicSummary(request: MeetingSummaryRequest): {
  summary: string;
  keyPoints: string[];
  actionItems: MeetingSummaryResult['actionItems'];
  decisions: MeetingSummaryResult['decisions'];
} {
  const lines: string[] = [];
  const keyPoints: string[] = [];
  const actionItems: MeetingSummaryResult['actionItems'] = [];
  const decisions: MeetingSummaryResult['decisions'] = [];

  lines.push(`Meeting: ${request.title}`);
  lines.push(`Date: ${new Date().toLocaleDateString()}`);
  lines.push(`Participants: ${request.participants.map(p => `${p.name} (${p.role})`).join(', ')}`);
  lines.push('');

  if (request.agenda) {
    lines.push('AGENDA:');
    lines.push(request.agenda);
    lines.push('');
    keyPoints.push('Agenda reviewed');
  }

  if (request.notes) {
    lines.push('NOTES:');
    lines.push(request.notes);
    lines.push('');
    keyPoints.push('Notes recorded');
  }

  if (request.transcript) {
    const transcriptLines = request.transcript.split('\n').filter(l => l.trim().length > 0);
    lines.push('TRANSCRIPT HIGHLIGHTS:');
    for (const line of transcriptLines.slice(0, 20)) {
      if (line.toLowerCase().includes('action') || line.toLowerCase().includes('decide') ||
          line.toLowerCase().includes('approve') || line.toLowerCase().includes('reject')) {
        lines.push(`  - ${line.trim()}`);
      }
    }
    lines.push('');
  }

  lines.push('--- DETERMINISTIC SUMMARY ---');
  lines.push('This is a structured summary based on provided content.');
  lines.push('Official minutes require human review and approval.');

  return { summary: lines.join('\n'), keyPoints, actionItems, decisions };
}

export const meetingSummaryService = {
  async generateSummary(
    request: MeetingSummaryRequest
  ): Promise<MeetingSummaryResult> {
    const aiCommand = {
      capability: 'MEETING_SUMMARY' as const,
      input: {
        meetingId: request.meetingId,
        title: request.title,
        transcript: request.transcript,
        notes: request.notes,
        agenda: request.agenda,
        participants: request.participants,
        language: request.language || 'en',
      },
      societyId: request.societyId,
      requestedBy: request.requestedBy,
      priority: 'NORMAL',
      timeoutMs: 60000,
    };

    let summary: string;
    let keyPoints: string[];
    let actionItems: MeetingSummaryResult['actionItems'];
    let decisions: MeetingSummaryResult['decisions'];
    let modelVersion = 'deterministic-v1';
    let templateVersion = 1;
    let source: 'AI_PROVIDER' | 'RULE_FALLBACK' = 'RULE_FALLBACK';
    let confidence = 1.0;
    let confidenceBand: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN' = 'HIGH';
    let warnings: string[] = ['DETERMINISTIC_SUMMARY: Generated from provided meeting content'];
    let requiresReview = true;
    let processingTimeMs = 10;

    try {
      const aiResponse = await aiOrchestrationService.requestAnalysis(aiCommand);

      if (aiResponse.source === 'AI_PROVIDER' && aiResponse.status === 'SUCCESS') {
        const aiOutput = aiResponse.primaryOutput as any;
        summary = aiOutput.summary || generateDeterministicSummary(request).summary;
        keyPoints = aiOutput.keyPoints || generateDeterministicSummary(request).keyPoints;
        actionItems = aiOutput.actionItems || generateDeterministicSummary(request).actionItems;
        decisions = aiOutput.decisions || generateDeterministicSummary(request).decisions;
        modelVersion = aiResponse.modelVersion;
        templateVersion = aiResponse.templateVersion;
        source = 'AI_PROVIDER';
        confidence = aiResponse.confidence;
        confidenceBand = aiResponse.confidenceBand;
        warnings = [...(aiResponse.warnings || []), 'AI_ENHANCED: Summary generated with AI assistance'];
        requiresReview = aiResponse.status === 'REQUIRES_REVIEW' || aiResponse.confidence < 0.7;
        processingTimeMs = aiResponse.processingTimeMs;
      } else {
        const det = generateDeterministicSummary(request);
        summary = det.summary;
        keyPoints = det.keyPoints;
        actionItems = det.actionItems;
        decisions = det.decisions;
      }
    } catch (error) {
      warnings.push(`AI_UNAVAILABLE: ${error instanceof Error ? error.message : 'Unknown error'}`);
      const det = generateDeterministicSummary(request);
      summary = det.summary;
      keyPoints = det.keyPoints;
      actionItems = det.actionItems;
      decisions = det.decisions;
    }

    const result: MeetingSummaryResult = {
      requestId: `msum_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      meetingId: request.meetingId,
      summary,
      keyPoints,
      actionItems,
      decisions,
      modelVersion,
      templateVersion,
      source,
      confidence,
      confidenceBand,
      warnings,
      requiresReview,
      processingTimeMs,
      completedAt: new Date().toISOString(),
    };

    const validation = validateMeetingSummary(result);
    if (!validation.valid) {
      result.warnings.push(...validation.errors);
      result.requiresReview = true;
    }

    return result;
  },

  getDeterministicSummary(request: MeetingSummaryRequest): MeetingSummaryResult {
    const det = generateDeterministicSummary(request);

    return {
      requestId: `msum_${Date.now()}`,
      meetingId: request.meetingId,
      summary: det.summary,
      keyPoints: det.keyPoints,
      actionItems: det.actionItems,
      decisions: det.decisions,
      modelVersion: 'deterministic-v1',
      templateVersion: 1,
      source: 'RULE_FALLBACK',
      confidence: 1.0,
      confidenceBand: 'HIGH',
      warnings: ['DETERMINISTIC_SUMMARY: Generated from meeting content without AI'],
      requiresReview: true,
      processingTimeMs: 5,
      completedAt: new Date().toISOString(),
    };
  },

  validateSummary(summary: MeetingSummaryResult): { valid: boolean; errors: string[] } {
    return validateMeetingSummary(summary);
  },
};