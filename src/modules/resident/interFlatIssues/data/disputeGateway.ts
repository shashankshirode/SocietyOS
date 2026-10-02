import type { CaseView, ActorContextInput, DisputeCommand } from '../application/caseService';
import type { CaseCommandOutcome } from '../application/caseService';
import { createDisputeRuntime, type DisputeRuntime } from '../infrastructure/disputeRuntime';
import type { DisputeCase, DisputeCaseStatus } from '../domain/types/case.types';
type CaseService = DisputeRuntime['cases'];
type MediationService = DisputeRuntime['mediation'];
type InspectionService = DisputeRuntime['inspections'];
type ClosureService = DisputeRuntime['closure'];
type Args<F> = F extends (...args: infer A) => unknown ? A : never;
type Result<F> = F extends (...args: never) => infer R ? R : never;
type DomainMethod<T> = T[keyof T];
let runtime: DisputeRuntime | undefined;
export function disputeGateway(): DisputeRuntime {
    runtime ??= createDisputeRuntime();
    return runtime;
}
export function resetDisputeGateway(): void {
    runtime = undefined;
}
export function listCasesForActor(actor: ActorContextInput): ReturnType<CaseService['listCasesForActor']> {
    return disputeGateway().cases.listCasesForActor(actor);
}
export function viewCase(actor: ActorContextInput, caseId: string): Result<CaseService['viewCase']> {
    return disputeGateway().cases.viewCase(actor, caseId);
}
export function openCase(...args: Args<CaseService['openCase']>): Result<CaseService['openCase']> {
    return disputeGateway().cases.openCase(...args);
}
export function recordClaim(...args: Args<CaseService['recordClaim']>): Result<CaseService['recordClaim']> {
    return disputeGateway().cases.recordClaim(...args);
}
export function recordResponse(...args: Args<CaseService['recordResponse']>): Result<CaseService['recordResponse']> {
    return disputeGateway().cases.recordResponse(...args);
}
export function attachEvidence(...args: Args<CaseService['attachEvidence']>): Result<CaseService['attachEvidence']> {
    return disputeGateway().cases.attachEvidence(...args);
}
export function requestMediation(...args: Args<MediationService['requestMediation']>): Result<MediationService['requestMediation']> {
    return disputeGateway().mediation.requestMediation(...args);
}
export function assignMediator(...args: Args<MediationService['assignMediator']>): Result<MediationService['assignMediator']> {
    return disputeGateway().mediation.assignMediator(...args);
}
export function proposeResolution(...args: Args<MediationService['proposeResolution']>): Result<MediationService['proposeResolution']> {
    return disputeGateway().mediation.proposeResolution(...args);
}
export function decideProposal(...args: Args<MediationService['decideProposal']>): Result<MediationService['decideProposal']> {
    return disputeGateway().mediation.decideProposal(...args);
}
export function submitClosureProof(...args: Args<MediationService['submitClosureProof']>): Result<MediationService['submitClosureProof']> {
    return disputeGateway().mediation.submitClosureProof(...args);
}
export function verifyClosureProof(...args: Args<MediationService['verifyClosureProof']>): Result<MediationService['verifyClosureProof']> {
    return disputeGateway().mediation.verifyClosureProof(...args);
}
export function requestInspection(...args: Args<InspectionService['requestInspection']>): Result<InspectionService['requestInspection']> {
    return disputeGateway().inspections.requestInspection(...args);
}
export function resolveCase(...args: Args<ClosureService['resolveCase']>): Result<ClosureService['resolveCase']> {
    return disputeGateway().closure.resolveCase(...args);
}
export function closeCase(...args: Args<ClosureService['closeCase']>): Result<ClosureService['closeCase']> {
    return disputeGateway().closure.closeCase(...args);
}
export function escalateCase(...args: Args<ClosureService['escalateCase']>): Result<ClosureService['escalateCase']> {
    return disputeGateway().closure.escalateCase(...args);
}
export function caseStatusCounts(actor: ActorContextInput): Readonly<Partial<Record<DisputeCaseStatus, number>>> {
    const counts: Partial<Record<DisputeCaseStatus, number>> = {};
    for (const disputeCase of listCasesForActor(actor)) {
        counts[disputeCase.status] = (counts[disputeCase.status] ?? 0) + 1;
    }
    return counts;
}
export type { CaseCommandOutcome, CaseView, DisputeCase };
export type { DomainMethod };

