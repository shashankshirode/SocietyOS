import type { EvidencePlaceholder, InterFlatIssueResponse, InterFlatIssueType, InterFlatIssueSeverity, InterFlatIssueStatus, } from '../../../../shared/types/interFlat.types';
import type { FacilityInspection, MediatorNoteVisibility, ResolutionProposal, } from '../../../../shared/types/disputeMediation.types';
import type { Absent } from "../../../../shared/types/absence.types";
export interface InterFlatIssueDto {
    id: string;
    issue_number: string;
    issue_type: InterFlatIssueType;
    severity: InterFlatIssueSeverity;
    status: InterFlatIssueStatus;
    reporter_user_id: string;
    reporter_user_name: string;
    reporter_flat: string;
    reporter_tower: string;
    involved_flat: string;
    involved_tower: string;
    involved_resident_name?: string;
    location: string;
    description: string;
    preferred_resolution?: string;
    evidence: EvidencePlaceholder[];
    responses: InterFlatIssueResponse[];
    inspection_id?: string;
    mediation_id?: string;
    rule_reference_ids?: string[];
    created_at: string;
    updated_at: string;
    resolved_at?: string;
    closed_at?: string;
    closure_summary?: string;
}
export type InterFlatQuery = Record<string, string | number | boolean | Absent>;
export type InterFlatIssueTypeOption = {
    type: InterFlatIssueType;
    title: string;
    description: string;
    evidence: string;
};
export type InterFlatHomeSummary = {
    societyName: string;
    userRole: string;
    myOpenIssuesCount: number;
    awaitingMyResponseCount: number;
    pendingInspectionsCount: number;
    activeMediationsCount: number;
    pendingRuleAcknowledgementsCount: number;
    recentlyClosedCount: number;
};
export type InterFlatSettings = {
    issueCategoriesEnabled: string[];
    responseDeadlineDays: number;
    mediationAssignmentRules: string;
    inspectionSlaHours: number;
    evidenceVisibility: string;
};
export type InterFlatRuleCategorySummary = {
    name: string;
    count: number;
    pending: number;
    lastUpdated: string;
};
export type SubmitIssueResponseInput = Pick<InterFlatIssueResponse, 'responseType' | 'explanation' | 'willCooperateWithInspection' | 'proposedResolution'>;
export type AddEvidenceInput = {
    evidenceType: EvidencePlaceholder['evidenceType'];
    fileName?: string;
    fileSize?: string;
    note?: string;
};
export type NotifyInvolvedFlatInput = Record<string, never>;
export type AddIssueTimelineEventInput = {
    actorRole?: string;
    eventType?: string;
    summary?: string;
};
export type RequestFacilityInspectionInput = {
    preferredTime?: string;
};
export type CompleteFacilityInspectionInput = Pick<FacilityInspection, 'findings' | 'rootCause' | 'recommendedAction'>;
export type AssignMediatorInput = {
    mediatorName: string;
};
export type AddMediatorNoteInput = {
    note: string;
    visibility: MediatorNoteVisibility;
};
export type CreateResolutionProposalInput = Pick<ResolutionProposal, 'proposedResolution' | 'responsibleParty' | 'targetDate' | 'acceptanceScope'>;
export type ResolutionDecisionInput = {
    role: 'REPORTER' | 'INVOLVED_FLAT';
    feedback?: string;
};
export type ResidentResolutionProposalDetail = {
    proposal: ResolutionProposal;
    reporterFlat: string;
    involvedFlat: string;
};
export type ClosureProofInput = {
    closureNote?: string;
};
export type EscalateIssueInput = {
    reason?: string;
    action?: string;
};

