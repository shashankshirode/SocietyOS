import type { DisputeCase } from '../domain/types/case.types';
import type { EvidenceRecord } from '../domain/types/evidence.types';
import type { TimelineEvent, CaseAuditEntry } from '../domain/types/timeline.types';
import type { Inspection } from '../domain/types/inspection.types';
import type { ResolutionProposal, PartyDecision, MediatorNote, ClosureProof } from '../domain/types/mediation.types';
import type { Mediation } from '../domain/stateMachines/mediationMachine';
import type { Escalation } from '../domain/types/escalation.types';
import type { DisputeRetentionRecord } from '../domain/types/retention.types';
import { EMPTY_SNAPSHOT, createDurableDisputePersistence, isDisputeSnapshot, type DisputeSnapshot, type DisputeSnapshotSink, } from './durableDisputePersistence';
import { createInMemoryCaseAuditSink, createInMemoryCaseStore, createInMemoryClosureProofStore, createInMemoryEscalationStore, createInMemoryEvidenceStore, createInMemoryFinanceLinkStore, createInMemoryInspectionStore, createInMemoryMediationStore, createInMemoryMoveOutLinkStore, createInMemoryPlatformAuditSink, createInMemoryProposalStore, createInMemoryRetentionStore, createInMemoryTimelineStore, } from './inMemoryDisputeStores';
import type { CaseAuditSink, DisputeCaseStore, EvidenceStore, EscalationStore, FinanceLinkStore, InspectionStore, MediationStore, MoveOutLinkStore, PlatformAuditSink, ClosureProofStore, ProposalStore, RetentionStore, TimelineStore, } from '../application/ports';
import { createDisputeRuntime, type DisputeRuntime, type DisputeRuntimeOptions } from './disputeRuntime';
export type DurableDisputeRuntime = DisputeRuntime & {
    readonly durable: {
        readonly flush: () => Promise<void>;
        readonly snapshot: () => DisputeSnapshot;
        readonly rehydrate: () => Promise<boolean>;
        readonly clear: () => Promise<void>;
    };
};
export function createDurableDisputeRuntime(sink: DisputeSnapshotSink, options: DisputeRuntimeOptions = {}): DurableDisputeRuntime {
    const cases = createInMemoryCaseStore();
    const evidence = createInMemoryEvidenceStore();
    const timeline = createInMemoryTimelineStore();
    const inspections = createInMemoryInspectionStore();
    const mediations = createInMemoryMediationStore();
    const proposals = createInMemoryProposalStore();
    const closureProofs = createInMemoryClosureProofStore();
    const escalations = createInMemoryEscalationStore();
    const retention = createInMemoryRetentionStore();
    const financeLinks = createInMemoryFinanceLinkStore();
    const moveOutLinks = createInMemoryMoveOutLinkStore();
    const caseAudit = createInMemoryCaseAuditSink();
    const platformAudit = createInMemoryPlatformAuditSink();
    const sequences = new Map<string, number>();
    const persistence = createDurableDisputePersistence(sink);
    const evidenceIds = new Set<string>();
    const timelineIds = new Set<string>();
    const inspectionIds = new Set<string>();
    const mediationIds = new Set<string>();
    const proposalIds = new Set<string>();
    const proofIds = new Set<string>();
    const escalationIds = new Set<string>();
    const auditIds = new Set<string>();
    const compact = <T>(records: readonly (T | undefined)[]): readonly T[] => records.filter((record): record is T => record !== undefined);
    const buildSnapshot = (): DisputeSnapshot => {
        const allCases = cases.snapshot();
        const allEvidence: readonly EvidenceRecord[] = compact([...evidenceIds].map((id) => evidence.read(id)));
        const allMediations: readonly Mediation[] = compact([...mediationIds].map((id) => mediations.read(id)));
        const allProposals: readonly ResolutionProposal[] = compact([...proposalIds].map((id) => proposals.read(id)));
        const allProofs: readonly ClosureProof[] = compact([...proofIds].map((id) => closureProofs.read(id)));
        const allInspections: readonly Inspection[] = compact([...inspectionIds].map((id) => inspections.read(id)));
        const allEscalations: readonly Escalation[] = compact([...escalationIds].map((id) => escalations.read(id)));
        const allTimeline: readonly TimelineEvent[] = compact([...allCases.flatMap((disputeCase) => timeline.listByCase(disputeCase.id))].filter((event) => timelineIds.has(event.id)));
        const allAudit: readonly CaseAuditEntry[] = compact(allCases.flatMap((disputeCase) => caseAudit.listByCase(disputeCase.id)));
        return {
            schemaVersion: EMPTY_SNAPSHOT.schemaVersion,
            writtenAt: new Date(0).toISOString(),
            cases: allCases,
            parties: allCases.flatMap((disputeCase) => disputeCase.parties),
            affectedProperties: allCases.flatMap((disputeCase) => disputeCase.propertyTags),
            evidence: allEvidence,
            claims: allCases.flatMap((disputeCase) => disputeCase.claims),
            responses: allCases.flatMap((disputeCase) => disputeCase.responses),
            inspections: allInspections,
            inspectionFindings: allInspections
                .filter((inspection) => inspection.findings !== undefined)
                .map((inspection) => ({ inspectionId: inspection.id, finding: inspection.findings as string })),
            mediations: allMediations,
            mediatorAssignments: allMediations
                .filter((mediation) => mediation.mediatorUserId !== undefined)
                .map((mediation) => ({
                mediationId: mediation.id,
                mediatorUserId: mediation.mediatorUserId as string,
            })),
            mediatorNotes: allMediations.flatMap((mediation): readonly MediatorNote[] => mediation.notes),
            proposals: allProposals,
            decisions: allProposals.flatMap((proposal): readonly (PartyDecision & {
                readonly proposalId: string;
            })[] => proposal.decisions.map((decision) => ({ ...decision, proposalId: proposal.id }))),
            actionCommitments: [],
            closureProofs: allProofs,
            escalations: allEscalations,
            retention: allCases.flatMap((disputeCase) => {
                const record = retention.read(disputeCase.id);
                return record === undefined ? [] : [record];
            }),
            ruleDecisions: [],
            timeline: allTimeline,
            audit: allAudit,
            caseSequences: Object.fromEntries(sequences),
        };
    };
    const persist = (): void => {
        persistence.schedule(buildSnapshot);
    };
    const durableCases: DisputeCaseStore = {
        read: (caseId) => cases.read(caseId),
        insert: (disputeCase) => {
            const inserted = cases.insert(disputeCase);
            if (inserted) {
                persist();
            }
            return inserted;
        },
        commit: (caseId, disputeCase, expectedRevision) => {
            const committed = cases.commit(caseId, disputeCase, expectedRevision);
            if (committed) {
                persist();
            }
            return committed;
        },
        listBySociety: (societyId) => cases.listBySociety(societyId),
        listByParty: (societyId, userId) => cases.listByParty(societyId, userId),
        nextCaseSequence: (societyId) => {
            const next = cases.nextCaseSequence(societyId);
            sequences.set(societyId, next);
            persist();
            return next;
        },
    };
    const durableEvidence: EvidenceStore = {
        insert: (record) => {
            const done = evidence.insert(record);
            if (done) {
                evidenceIds.add(record.id);
                persist();
            }
            return done;
        },
        update: (record) => {
            const done = evidence.update(record);
            if (done) {
                evidenceIds.add(record.id);
                persist();
            }
            return done;
        },
        read: (evidenceId) => evidence.read(evidenceId),
        listByCase: (caseId) => evidence.listByCase(caseId),
    };
    const durableTimeline: TimelineStore = {
        append: (event) => {
            const done = timeline.append(event);
            if (done) {
                timelineIds.add(event.id);
                persist();
            }
            return done;
        },
        listByCase: (caseId) => timeline.listByCase(caseId),
    };
    const durableInspections: InspectionStore = {
        insert: (inspection) => {
            const done = inspections.insert(inspection);
            if (done) {
                inspectionIds.add(inspection.id);
                persist();
            }
            return done;
        },
        update: (inspection) => {
            const done = inspections.update(inspection);
            if (done) {
                inspectionIds.add(inspection.id);
                persist();
            }
            return done;
        },
        read: (inspectionId) => inspections.read(inspectionId),
        listByCase: (caseId) => inspections.listByCase(caseId),
    };
    const durableMediations: MediationStore = {
        insert: (mediation) => {
            const done = mediations.insert(mediation);
            if (done) {
                mediationIds.add(mediation.id);
                persist();
            }
            return done;
        },
        update: (mediation) => {
            const done = mediations.update(mediation);
            if (done) {
                mediationIds.add(mediation.id);
                persist();
            }
            return done;
        },
        read: (mediationId) => mediations.read(mediationId),
    };
    const durableProposals: ProposalStore = {
        insert: (proposal) => {
            const done = proposals.insert(proposal);
            if (done) {
                proposalIds.add(proposal.id);
                persist();
            }
            return done;
        },
        update: (proposal) => {
            const done = proposals.update(proposal);
            if (done) {
                proposalIds.add(proposal.id);
                persist();
            }
            return done;
        },
        read: (proposalId) => proposals.read(proposalId),
        listByCase: (caseId) => proposals.listByCase(caseId),
    };
    const durableClosureProofs: ClosureProofStore = {
        insert: (proof) => {
            const done = closureProofs.insert(proof);
            if (done) {
                proofIds.add(proof.id);
                persist();
            }
            return done;
        },
        update: (proof) => {
            const done = closureProofs.update(proof);
            if (done) {
                proofIds.add(proof.id);
                persist();
            }
            return done;
        },
        read: (proofId) => closureProofs.read(proofId),
        listByCase: (caseId) => closureProofs.listByCase(caseId),
    };
    const durableEscalations: EscalationStore = {
        insert: (escalation) => {
            const done = escalations.insert(escalation);
            if (done) {
                escalationIds.add(escalation.id);
                persist();
            }
            return done;
        },
        update: (escalation) => {
            const done = escalations.update(escalation);
            if (done) {
                escalationIds.add(escalation.id);
                persist();
            }
            return done;
        },
        read: (escalationId) => escalations.read(escalationId),
        listByCase: (caseId) => escalations.listByCase(caseId),
    };
    const durableRetention: RetentionStore = {
        upsert: (record) => {
            const done = retention.upsert(record);
            if (done) {
                persist();
            }
            return done;
        },
        read: (caseId) => retention.read(caseId),
        listBySociety: (societyId) => retention.listBySociety(societyId),
    };
    const durableFinanceLinks: FinanceLinkStore = {
        insert: (link) => {
            const done = financeLinks.insert(link);
            if (done) {
                persist();
            }
            return done;
        },
        update: (link) => {
            const done = financeLinks.update(link);
            if (done) {
                persist();
            }
            return done;
        },
        read: (linkId) => financeLinks.read(linkId),
        listByCase: (caseId) => financeLinks.listByCase(caseId),
    };
    const durableMoveOutLinks: MoveOutLinkStore = {
        insert: (link) => {
            const done = moveOutLinks.insert(link);
            if (done) {
                persist();
            }
            return done;
        },
        update: (link) => {
            const done = moveOutLinks.update(link);
            if (done) {
                persist();
            }
            return done;
        },
        read: (linkId) => moveOutLinks.read(linkId),
        listByCase: (caseId) => moveOutLinks.listByCase(caseId),
    };
    const durableCaseAudit: CaseAuditSink = {
        emit: (entry) => {
            caseAudit.emit(entry);
            persist();
        },
        listByCase: (caseId) => caseAudit.listByCase(caseId),
    };
    const durablePlatformAudit: PlatformAuditSink = {
        emit: (entry) => {
            platformAudit.emit(entry);
            persist();
        },
    };
    const runtime = createDisputeRuntime({
        ...options,
        stores: {
            cases: durableCases,
            evidence: durableEvidence,
            timeline: durableTimeline,
            inspections: durableInspections,
            mediations: durableMediations,
            proposals: durableProposals,
            closureProofs: durableClosureProofs,
            escalations: durableEscalations,
            retention: durableRetention,
            financeLinks: durableFinanceLinks,
            moveOutLinks: durableMoveOutLinks,
            caseAudit: durableCaseAudit,
            platformAudit: durablePlatformAudit,
        },
    });
    const rehydrate = async (): Promise<boolean> => {
        const stored = await persistence.hydrate();
        if (stored === undefined || !isDisputeSnapshot(stored)) {
            return false;
        }
        for (const disputeCase of stored.cases) {
            if (cases.read(disputeCase.id) === undefined) {
                cases.insert(disputeCase);
            }
        }
        for (const record of stored.evidence) {
            evidenceIds.add(record.id);
            if (evidence.read(record.id) === undefined) {
                evidence.insert(record);
            }
        }
        for (const event of stored.timeline) {
            if (timeline.listByCase(event.caseId).some((existing) => existing.id === event.id)) {
                continue;
            }
            timeline.append(event);
            timelineIds.add(event.id);
        }
        for (const inspection of stored.inspections) {
            inspectionIds.add(inspection.id);
            if (inspections.read(inspection.id) === undefined) {
                inspections.insert(inspection);
            }
        }
        for (const mediation of stored.mediations) {
            mediationIds.add(mediation.id);
            if (mediations.read(mediation.id) === undefined) {
                mediations.insert(mediation);
            }
        }
        for (const proposal of stored.proposals) {
            proposalIds.add(proposal.id);
            if (proposals.read(proposal.id) === undefined) {
                proposals.insert(proposal);
            }
        }
        for (const proof of stored.closureProofs) {
            proofIds.add(proof.id);
            if (closureProofs.read(proof.id) === undefined) {
                closureProofs.insert(proof);
            }
        }
        for (const escalation of stored.escalations) {
            escalationIds.add(escalation.id);
            if (escalations.read(escalation.id) === undefined) {
                escalations.insert(escalation);
            }
        }
        for (const record of Object.values(stored.retention ?? {})) {
            if (retention.read(record.caseId) === undefined) {
                retention.upsert(record);
            }
        }
        for (const entry of stored.audit) {
            if (caseAudit.listByCase(entry.caseId).some((existing) => existing.id === entry.id)) {
                continue;
            }
            caseAudit.emit(entry);
        }
        for (const [societyId, next] of Object.entries(stored.caseSequences)) {
            sequences.set(societyId, next);
        }
        return true;
    };
    return {
        ...runtime,
        durable: {
            flush: () => persistence.flush(),
            snapshot: buildSnapshot,
            rehydrate,
            clear: async () => {
                await persistence.clear();
            },
        },
    };
}

