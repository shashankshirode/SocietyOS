import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import type { CreateInterFlatIssueInput, InterFlatIssue } from '../../../../shared/types/interFlat.types';
import type { Inspection, MediationCase } from '../../../../shared/types/disputeMediation.types';
import type { TimelineEvent } from '../../../../shared/mock/interFlatTimeline.mock';
import type { PenaltyReadiness, Rule, RuleAcknowledgement, RuleAcknowledgementReport, RuleViolation } from '../../../../shared/types/rules.types';
import type { AuditLogEntry as InterFlatAuditLogEntry } from '../../../../shared/mock/interFlatAuditLogs.mock';
import type { AddEvidenceInput, AddIssueTimelineEventInput, AddMediatorNoteInput, AssignMediatorInput, ClosureProofInput, CompleteFacilityInspectionInput, CreateResolutionProposalInput, EscalateIssueInput, InterFlatIssueTypeOption, InterFlatHomeSummary, InterFlatQuery, InterFlatRuleCategorySummary, InterFlatSettings, NotifyInvolvedFlatInput, RequestFacilityInspectionInput, ResolutionDecisionInput, ResidentResolutionProposalDetail, SubmitIssueResponseInput, } from './interFlat.dto';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
export class InterFlatApiSource {
    async getInterFlatHome() {
        return apiClient.get<InterFlatHomeSummary>(apiEndpoints.interFlat.dashboard);
    }
    async getMyInterFlatIssues(params?: InterFlatQuery) {
        return apiClient.get<InterFlatIssue[]>(apiEndpoints.interFlat.myIssues, { ...includeWhenPresent("query", params) });
    }
    async getIssueTypes() {
        return apiClient.get<InterFlatIssueTypeOption[]>(apiEndpoints.interFlat.rules + '/categories');
    }
    async createInterFlatIssue(input: CreateInterFlatIssueInput) {
        return apiClient.post(apiEndpoints.interFlat.createIssue, input);
    }
    async getInterFlatIssueDetail(issueId: string) {
        return apiClient.get<InterFlatIssue | Absent>(apiEndpoints.interFlat.issueDetail(issueId));
    }
    async submitIssueResponse(issueId: string, input: SubmitIssueResponseInput) {
        return apiClient.post(apiEndpoints.interFlat.submitResponse(issueId), input);
    }
    async addEvidencePlaceholder(issueId: string, input: AddEvidenceInput) {
        return apiClient.post(apiEndpoints.interFlat.addEvidence(issueId), input);
    }
    async notifyInvolvedFlat(issueId: string, input: NotifyInvolvedFlatInput) {
        return apiClient.post(apiEndpoints.interFlat.notifyInvolved(issueId), input);
    }
    async getIssueTimeline(issueId: string) {
        return apiClient.get<TimelineEvent[]>(apiEndpoints.interFlat.timeline(issueId));
    }
    async addIssueTimelineEvent(issueId: string, input: AddIssueTimelineEventInput) {
        return apiClient.post(apiEndpoints.interFlat.addTimelineEvent(issueId), input);
    }
    async requestFacilityInspection(issueId: string, input: RequestFacilityInspectionInput) {
        return apiClient.post(apiEndpoints.interFlat.requestInspection(issueId), input);
    }
    async getFacilityInspection(inspectionId: string) {
        return apiClient.get<Inspection | Absent>(apiEndpoints.interFlat.inspectionDetail(inspectionId));
    }
    async completeFacilityInspection(inspectionId: string, input: CompleteFacilityInspectionInput) {
        return apiClient.post(apiEndpoints.interFlat.completeInspection(inspectionId), input);
    }
    async getMediationCase(mediationId: string) {
        return apiClient.get<MediationCase | Absent>(apiEndpoints.interFlat.mediationDetail(mediationId));
    }
    async assignMediator(mediationId: string, input: AssignMediatorInput) {
        return apiClient.post(apiEndpoints.interFlat.assignMediator(mediationId), input);
    }
    async addMediatorNote(mediationId: string, input: AddMediatorNoteInput) {
        return apiClient.post(apiEndpoints.interFlat.addMediatorNote(mediationId), input);
    }
    async createResolutionProposal(mediationId: string, input: CreateResolutionProposalInput) {
        return apiClient.post(apiEndpoints.interFlat.proposals(mediationId), input);
    }
    async getResolutionProposalDetail(proposalId: string) {
        return apiClient.get<ResidentResolutionProposalDetail | Absent>(apiEndpoints.interFlat.resolutionProposalDetail(proposalId));
    }
    async acceptResolutionProposal(proposalId: string, input: ResolutionDecisionInput) {
        return apiClient.post(apiEndpoints.interFlat.acceptProposal(proposalId), input);
    }
    async rejectResolutionProposal(proposalId: string, input: ResolutionDecisionInput) {
        return apiClient.post(apiEndpoints.interFlat.rejectProposal(proposalId), input);
    }
    async submitClosureProof(proposalId: string, input: ClosureProofInput) {
        return apiClient.post(apiEndpoints.interFlat.submitClosureProof(proposalId), input);
    }
    async escalateIssue(issueId: string, input: EscalateIssueInput) {
        return apiClient.post(apiEndpoints.interFlat.escalate(issueId), input);
    }
    async closeIssue(issueId: string, input: ClosureProofInput) {
        return apiClient.post(apiEndpoints.interFlat.close(issueId), input);
    }
    async getDisputeHistory(params?: InterFlatQuery) {
        return apiClient.get<InterFlatIssue[]>(apiEndpoints.interFlat.disputeHistory, { ...includeWhenPresent("query", params) });
    }
    async getRuleLibrary(params?: InterFlatQuery) {
        return apiClient.get<Rule[]>(apiEndpoints.interFlat.rules, { ...includeWhenPresent("query", params) });
    }
    async getRuleCategories() {
        return apiClient.get<InterFlatRuleCategorySummary[]>(apiEndpoints.interFlat.categories);
    }
    async getRuleDetail(ruleId: string) {
        return apiClient.get<Rule | Absent>(apiEndpoints.interFlat.ruleDetail(ruleId));
    }
    async acknowledgeRule(ruleId: string) {
        return apiClient.post(apiEndpoints.interFlat.acknowledgeRule(ruleId), {});
    }
    async getMyRuleAcknowledgements(params?: InterFlatQuery) {
        return apiClient.get<RuleAcknowledgement[]>(apiEndpoints.interFlat.myAcknowledgements, { ...includeWhenPresent("query", params) });
    }
    async getAdminRuleAcknowledgementReport(ruleId: string, params?: InterFlatQuery) {
        return apiClient.get<RuleAcknowledgementReport>(apiEndpoints.interFlat.acknowledgementReport(ruleId), { ...includeWhenPresent("query", params) });
    }
    async getRuleViolations(params?: InterFlatQuery) {
        return apiClient.get<RuleViolation[]>(apiEndpoints.interFlat.violations, { ...includeWhenPresent("query", params) });
    }
    async getPenaltyReadiness(params?: InterFlatQuery) {
        return apiClient.get<PenaltyReadiness[]>(apiEndpoints.interFlat.penaltyReadiness, { ...includeWhenPresent("query", params) });
    }
    async getInterFlatSettings() {
        return apiClient.get<InterFlatSettings>(apiEndpoints.interFlat.settings);
    }
    async getInterFlatAuditLogs(params?: InterFlatQuery) {
        return apiClient.get<InterFlatAuditLogEntry[]>(apiEndpoints.interFlat.auditLogs, { ...includeWhenPresent("query", params) });
    }
}

