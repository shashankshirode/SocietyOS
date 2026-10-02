import type { DisputePolicyOverrides } from '../domain/types/policy.types';
import { resolveDisputePolicies } from '../domain/types/policy.types';
import type { DisputeClock } from '../domain/types/primitives';
import type { EvidenceVaultPort } from '../domain/types/evidence.types';
import { UNAVAILABLE_COMMUNICATION_THREADS } from '../application/communicationPorts';
import type { DisputePorts } from '../application/ports';
import { createCaseService } from '../application/caseService';
import { createClosureService, createIntegrationLinkService, createRetentionService } from '../application/closureService';
import { createInspectionService } from '../application/inspectionService';
import { createMediationService } from '../application/mediationService';
import { createFailClosedEvidenceVault, createFixedClock, createInMemoryCaseAuditSink, createInMemoryCaseStore, createInMemoryClosureProofStore, createInMemoryEscalationStore, createInMemoryEvidenceStore, createInMemoryFinanceLinkStore, createInMemoryIdempotencyLedger, createInMemoryInspectionStore, createInMemoryMediationStore, createInMemoryMoveOutLinkStore, createInMemoryNotificationPort, createInMemoryPlatformAuditSink, createInMemoryProposalStore, createInMemoryRetentionStore, createInMemoryTimelineStore, } from './inMemoryDisputeStores';
export type DisputeRuntimeOptions = {
    readonly now?: Date;
    readonly caseNumberPrefix?: string;
    readonly policyOverrides?: DisputePolicyOverrides;
    readonly evidenceVaultName?: string;
    readonly evidenceVault?: EvidenceVaultPort;
    readonly notificationChannel?: string;
    readonly stores?: Partial<DisputePorts>;
};
export type DisputeRuntime = {
    readonly ports: DisputePorts;
    readonly cases: ReturnType<typeof createCaseService>;
    readonly inspections: ReturnType<typeof createInspectionService>;
    readonly mediation: ReturnType<typeof createMediationService>;
    readonly closure: ReturnType<typeof createClosureService>;
    readonly retention: ReturnType<typeof createRetentionService>;
    readonly links: ReturnType<typeof createIntegrationLinkService>;
    readonly clock: DisputeClock;
};
export function createDisputeRuntime(options: DisputeRuntimeOptions = {}): DisputeRuntime {
    const clock: DisputeClock = options.now === undefined
        ? createFixedClock(new Date())
        : createFixedClock(options.now);
    const ports: DisputePorts = {
        clock,
        ledger: createInMemoryIdempotencyLedger(),
        cases: options.stores?.cases ?? createInMemoryCaseStore(),
        evidence: options.stores?.evidence ?? createInMemoryEvidenceStore(),
        timeline: options.stores?.timeline ?? createInMemoryTimelineStore(),
        inspections: options.stores?.inspections ?? createInMemoryInspectionStore(),
        mediations: options.stores?.mediations ?? createInMemoryMediationStore(),
        proposals: options.stores?.proposals ?? createInMemoryProposalStore(),
        closureProofs: options.stores?.closureProofs ?? createInMemoryClosureProofStore(),
        escalations: options.stores?.escalations ?? createInMemoryEscalationStore(),
        retention: options.stores?.retention ?? createInMemoryRetentionStore(),
        financeLinks: options.stores?.financeLinks ?? createInMemoryFinanceLinkStore(),
        moveOutLinks: options.stores?.moveOutLinks ?? createInMemoryMoveOutLinkStore(),
        caseAudit: options.stores?.caseAudit ?? createInMemoryCaseAuditSink(),
        platformAudit: options.stores?.platformAudit ?? createInMemoryPlatformAuditSink(),
        notifications: createInMemoryNotificationPort(options.notificationChannel),
        evidenceVault: options.evidenceVault ?? createFailClosedEvidenceVault(options.evidenceVaultName),
        policies: resolveDisputePolicies(options.policyOverrides),
        numbering: { prefix: options.caseNumberPrefix ?? 'DISP' },
        communicationThreads: UNAVAILABLE_COMMUNICATION_THREADS,
    };
    const cases = createCaseService(ports);
    const inspections = createInspectionService(ports, cases);
    const mediation = createMediationService(ports, cases);
    const closure = createClosureService(ports, cases);
    const retention = createRetentionService(ports, cases);
    const links = createIntegrationLinkService(ports, cases);
    return { ports, cases, inspections, mediation, closure, retention, links, clock };
}

