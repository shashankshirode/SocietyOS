import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import type { AutomationAuditLogEntry, AutomationPreview } from './automation.types';
import { automatedNoticeDraftingMockData, automationAuditLogMockData, billExplanationAssistantMockData, maintenanceRiskAlertsMockData, meetingSummaryGeneratorMockData, smartComplaintRoutingMockData, smartDocumentSearchMockData } from './automation.mockData';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
type PreviewInput = {
    input: string;
};
const generate = async (source: AutomationPreview[], input: string, actionName: string): Promise<RepositoryResult<AutomationPreview>> => {
    await withMockDelay();
    const preview: AutomationPreview = { ...getRequiredItem(source, 0, "automation.mockSource.ts"), id: `auto-${Date.now()}`, input };
    automationAuditLogMockData.unshift({ id: `aal-${Date.now()}`, automationName: actionName, actorName: 'Mock User', action: `Generated preview for: ${input}`, createdAt: new Date().toISOString() });
    return repositorySuccess(preview);
};
export const automationMockSource = {
    generateSmartComplaintRoutingPreview: (input: PreviewInput) => generate(smartComplaintRoutingMockData, input.input, 'Smart Complaint Routing'),
    generateAutomatedNoticeDraftPreview: (input: PreviewInput) => generate(automatedNoticeDraftingMockData, input.input, 'Automated Notice Drafting'),
    generateSmartDocumentSearchPreview: (input: PreviewInput) => generate(smartDocumentSearchMockData, input.input, 'Smart Document Search'),
    generateBillExplanationPreview: (input: PreviewInput) => generate(billExplanationAssistantMockData, input.input, 'Bill Explanation Assistant'),
    generateMeetingSummaryPreview: (input: PreviewInput) => generate(meetingSummaryGeneratorMockData, input.input, 'Meeting Summary Generator'),
    generateMaintenanceRiskAlertsPreview: (input: PreviewInput) => generate(maintenanceRiskAlertsMockData, input.input, 'Maintenance Risk Alerts'),
    async listAutomationAuditLogs(): Promise<RepositoryResult<AutomationAuditLogEntry[]>> {
        await withMockDelay();
        return repositorySuccess([...automationAuditLogMockData]);
    },
};

