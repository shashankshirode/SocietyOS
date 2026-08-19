import { resolveDataSource } from '../../../../core/dataSource/dataSourceResolver';
import { InterFlatMockSource } from './interFlat.mockSource';
import { InterFlatApiSource } from './interFlat.apiSource';
import type { CreateInterFlatIssueInput, InterFlatIssue } from '../../../../shared/types/interFlat.types';
import type { Inspection } from '../../../../shared/types/disputeMediation.types';
import type { PenaltyReadiness, Rule, RuleAcknowledgement, RuleViolation } from '../../../../shared/types/rules.types';
import type { AuditLogEntry as InterFlatAuditLogEntry } from '../../../../shared/mock/interFlatAuditLogs.mock';
import type { TimelineEvent } from '../../../../shared/mock/interFlatTimeline.mock';
import { repositorySuccess, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { AddEvidenceInput, AddIssueTimelineEventInput, AddMediatorNoteInput, AssignMediatorInput, ClosureProofInput, CompleteFacilityInspectionInput, CreateResolutionProposalInput, EscalateIssueInput, InterFlatQuery, InterFlatHomeSummary, InterFlatRuleCategorySummary, InterFlatSettings, NotifyInvolvedFlatInput, RequestFacilityInspectionInput, ResolutionDecisionInput, SubmitIssueResponseInput, } from './interFlat.dto';
import type { Absent } from "../../../../shared/types/absence.types";
class InterFlatRepository {
    private mockSource = new InterFlatMockSource();
    private apiSource = new InterFlatApiSource();
    private get source() {
        return resolveDataSource('residentInterFlatIssues').isApi ? this.apiSource : this.mockSource;
    }
    async getInterFlatHome(): Promise<RepositoryResult<InterFlatHomeSummary>> {
        if (resolveDataSource('residentInterFlatIssues').isApi) {
            return repositorySuccess(await this.apiSource.getInterFlatHome());
        }
        return repositorySuccess(await this.mockSource.getInterFlatHome());
    }
    async getMyInterFlatIssues(params?: InterFlatQuery): Promise<RepositoryResult<InterFlatIssue[]>> {
        if (resolveDataSource('residentInterFlatIssues').isApi) {
            return repositorySuccess(await this.apiSource.getMyInterFlatIssues(params));
        }
        return repositorySuccess(await this.mockSource.getMyInterFlatIssues(params));
    }
    getIssueTypes() {
        return this.source.getIssueTypes();
    }
    createInterFlatIssue(input: CreateInterFlatIssueInput) {
        return this.source.createInterFlatIssue(input);
    }
    async getInterFlatIssueDetail(issueId: string): Promise<RepositoryResult<InterFlatIssue | Absent>> {
        if (resolveDataSource('residentInterFlatIssues').isApi) {
            return repositorySuccess(await this.apiSource.getInterFlatIssueDetail(issueId));
        }
        return repositorySuccess(await this.mockSource.getInterFlatIssueDetail(issueId));
    }
    submitIssueResponse(issueId: string, input: SubmitIssueResponseInput) {
        return this.source.submitIssueResponse(issueId, input);
    }
    addEvidencePlaceholder(issueId: string, input: AddEvidenceInput) {
        return this.source.addEvidencePlaceholder(issueId, input);
    }
    notifyInvolvedFlat(issueId: string, input: NotifyInvolvedFlatInput) {
        return this.source.notifyInvolvedFlat(issueId, input);
    }
    async getIssueTimeline(issueId: string): Promise<RepositoryResult<TimelineEvent[]>> {
        if (resolveDataSource('residentInterFlatIssues').isApi) {
            return repositorySuccess(await this.apiSource.getIssueTimeline(issueId));
        }
        return repositorySuccess(await this.mockSource.getIssueTimeline(issueId));
    }
    addIssueTimelineEvent(issueId: string, input: AddIssueTimelineEventInput) {
        return this.source.addIssueTimelineEvent(issueId, input);
    }
    requestFacilityInspection(issueId: string, input: RequestFacilityInspectionInput) {
        return this.source.requestFacilityInspection(issueId, input);
    }
    async getFacilityInspection(inspectionId: string): Promise<RepositoryResult<Inspection | Absent>> {
        if (resolveDataSource('residentInterFlatIssues').isApi) {
            return repositorySuccess(await this.apiSource.getFacilityInspection(inspectionId));
        }
        return repositorySuccess(await this.mockSource.getFacilityInspection(inspectionId));
    }
    completeFacilityInspection(inspectionId: string, input: CompleteFacilityInspectionInput) {
        return this.source.completeFacilityInspection(inspectionId, input);
    }
    getMediationCase(mediationId: string) {
        return this.source.getMediationCase(mediationId);
    }
    assignMediator(mediationId: string, input: AssignMediatorInput) {
        return this.source.assignMediator(mediationId, input);
    }
    addMediatorNote(mediationId: string, input: AddMediatorNoteInput) {
        return this.source.addMediatorNote(mediationId, input);
    }
    createResolutionProposal(mediationId: string, input: CreateResolutionProposalInput) {
        return this.source.createResolutionProposal(mediationId, input);
    }
    async getResolutionProposalDetail(proposalId: string) {
        if (resolveDataSource('residentInterFlatIssues').isApi) {
            return repositorySuccess(await this.apiSource.getResolutionProposalDetail(proposalId));
        }
        return repositorySuccess(await this.mockSource.getResolutionProposalDetail(proposalId));
    }
    acceptResolutionProposal(proposalId: string, input: ResolutionDecisionInput) {
        return this.source.acceptResolutionProposal(proposalId, input);
    }
    rejectResolutionProposal(proposalId: string, input: ResolutionDecisionInput) {
        return this.source.rejectResolutionProposal(proposalId, input);
    }
    submitClosureProof(proposalId: string, input: ClosureProofInput) {
        return this.source.submitClosureProof(proposalId, input);
    }
    escalateIssue(issueId: string, input: EscalateIssueInput) {
        return this.source.escalateIssue(issueId, input);
    }
    closeIssue(issueId: string, input: ClosureProofInput) {
        return this.source.closeIssue(issueId, input);
    }
    async getDisputeHistory(params?: InterFlatQuery): Promise<RepositoryResult<InterFlatIssue[]>> {
        if (resolveDataSource('residentInterFlatIssues').isApi) {
            return repositorySuccess(await this.apiSource.getDisputeHistory(params));
        }
        return repositorySuccess(await this.mockSource.getDisputeHistory(params));
    }
    async getRuleLibrary(params?: InterFlatQuery): Promise<RepositoryResult<Rule[]>> {
        if (resolveDataSource('residentInterFlatIssues').isApi) {
            return repositorySuccess(await this.apiSource.getRuleLibrary(params));
        }
        return repositorySuccess(await this.mockSource.getRuleLibrary(params));
    }
    async getRuleCategories(): Promise<RepositoryResult<InterFlatRuleCategorySummary[]>> {
        if (resolveDataSource('residentInterFlatIssues').isApi) {
            return repositorySuccess(await this.apiSource.getRuleCategories());
        }
        return repositorySuccess(await this.mockSource.getRuleCategories());
    }
    async getRuleDetail(ruleId: string): Promise<RepositoryResult<Rule | Absent>> {
        if (resolveDataSource('residentInterFlatIssues').isApi) {
            return repositorySuccess(await this.apiSource.getRuleDetail(ruleId));
        }
        return repositorySuccess(await this.mockSource.getRuleDetail(ruleId));
    }
    acknowledgeRule(ruleId: string) {
        return this.source.acknowledgeRule(ruleId);
    }
    async getMyRuleAcknowledgements(params?: InterFlatQuery): Promise<RepositoryResult<RuleAcknowledgement[]>> {
        if (resolveDataSource('residentInterFlatIssues').isApi) {
            return repositorySuccess(await this.apiSource.getMyRuleAcknowledgements(params));
        }
        return repositorySuccess(await this.mockSource.getMyRuleAcknowledgements(params));
    }
    getAdminRuleAcknowledgementReport(ruleId: string, params?: InterFlatQuery) {
        return this.source.getAdminRuleAcknowledgementReport(ruleId, params);
    }
    async getRuleViolations(params?: InterFlatQuery): Promise<RepositoryResult<RuleViolation[]>> {
        if (resolveDataSource('residentInterFlatIssues').isApi) {
            return repositorySuccess(await this.apiSource.getRuleViolations(params));
        }
        return repositorySuccess(await this.mockSource.getRuleViolations(params));
    }
    async getPenaltyReadiness(params?: InterFlatQuery): Promise<RepositoryResult<PenaltyReadiness[]>> {
        if (resolveDataSource('residentInterFlatIssues').isApi) {
            return repositorySuccess(await this.apiSource.getPenaltyReadiness(params));
        }
        return repositorySuccess(await this.mockSource.getPenaltyReadiness(params));
    }
    async getInterFlatSettings(): Promise<RepositoryResult<InterFlatSettings>> {
        if (resolveDataSource('residentInterFlatIssues').isApi) {
            return repositorySuccess(await this.apiSource.getInterFlatSettings());
        }
        return repositorySuccess(await this.mockSource.getInterFlatSettings());
    }
    async getInterFlatAuditLogs(params?: InterFlatQuery): Promise<RepositoryResult<InterFlatAuditLogEntry[]>> {
        if (resolveDataSource('residentInterFlatIssues').isApi) {
            return repositorySuccess(await this.apiSource.getInterFlatAuditLogs(params));
        }
        return repositorySuccess(await this.mockSource.getInterFlatAuditLogs(params));
    }
    async createWaterLeakageIssue(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    }
    async createNoiseComplaintIssue(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    }
    async createRenovationDisturbanceIssue(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    }
    async createPetNuisanceIssue(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    }
    async createDamageClaimIssue(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    }
    async createWrongParkingIssue(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    }
    async submitResolutionProposal(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    }
}
export const interFlatRepository = new InterFlatRepository();
export type { InterFlatRepository };

