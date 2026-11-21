import { mockInterFlatDashboard } from '../../../../shared/mock/interFlatDashboard.mock';
import { mockInterFlatIssues } from '../../../../shared/mock/interFlatIssues.mock';
import { mockInterFlatTimeline } from '../../../../shared/mock/interFlatTimeline.mock';
import { mockFacilityInspections } from '../../../../shared/mock/facilityInspections.mock';
import { mockDisputeMediations } from '../../../../shared/mock/disputeMediations.mock';
import { mockResolutionProposals } from '../../../../shared/mock/resolutionProposals.mock';
import { mockSocietyRules } from '../../../../shared/mock/societyRules.mock';
import { mockRuleAcknowledgements } from '../../../../shared/mock/ruleAcknowledgements.mock';
import { mockRuleViolations } from '../../../../shared/mock/ruleViolations.mock';
import { mockPenaltyReadiness } from '../../../../shared/mock/penaltyReadiness.mock';
import { mockInterFlatAuditLogs } from '../../../../shared/mock/interFlatAuditLogs.mock';
import type { InterFlatIssue, CreateInterFlatIssueInput } from '../../../../shared/types/interFlat.types';
import type { Inspection, MediationCase, Proposal, Note } from '../../../../shared/types/disputeMediation.types';
import type { Rule, RuleAcknowledgement, RuleAcknowledgementReport } from '../../../../shared/types/rules.types';
import type { AddEvidenceInput, AddIssueTimelineEventInput, AddMediatorNoteInput, AssignMediatorInput, ClosureProofInput, CompleteFacilityInspectionInput, CreateResolutionProposalInput, EscalateIssueInput, InterFlatQuery, InterFlatIssueTypeOption, NotifyInvolvedFlatInput, RequestFacilityInspectionInput, ResolutionDecisionInput, SubmitIssueResponseInput, } from './interFlat.dto';
import { mockStore } from '../../../../core/mockStore/mockStore';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
export class InterFlatMockSource {
    async getInterFlatHome() {
        return mockInterFlatDashboard;
    }
    async getMyInterFlatIssues(params?: InterFlatQuery) {
        return mockStore.getState().interFlatIssues;
    }
    async getIssueTypes(): Promise<InterFlatIssueTypeOption[]> {
        return [
            { type: 'WATER_LEAKAGE', title: 'Water Leakage', description: 'Water seepage from ceiling, wall, or shaft.', evidence: 'Photos of dampness, wet flooring' },
            { type: 'NOISE_DISTURBANCE', title: 'Noise Disturbance', description: 'Loud music, drilling, or shouting during quiet hours.', evidence: 'Audio recording, decibel log' },
            { type: 'RENOVATION_DISTURBANCE', title: 'Renovation Disturbance', description: 'Work outside allowed hours, dust, debris.', evidence: 'Photos of dust, debris, work timing log' },
            { type: 'PET_NUISANCE', title: 'Pet Nuisance', description: 'Unleashed pet, barking, cleanliness issues.', evidence: 'Photos, videos' },
            { type: 'COMMON_AREA_DAMAGE', title: 'Common Area Damage', description: 'Scrapes on wall, broken fixtures, lift damage.', evidence: 'Photos of damage' },
            { type: 'OTHER', title: 'Other Issue', description: 'Any other neighbour or flat related issue.', evidence: 'Applicable photos/docs' }
        ];
    }
    async createInterFlatIssue(input: CreateInterFlatIssueInput): Promise<InterFlatIssue> {
        const newIssue: InterFlatIssue = {
            id: `issue-0${mockStore.getState().interFlatIssues.length + 1}`,
            issueNumber: `IF-2026-0${mockStore.getState().interFlatIssues.length + 1}`,
            issueType: input.issueType,
            severity: input.severity,
            status: 'SUBMITTED',
            reporterUserId: 'resident-001',
            reporterUserName: 'Shashank',
            reporterFlat: 'A-1204',
            reporterTower: 'A Wing',
            involvedFlat: input.involvedFlat,
            involvedTower: input.involvedTower,
            involvedResidentName: 'Neighbour Resident',
            location: input.location,
            description: input.description,
            ...includeWhenPresent("preferredResolution", input.preferredResolution),
            evidence: [],
            responses: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockStore.addInterFlatIssue(newIssue);
        mockInterFlatTimeline.unshift({
            id: `t-0${mockInterFlatTimeline.length + 1}`,
            issueId: newIssue.id,
            timestamp: newIssue.createdAt,
            actorRole: 'REPORTER',
            eventType: 'ISSUE_CREATED',
            summary: `Issue ${newIssue.issueNumber} created for ${newIssue.issueType}.`,
            isVisibleToResident: true
        });
        return newIssue;
    }
    async getInterFlatIssueDetail(issueId: string): Promise<InterFlatIssue | Absent> {
        return mockStore.getState().interFlatIssues.find(i => i.id === issueId);
    }
    async submitIssueResponse(issueId: string, input: SubmitIssueResponseInput) {
        const issue = mockStore.getState().interFlatIssues.find(i => i.id === issueId);
        if (issue) {
            const newResponse = {
                id: `resp-0${Date.now()}`,
                responseType: input.responseType,
                explanation: input.explanation,
                willCooperateWithInspection: input.willCooperateWithInspection,
                ...includeWhenPresent("proposedResolution", input.proposedResolution),
                evidence: [],
                responderName: 'Amit Sharma',
                responderFlat: issue.involvedFlat,
                respondedAt: new Date().toISOString()
            };
            const updatedResponses = [...(issue.responses || []), newResponse];
            mockStore.updateInterFlatIssue(issueId, {
                responses: updatedResponses,
                status: 'RESPONSE_RECEIVED',
                updatedAt: new Date().toISOString()
            });
            mockInterFlatTimeline.unshift({
                id: `t-0${mockInterFlatTimeline.length + 1}`,
                issueId,
                timestamp: newResponse.respondedAt,
                actorRole: 'INVOLVED_RESIDENT',
                eventType: 'RESPONSE_SUBMITTED',
                summary: `Response submitted by ${newResponse.responderName} (${newResponse.responderFlat}).`,
                isVisibleToResident: true
            });
            return newResponse;
        }
        throw new Error('Issue not found');
    }
    async addEvidencePlaceholder(issueId: string, input: AddEvidenceInput) {
        const issue = mockInterFlatIssues.find(i => i.id === issueId);
        if (issue) {
            const newEvidence = {
                id: `ev-0${Date.now()}`,
                evidenceType: input.evidenceType,
                fileName: input.fileName || 'evidence_upload.jpg',
                fileSizePlaceholder: input.fileSize || '1.8 MB',
                uploadedByUserName: 'Shashank',
                uploadedAt: new Date().toISOString(),
                ...includeWhenPresent("note", input.note)
            };
            issue.evidence.push(newEvidence);
            issue.updatedAt = new Date().toISOString();
            return newEvidence;
        }
        throw new Error('Issue not found');
    }
    async notifyInvolvedFlat(issueId: string, input: NotifyInvolvedFlatInput) {
        const issue = mockInterFlatIssues.find(i => i.id === issueId);
        if (issue) {
            issue.status = 'NEIGHBOUR_NOTIFIED';
            issue.updatedAt = new Date().toISOString();
            return { success: true };
        }
        throw new Error('Issue not found');
    }
    async getIssueTimeline(issueId: string) {
        return mockInterFlatTimeline.filter(t => t.issueId === issueId);
    }
    async addIssueTimelineEvent(issueId: string, input: AddIssueTimelineEventInput) {
        const newEvent = {
            id: `t-0${Date.now()}`,
            issueId,
            timestamp: new Date().toISOString(),
            actorRole: input.actorRole || 'SYSTEM',
            eventType: input.eventType || 'STATUS_UPDATE',
            summary: input.summary || 'Status updated.',
            isVisibleToResident: true
        };
        mockInterFlatTimeline.unshift(newEvent);
        return newEvent;
    }
    async requestFacilityInspection(issueId: string, input: RequestFacilityInspectionInput): Promise<Inspection> {
        const issue = mockInterFlatIssues.find(i => i.id === issueId);
        const newInspection: Inspection = {
            id: `insp-0${mockFacilityInspections.length + 1}`,
            inspectionNumber: `INSP-2026-0${mockFacilityInspections.length + 1}`,
            issueId,
            issueNumber: issue?.issueNumber || 'IF-UNK',
            assignedToName: 'Suresh Patil',
            scheduledTime: input.preferredTime || new Date().toISOString(),
            status: 'REQUESTED',
            ...includeWhenPresent("findings", undefined),
            evidence: []
        };
        mockFacilityInspections.unshift(newInspection);
        if (issue) {
            issue.inspectionId = newInspection.id;
            issue.status = 'INSPECTION_REQUESTED';
            issue.updatedAt = new Date().toISOString();
        }
        return newInspection;
    }
    async getFacilityInspection(inspectionId: string): Promise<Inspection | Absent> {
        return mockFacilityInspections.find(i => i.id === inspectionId);
    }
    async completeFacilityInspection(inspectionId: string, input: CompleteFacilityInspectionInput) {
        const inspection = mockFacilityInspections.find(i => i.id === inspectionId);
        if (inspection) {
            inspection.status = 'COMPLETED';
            if (input.findings !== undefined) {
                inspection.findings = input.findings;
            }
            if (input.rootCause !== undefined) {
                inspection.rootCause = input.rootCause;
            }
            if (input.recommendedAction !== undefined) {
                inspection.recommendedAction = input.recommendedAction;
            }
            inspection.completedAt = new Date().toISOString();
            const issue = mockInterFlatIssues.find(i => i.id === inspection.issueId);
            if (issue) {
                issue.status = 'INSPECTION_COMPLETED';
                issue.updatedAt = new Date().toISOString();
            }
            return inspection;
        }
        throw new Error('Inspection not found');
    }
    async getMediationCase(mediationId: string): Promise<MediationCase | Absent> {
        return mockDisputeMediations.find(m => m.id === mediationId);
    }
    async assignMediator(mediationId: string, input: AssignMediatorInput) {
        const mCase = mockDisputeMediations.find(m => m.id === mediationId);
        if (mCase) {
            mCase.mediatorName = input.mediatorName;
            mCase.status = 'ASSIGNED';
            mCase.updatedAt = new Date().toISOString();
            return mCase;
        }
        throw new Error('Mediation case not found');
    }
    async addMediatorNote(mediationId: string, input: AddMediatorNoteInput) {
        const mCase = mockDisputeMediations.find(m => m.id === mediationId);
        if (mCase) {
            const newNote: Note = {
                id: `note-0${Date.now()}`,
                authorName: 'Anil Deshmukh',
                noteText: input.note,
                visibility: input.visibility,
                createdAt: new Date().toISOString()
            };
            mCase.notes.push(newNote);
            mCase.updatedAt = new Date().toISOString();
            return newNote;
        }
        throw new Error('Mediation case not found');
    }
    async createResolutionProposal(mediationId: string, input: CreateResolutionProposalInput): Promise<Proposal> {
        const mCase = mockDisputeMediations.find(m => m.id === mediationId);
        const newProposal: Proposal = {
            id: `prop-0${mockResolutionProposals.length + 1}`,
            mediationId,
            proposedResolution: input.proposedResolution,
            responsibleParty: input.responsibleParty,
            targetDate: input.targetDate,
            acceptanceScope: input.acceptanceScope,
            createdAt: new Date().toISOString()
        };
        mockResolutionProposals.unshift(newProposal);
        if (mCase) {
            mCase.proposals.push(newProposal);
            mCase.status = 'RESOLUTION_PROPOSED';
            mCase.updatedAt = new Date().toISOString();
            const issue = mockInterFlatIssues.find(i => i.id === mCase.issueId);
            if (issue) {
                issue.status = 'RESOLUTION_PROPOSED';
                issue.updatedAt = new Date().toISOString();
            }
        }
        return newProposal;
    }
    async getResolutionProposalDetail(proposalId: string) {
        const proposal = mockResolutionProposals.find((candidate) => candidate.id === proposalId);
        if (!proposal)
            return undefined;
        const mediation = mockDisputeMediations.find((candidate) => candidate.id === proposal.mediationId);
        if (!mediation)
            return undefined;
        return {
            proposal,
            reporterFlat: mediation.reporterFlat,
            involvedFlat: mediation.involvedFlat
        };
    }
    async acceptResolutionProposal(proposalId: string, input: ResolutionDecisionInput) {
        const proposal = mockResolutionProposals.find(p => p.id === proposalId);
        if (proposal) {
            if (input.role === 'REPORTER') {
                proposal.reporterAccepted = true;
                if (input.feedback !== undefined) {
                    proposal.reporterFeedback = input.feedback;
                }
            }
            else {
                proposal.involvedFlatAccepted = true;
                if (input.feedback !== undefined) {
                    proposal.involvedFlatFeedback = input.feedback;
                }
            }
            return proposal;
        }
        throw new Error('Proposal not found');
    }
    async rejectResolutionProposal(proposalId: string, input: ResolutionDecisionInput) {
        const proposal = mockResolutionProposals.find(p => p.id === proposalId);
        if (proposal) {
            if (input.role === 'REPORTER') {
                proposal.reporterAccepted = false;
                if (input.feedback !== undefined) {
                    proposal.reporterFeedback = input.feedback;
                }
            }
            else {
                proposal.involvedFlatAccepted = false;
                if (input.feedback !== undefined) {
                    proposal.involvedFlatFeedback = input.feedback;
                }
            }
            return proposal;
        }
        throw new Error('Proposal not found');
    }
    async submitClosureProof(proposalId: string, input: ClosureProofInput) {
        const proposal = mockResolutionProposals.find(p => p.id === proposalId);
        if (proposal) {
            const mCase = mockDisputeMediations.find(m => m.id === proposal.mediationId);
            if (mCase) {
                mCase.status = 'CLOSED';
                mCase.updatedAt = new Date().toISOString();
                const issue = mockInterFlatIssues.find(i => i.id === mCase.issueId);
                if (issue) {
                    issue.status = 'CLOSED';
                    issue.resolvedAt = new Date().toISOString();
                    issue.closedAt = new Date().toISOString();
                    issue.closureSummary = input.closureNote || 'Resolved through mutual mediation.';
                    issue.updatedAt = new Date().toISOString();
                }
            }
            return { success: true };
        }
        throw new Error('Proposal not found');
    }
    async escalateIssue(issueId: string, input: EscalateIssueInput) {
        const issue = mockInterFlatIssues.find(i => i.id === issueId);
        if (issue) {
            issue.status = 'ESCALATED';
            issue.updatedAt = new Date().toISOString();
            const existingMed = mockDisputeMediations.find(m => m.issueId === issueId);
            if (!existingMed) {
                const newMed: MediationCase = {
                    id: `med-0${mockDisputeMediations.length + 1}`,
                    caseNumber: `MED-2026-0${mockDisputeMediations.length + 1}`,
                    issueId,
                    issueNumber: issue.issueNumber,
                    reporterFlat: issue.reporterFlat,
                    involvedFlat: issue.involvedFlat,
                    status: 'REQUESTED',
                    notes: [],
                    proposals: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                mockDisputeMediations.unshift(newMed);
                issue.mediationId = newMed.id;
            }
            return { success: true };
        }
        throw new Error('Issue not found');
    }
    async closeIssue(issueId: string, input: ClosureProofInput) {
        const issue = mockInterFlatIssues.find(i => i.id === issueId);
        if (issue) {
            issue.status = 'CLOSED';
            issue.closedAt = new Date().toISOString();
            issue.closureSummary = input.closureNote || 'Closed directly by reporter.';
            issue.updatedAt = new Date().toISOString();
            return { success: true };
        }
        throw new Error('Issue not found');
    }
    async getDisputeHistory(params?: InterFlatQuery) {
        return mockInterFlatIssues.filter(i => i.status === 'CLOSED' || i.status === 'RESOLVED');
    }
    async getRuleLibrary(params?: InterFlatQuery) {
        return mockSocietyRules;
    }
    async getRuleCategories() {
        return [
            { name: 'General rules', count: 5, pending: 0, lastUpdated: '2026-01-01' },
            { name: 'Renovation rules', count: 3, pending: 1, lastUpdated: '2026-02-15' },
            { name: 'Noise and quiet hours', count: 4, pending: 1, lastUpdated: '2026-01-01' },
            { name: 'Pet rules', count: 3, pending: 0, lastUpdated: '2025-06-01' }
        ];
    }
    async getRuleDetail(ruleId: string): Promise<Rule | Absent> {
        return mockSocietyRules.find(r => r.id === ruleId);
    }
    async acknowledgeRule(ruleId: string): Promise<RuleAcknowledgement> {
        const rule = mockSocietyRules.find(r => r.id === ruleId);
        const newAck: RuleAcknowledgement = {
            id: `ack-0${mockRuleAcknowledgements.length + 1}`,
            ruleId,
            ruleTitle: rule?.title || 'Unknown Rule',
            ruleVersion: rule?.version || '1.0',
            userName: 'Shashank',
            unitId: 'unit-a-1204',
            flatNumber: 'A-1204',
            acknowledgedAt: new Date().toISOString(),
            referenceNumber: `ACK-R${ruleId.replace('rule-', '')}-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'ACKNOWLEDGED'
        };
        mockRuleAcknowledgements.unshift(newAck);
        return newAck;
    }
    async getMyRuleAcknowledgements(params?: InterFlatQuery) {
        return mockRuleAcknowledgements.filter(a => a.flatNumber === 'A-1204');
    }
    async getAdminRuleAcknowledgementReport(ruleId: string, params?: InterFlatQuery): Promise<RuleAcknowledgementReport> {
        const rule = mockSocietyRules.find(r => r.id === ruleId);
        return {
            ruleId,
            ruleTitle: rule?.title || 'Silent Hours and Noise Control',
            ruleVersion: rule?.version || '2.1',
            totalRequired: 150,
            acknowledgedCount: 112,
            pendingCount: 38,
            completionPercentage: 75,
            acknowledgements: mockRuleAcknowledgements.map(a => ({
                userName: a.userName,
                flatNumber: a.flatNumber,
                status: a.status,
                acknowledgedAt: a.acknowledgedAt
            }))
        };
    }
    async getRuleViolations(params?: InterFlatQuery) {
        return mockRuleViolations;
    }
    async getPenaltyReadiness(params?: InterFlatQuery) {
        return mockPenaltyReadiness;
    }
    async getInterFlatSettings() {
        return {
            issueCategoriesEnabled: ['WATER_LEAKAGE', 'NOISE_DISTURBANCE', 'RENOVATION_DISTURBANCE', 'PET_NUISANCE', 'COMMON_AREA_DAMAGE'],
            responseDeadlineDays: 5,
            mediationAssignmentRules: 'Committee mediator assigned automatically after 5 days of no response.',
            inspectionSlaHours: 48,
            evidenceVisibility: 'Reporter, Involved, Facility, and Committee only'
        };
    }
    async getInterFlatAuditLogs(params?: InterFlatQuery) {
        return mockInterFlatAuditLogs;
    }
}

