import type { AdapterReadinessReport, DocumentVaultAdapter, FinanceAdapter, MoveOutAdapter, } from '../types/crossDomain.types';
import { UNWIRED_DOCUMENT_VAULT, UNWIRED_FINANCE, UNWIRED_MOVE_OUT, adapterServesCapability, } from '../types/crossDomain.types';
import { defaultFeatureFlags, type FeatureFlagKey } from '../../../../../core/featureFlags/featureFlags';
export type DisputeCapability = 'real-evidence' | 'evidence-verification' | 'evidence-retention' | 'financial-reference' | 'financial-consequence' | 'move-out-dispute-clearance';
export type CrossDomainAdapters = {
    readonly documentVault: DocumentVaultAdapter;
    readonly finance: FinanceAdapter;
    readonly moveOut: MoveOutAdapter;
};
const CAPABILITY_BINDINGS: Readonly<Record<DisputeCapability, {
    readonly flag: FeatureFlagKey;
    readonly domain: AdapterReadinessReport['domain'];
}>> = {
    'real-evidence': { flag: 'realEvidenceUpload', domain: 'DOCUMENT_VAULT' },
    'evidence-verification': { flag: 'realEvidenceUpload', domain: 'DOCUMENT_VAULT' },
    'evidence-retention': { flag: 'realEvidenceUpload', domain: 'DOCUMENT_VAULT' },
    'financial-reference': { flag: 'realPenaltyBilling', domain: 'FINANCE' },
    'financial-consequence': { flag: 'realPenaltyBilling', domain: 'FINANCE' },
    'move-out-dispute-clearance': { flag: 'disputeMediation', domain: 'MOVE_OUT' },
};
export const unwiredAdapters: CrossDomainAdapters = {
    documentVault: UNWIRED_DOCUMENT_VAULT,
    finance: UNWIRED_FINANCE,
    moveOut: UNWIRED_MOVE_OUT,
};
export function readinessReports(adapters: CrossDomainAdapters): readonly AdapterReadinessReport[] {
    return [adapters.documentVault.readiness(), adapters.finance.readiness(), adapters.moveOut.readiness()];
}
export type CapabilityDecision = {
    readonly capability: DisputeCapability;
    readonly enabled: boolean;
    readonly flagOn: boolean;
    readonly readiness: AdapterReadinessReport;
    readonly reason: string;
};
export function evaluateCapability(capability: DisputeCapability, adapters: CrossDomainAdapters = unwiredAdapters, flags: Readonly<Record<string, boolean>> = defaultFeatureFlags): CapabilityDecision {
    const binding = CAPABILITY_BINDINGS[capability];
    const flagOn = flags[binding.flag] === true;
    const report = binding.domain === 'DOCUMENT_VAULT'
        ? adapters.documentVault.readiness()
        : binding.domain === 'FINANCE'
            ? adapters.finance.readiness()
            : adapters.moveOut.readiness();
    if (!flagOn) {
        return {
            capability,
            enabled: false,
            flagOn,
            readiness: report,
            reason: `Flag '${binding.flag}' is off.`,
        };
    }
    const served = adapterServesCapability(report, capability);
    if (!served.enabled) {
        return {
            capability,
            enabled: false,
            flagOn,
            readiness: report,
            reason: served.reason,
        };
    }
    return { capability, enabled: true, flagOn, readiness: report, reason: served.reason };
}
export function enabledCapabilities(adapters: CrossDomainAdapters = unwiredAdapters, flags: Readonly<Record<string, boolean>> = defaultFeatureFlags): readonly DisputeCapability[] {
    return (Object.keys(CAPABILITY_BINDINGS) as DisputeCapability[]).filter((capability) => evaluateCapability(capability, adapters, flags).enabled);
}
export function blockedCapabilities(adapters: CrossDomainAdapters = unwiredAdapters, flags: Readonly<Record<string, boolean>> = defaultFeatureFlags): readonly CapabilityDecision[] {
    return (Object.keys(CAPABILITY_BINDINGS) as DisputeCapability[])
        .map((capability) => evaluateCapability(capability, adapters, flags))
        .filter((decision) => !decision.enabled);
}

