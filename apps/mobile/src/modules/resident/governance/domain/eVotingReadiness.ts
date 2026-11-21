import type { GovernancePolicy } from './policy.types';
export type EVotingBackendState = 'LIVE' | 'MOCK_ONLY' | 'UNAVAILABLE';
export type EVotingControls = {
    readonly secretBallot: boolean;
    readonly verifiedIdentity: boolean;
    readonly integrityAttestation: boolean;
    readonly auditTrail: boolean;
    readonly backend: EVotingBackendState;
};
export type EVotingBlockingReason = 'POLICY_NOT_CONFIGURED' | 'POLICY_DISABLED' | 'BALLOT_NOT_SECRET' | 'IDENTITY_NOT_VERIFIED' | 'INTEGRITY_NOT_ATTESTED' | 'AUDIT_TRAIL_MISSING' | 'BACKEND_NOT_LIVE';
export type EVotingReadiness = {
    readonly status: 'AVAILABLE';
} | {
    readonly status: 'NOT_READY';
    readonly reasons: readonly EVotingBlockingReason[];
};
export function evaluateEVotingReadiness(input: {
    readonly activation: GovernancePolicy['eVoting'] | undefined;
    readonly controls: EVotingControls;
}): EVotingReadiness {
    const reasons: EVotingBlockingReason[] = [];
    if (input.activation === undefined) {
        reasons.push('POLICY_NOT_CONFIGURED');
    }
    else if (input.activation.state === 'NOT_CONFIGURED') {
        reasons.push('POLICY_NOT_CONFIGURED');
    }
    else if (input.activation.state === 'DISABLED') {
        reasons.push('POLICY_DISABLED');
    }
    if (!input.controls.secretBallot) {
        reasons.push('BALLOT_NOT_SECRET');
    }
    if (!input.controls.verifiedIdentity) {
        reasons.push('IDENTITY_NOT_VERIFIED');
    }
    if (!input.controls.integrityAttestation) {
        reasons.push('INTEGRITY_NOT_ATTESTED');
    }
    if (!input.controls.auditTrail) {
        reasons.push('AUDIT_TRAIL_MISSING');
    }
    if (input.controls.backend !== 'LIVE') {
        reasons.push('BACKEND_NOT_LIVE');
    }
    return reasons.length === 0
        ? { status: 'AVAILABLE' }
        : { status: 'NOT_READY', reasons };
}

