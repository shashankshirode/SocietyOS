import type { AutomationAuditLogEntry, AutomationPreview } from './automation.types';

export const smartComplaintRoutingMockData: AutomationPreview[] = [
  { id: 'scr-1', title: 'Plumbing leak routing', input: 'Water dripping from ceiling near bathroom', output: 'Category: Plumbing / Assignee: Facility Manager / Priority: High', confidence: 0.91, safetyNote: 'Resident text is not sent outside mock mode.' },
];
export const automatedNoticeDraftingMockData: AutomationPreview[] = [
  { id: 'and-1', title: 'Water shutdown notice', input: 'Water tank cleaning tomorrow 10 AM to 1 PM', output: 'Draft notice prepared for all residents with high priority.', confidence: 0.88, safetyNote: 'Secretary must review before publish.' },
];
export const smartDocumentSearchMockData: AutomationPreview[] = [
  { id: 'sds-1', title: 'Permission-safe document answer', input: 'When does fire NOC expire?', output: 'Fire NOC expires in 29 days. Restricted attachments remain hidden.', confidence: 0.84, safetyNote: 'Only metadata visible to authorized roles.' },
];
export const billExplanationAssistantMockData: AutomationPreview[] = [
  { id: 'bea-1', title: 'July bill explanation', input: 'Explain bill BIL-2026-07-A1204', output: 'Maintenance, parking and sinking fund charges are itemized with due date.', confidence: 0.9, safetyNote: 'Payment advice is not generated in mock mode.' },
];
export const meetingSummaryGeneratorMockData: AutomationPreview[] = [
  { id: 'msg-1', title: 'AGM notes summary', input: 'Discussed lift AMC and painting budget', output: 'Summary and action items prepared for committee review.', confidence: 0.86, safetyNote: 'Minutes must be approved manually.' },
];
export const maintenanceRiskAlertsMockData: AutomationPreview[] = [
  { id: 'mra-1', title: 'Lift AMC risk', input: 'Lift 2 repeated breakdowns and AMC expiring', output: 'Risk alert: renew AMC and schedule inspection this week.', confidence: 0.79, safetyNote: 'Alert is advisory and not a work order.' },
];
export const automationAuditLogMockData: AutomationAuditLogEntry[] = [
  { id: 'aal-1', automationName: 'Smart Complaint Routing', actorName: 'System Preview', action: 'Generated plumbing route suggestion', createdAt: '2026-07-05T09:00:00Z' },
  { id: 'aal-2', automationName: 'Bill Explanation Assistant', actorName: 'Treasurer Preview', action: 'Generated bill explanation preview', createdAt: '2026-07-05T09:20:00Z' },
];
