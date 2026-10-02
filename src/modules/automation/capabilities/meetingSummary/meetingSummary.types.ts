export type MeetingSummaryRequest = {
  meetingId: string;
  title: string;
  transcript?: string;
  notes?: string;
  agenda?: string;
  participants: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  societyId: string;
  requestedBy: string;
  language?: 'en' | 'hi' | 'mr';
};

export type MeetingSummaryResult = {
  requestId: string;
  meetingId: string;
  summary: string;
  keyPoints: string[];
  actionItems: Array<{
    description: string;
    assigneeRole?: string;
    assigneeId?: string;
    dueDate?: string;
    priority?: 'LOW' | 'NORMAL' | 'HIGH';
    sourceReference: string;
  }>;
  decisions: Array<{
    description: string;
    outcome: 'APPROVED' | 'REJECTED' | 'DEFERRED' | 'DISCUSSED';
    sourceReference: string;
  }>;
  modelVersion: string;
  templateVersion: number;
  source: 'AI_PROVIDER' | 'RULE_FALLBACK';
  confidence: number;
  confidenceBand: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  warnings: string[];
  requiresReview: boolean;
  processingTimeMs: number;
  completedAt: string;
};

export type MeetingType = 'AGM' | 'SGM' | 'COMMITTEE' | 'BOARD' | 'RESIDENT' | 'VENDOR';

export function validateMeetingSummary(result: MeetingSummaryResult): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!result.summary || result.summary.trim().length === 0) {
    errors.push('Summary cannot be empty');
  }

  if (!result.keyPoints || result.keyPoints.length === 0) {
    errors.push('At least one key point is required');
  }

  for (const item of result.actionItems) {
    if (!item.description || item.description.trim().length === 0) {
      errors.push('Action item description cannot be empty');
    }
  }

  for (const decision of result.decisions) {
    if (!['APPROVED', 'REJECTED', 'DEFERRED', 'DISCUSSED'].includes(decision.outcome)) {
      errors.push(`Invalid decision outcome: ${decision.outcome}`);
    }
  }

  return { valid: errors.length === 0, errors };
}