import type { RepositoryResult } from '../../../core/repositories/repository.types';
import type { AutomationAuditLogEntry, AutomationPreview } from './automation.types';

type PreviewInput = { input: string };
const notImplemented = <T>(): Promise<RepositoryResult<T>> => Promise.resolve({ ok: false, error: { message: 'API source not implemented', code: 'NOT_IMPLEMENTED' } });

export const automationApiSource = {
  generateSmartComplaintRoutingPreview: (_input: PreviewInput) => notImplemented<AutomationPreview>(),
  generateAutomatedNoticeDraftPreview: (_input: PreviewInput) => notImplemented<AutomationPreview>(),
  generateSmartDocumentSearchPreview: (_input: PreviewInput) => notImplemented<AutomationPreview>(),
  generateBillExplanationPreview: (_input: PreviewInput) => notImplemented<AutomationPreview>(),
  generateMeetingSummaryPreview: (_input: PreviewInput) => notImplemented<AutomationPreview>(),
  generateMaintenanceRiskAlertsPreview: (_input: PreviewInput) => notImplemented<AutomationPreview>(),
  listAutomationAuditLogs: () => notImplemented<AutomationAuditLogEntry[]>(),
};
