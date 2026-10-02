export type NoticeDraftingRequest = {
  intent: string;
  audience: 'ALL_RESIDENTS' | 'TOWER' | 'WING' | 'FLOOR' | 'UNIT' | 'STAFF' | 'VENDORS';
  audienceFilters?: {
    towerIds?: string[];
    wingIds?: string[];
    floorNumbers?: number[];
    unitIds?: string[];
  };
  dates: {
    effectiveFrom: string;
    effectiveTo?: string;
    publishAt?: string;
  };
  facts: Record<string, unknown>;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  language: 'en' | 'hi' | 'mr' | 'ta' | 'te';
  templateId?: string;
  societyId: string;
};

export type NoticeDraftingResult = {
  requestId: string;
  draftId: string;
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

export type NoticeTemplate = {
  id: string;
  name: string;
  description?: string;
  audience: NoticeDraftingRequest['audience'];
  template: string;
  placeholders: Array<{
    key: string;
    description: string;
    required: boolean;
    exampleValue?: string;
  }>;
  supportedLanguages: string[];
  createdAt: string;
  updatedAt: string;
};

export const DEFAULT_NOTICE_TEMPLATES: NoticeTemplate[] = [
  {
    id: 'water-shutdown',
    name: 'Water Supply Shutdown',
    description: 'Scheduled water supply interruption notice',
    audience: 'ALL_RESIDENTS',
    template: `NOTICE: Water Supply Shutdown

Dear Residents,

Please be informed that the water supply will be temporarily shut down for {{reason}}.

Schedule:
- Date: {{date}}
- Time: {{startTime}} to {{endTime}}
- Affected Areas: {{affectedAreas}}

We apologize for the inconvenience and request your cooperation.

For queries, contact: {{contactInfo}}

Society Management Committee`,
    placeholders: [
      { key: 'reason', description: 'Reason for shutdown (e.g., tank cleaning, pipe repair)', required: true, exampleValue: 'Overhead tank cleaning' },
      { key: 'date', description: 'Date of shutdown', required: true, exampleValue: '2026-01-15' },
      { key: 'startTime', description: 'Start time', required: true, exampleValue: '10:00 AM' },
      { key: 'endTime', description: 'End time', required: true, exampleValue: '2:00 PM' },
      { key: 'affectedAreas', description: 'Areas affected', required: true, exampleValue: 'All towers' },
      { key: 'contactInfo', description: 'Contact for queries', required: false, exampleValue: 'Facility Manager - 9876543210' },
    ],
    supportedLanguages: ['en', 'hi', 'mr'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'maintenance-work',
    name: 'Scheduled Maintenance',
    description: 'Common area maintenance notice',
    audience: 'ALL_RESIDENTS',
    template: `NOTICE: Scheduled Maintenance

Dear Residents,

Please be advised that scheduled maintenance will be carried out as follows:

Work: {{workDescription}}
Location: {{location}}
Date: {{date}}
Time: {{startTime}} to {{endTime}}

During this period, {{affectedServices}} may be temporarily unavailable.

We request your cooperation and apologize for any inconvenience.

For assistance, contact: {{contactInfo}}

Society Management Committee`,
    placeholders: [
      { key: 'workDescription', description: 'Description of maintenance work', required: true, exampleValue: 'Lift AMC service' },
      { key: 'location', description: 'Location of work', required: true, exampleValue: 'Tower A - Lift 1' },
      { key: 'date', description: 'Date of maintenance', required: true, exampleValue: '2026-01-20' },
      { key: 'startTime', description: 'Start time', required: true, exampleValue: '9:00 AM' },
      { key: 'endTime', description: 'End time', required: true, exampleValue: '5:00 PM' },
      { key: 'affectedServices', description: 'Services affected', required: true, exampleValue: 'Lift 1 in Tower A' },
      { key: 'contactInfo', description: 'Contact for queries', required: false, exampleValue: 'Facility Manager - 9876543210' },
    ],
    supportedLanguages: ['en', 'hi', 'mr'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'general-announcement',
    name: 'General Announcement',
    description: 'General purpose announcement template',
    audience: 'ALL_RESIDENTS',
    template: `NOTICE: {{title}}

Dear Residents,

{{body}}

For further information, contact: {{contactInfo}}

Society Management Committee`,
    placeholders: [
      { key: 'title', description: 'Notice title', required: true, exampleValue: 'New Security Protocol' },
      { key: 'body', description: 'Main notice content', required: true, exampleValue: 'Please ensure all visitors are registered at the gate.' },
      { key: 'contactInfo', description: 'Contact for queries', required: false, exampleValue: 'Society Office - 022-12345678' },
    ],
    supportedLanguages: ['en', 'hi', 'mr', 'ta', 'te'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

export function validateNoticeDraft(draft: NoticeDraftingResult): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!draft.content || draft.content.trim().length === 0) {
    errors.push('Draft content cannot be empty');
  }

  const unresolvedPlaceholders = draft.content.match(/\{\{[^}]+\}\}/g);
  if (unresolvedPlaceholders && unresolvedPlaceholders.length > 0) {
    errors.push(`Unresolved placeholders: ${unresolvedPlaceholders.join(', ')}`);
  }

  if (!draft.factualReferences || draft.factualReferences.length === 0) {
    errors.push('No factual references provided');
  }

  return { valid: errors.length === 0, errors };
}