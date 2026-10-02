import { evaluateCapability, enabledCapabilities, blockedCapabilities, readinessReports, unwiredAdapters, type CrossDomainAdapters, } from '../capabilityGate';
import { UNWIRED_DOCUMENT_VAULT, UNWIRED_FINANCE, UNWIRED_MOVE_OUT, adapterServesCapability, type AdapterReadiness, type DocumentVaultAdapter, type FinanceAdapter, type MoveOutAdapter, } from '../../types/crossDomain.types';
const ALL_FLAGS_ON: Record<string, boolean> = {
    realEvidenceUpload: true,
    realPenaltyBilling: true,
    disputeMediation: true,
    interFlatIssues: true,
};
const ALL_FLAGS_OFF: Record<string, boolean> = {
    realEvidenceUpload: false,
    realPenaltyBilling: false,
    disputeMediation: false,
    interFlatIssues: false,
};
function withReadiness(adapters: CrossDomainAdapters, readiness: Record<'documentVault' | 'finance' | 'moveOut', AdapterReadiness>): CrossDomainAdapters {
    const override = <T extends {
        readonly readiness: () => unknown;
    }>(adapter: T, level: AdapterReadiness): T => ({
        ...adapter,
        readiness: () => {
            const base = (adapter.readiness as () => {
                domain: 'DOCUMENT_VAULT' | 'FINANCE' | 'MOVE_OUT';
                adapterId: string;
                detail: string;
            })();
            return {
                adapterId: base.adapterId,
                domain: base.domain,
                readiness: level,
                detail: `test override: ${level}`,
                checkedAt: '2026-03-02T09:00:00.000Z',
                blockedCapabilities: level === 'LIVE' ? [] : ['real-evidence', 'financial-consequence'],
            };
        },
    });
    return {
        documentVault: override(adapters.documentVault, readiness.documentVault) as unknown as DocumentVaultAdapter,
        finance: override(adapters.finance, readiness.finance) as unknown as FinanceAdapter,
        moveOut: override(adapters.moveOut, readiness.moveOut) as unknown as MoveOutAdapter,
    };
}
const allMock: CrossDomainAdapters = withReadiness(unwiredAdapters, {
    documentVault: 'MOCK_ONLY',
    finance: 'MOCK_ONLY',
    moveOut: 'MOCK_ONLY',
});
const allLive: CrossDomainAdapters = withReadiness(unwiredAdapters, {
    documentVault: 'LIVE',
    finance: 'LIVE',
    moveOut: 'LIVE',
});
describe('cross-domain adapter readiness', () => {
    it('reports every unwired adapter as MOCK_ONLY', () => {
        for (const report of readinessReports(unwiredAdapters)) {
            expect(report.readiness).toBe('MOCK_ONLY');
            expect(report.blockedCapabilities.length).toBeGreaterThan(0);
        }
    });
    it('serves a capability only at LIVE', () => {
        const base = {
            adapterId: 'a',
            domain: 'DOCUMENT_VAULT' as const,
            detail: '',
            checkedAt: '2026-03-02T09:00:00.000Z',
            blockedCapabilities: [] as readonly string[],
        };
        expect(adapterServesCapability({ ...base, readiness: 'LIVE' }, 'real-evidence').enabled).toBe(true);
        expect(adapterServesCapability({ ...base, readiness: 'DEGRADED' }, 'real-evidence').enabled).toBe(false);
        expect(adapterServesCapability({ ...base, readiness: 'MOCK_ONLY' }, 'real-evidence').enabled).toBe(false);
        expect(adapterServesCapability({ ...base, readiness: 'ABSENT' }, 'real-evidence').enabled).toBe(false);
    });
    it('explains why a non-live adapter is holding a capability back', () => {
        const decision = adapterServesCapability({
            adapterId: 'finance.unwired',
            domain: 'FINANCE',
            readiness: 'MOCK_ONLY',
            detail: 'no live adapter',
            checkedAt: '2026-03-02T09:00:00.000Z',
            blockedCapabilities: [],
        }, 'financial-consequence');
        expect(decision.enabled).toBe(false);
        expect(decision.reason).toContain('MOCK_ONLY');
        expect(decision.reason).toContain('financial-consequence');
    });
});
describe('capability gating against feature flags', () => {
    it('enables nothing while every adapter is MOCK_ONLY, even with all flags on', () => {
        expect(enabledCapabilities(allMock, ALL_FLAGS_ON)).toEqual([]);
        expect(blockedCapabilities(allMock, ALL_FLAGS_ON).length).toBe(6);
    });
    it('refuses real evidence while the vault is MOCK_ONLY', () => {
        for (const capability of ['real-evidence', 'evidence-verification', 'evidence-retention'] as const) {
            const decision = evaluateCapability(capability, allMock, ALL_FLAGS_ON);
            expect(decision.enabled).toBe(false);
            expect(decision.readiness.domain).toBe('DOCUMENT_VAULT');
            expect(decision.reason).toContain('MOCK_ONLY');
        }
    });
    it('refuses financial consequence while finance is MOCK_ONLY', () => {
        for (const capability of ['financial-reference', 'financial-consequence'] as const) {
            expect(evaluateCapability(capability, allMock, ALL_FLAGS_ON).enabled).toBe(false);
        }
    });
    it('refuses move-out dispute clearance while move-out is MOCK_ONLY', () => {
        const decision = evaluateCapability('move-out-dispute-clearance', allMock, ALL_FLAGS_ON);
        expect(decision.enabled).toBe(false);
        expect(decision.readiness.domain).toBe('MOVE_OUT');
    });
    it('enables a capability only when both the flag is on and the adapter is LIVE', () => {
        expect(evaluateCapability('real-evidence', allLive, ALL_FLAGS_ON).enabled).toBe(true);
        expect(evaluateCapability('real-evidence', allLive, ALL_FLAGS_OFF).enabled).toBe(false);
    });
    it('holds back a capability when the flag is on but one adapter is degraded', () => {
        const degraded = withReadiness(unwiredAdapters, {
            documentVault: 'DEGRADED',
            finance: 'LIVE',
            moveOut: 'LIVE',
        });
        expect(evaluateCapability('real-evidence', degraded, ALL_FLAGS_ON).enabled).toBe(false);
        expect(evaluateCapability('financial-reference', degraded, ALL_FLAGS_ON).enabled).toBe(true);
    });
    it('reports the flag state separately from the adapter state', () => {
        const decision = evaluateCapability('real-evidence', allMock, ALL_FLAGS_OFF);
        expect(decision.flagOn).toBe(false);
        expect(decision.reason).toContain('realEvidenceUpload');
    });
});
describe('unwired adapters fail closed', () => {
    it('refuses every vault operation', () => {
        const upload = UNWIRED_DOCUMENT_VAULT.upload({
            societyId: 's1',
            caseId: 'c1',
            uploadedByUserId: 'u1',
            kind: 'PHOTO',
            fileName: 'evidence.png',
            byteLength: 1024,
            contentType: 'image/png',
            contentDigest: 'abc',
        });
        expect(upload.accepted).toBe(false);
        expect(upload.documentId).toBeUndefined();
        expect(UNWIRED_DOCUMENT_VAULT.retrieve({ societyId: 's1', documentId: 'd1', versionId: undefined, requestedByUserId: 'u1' }).available).toBe(false);
        const verification = UNWIRED_DOCUMENT_VAULT.verify({
            societyId: 's1',
            caseId: 'c1',
            requestingUserId: 'u1',
            documentId: 'd1',
            versionId: 'v1',
        });
        expect(verification.available).toBe(false);
        expect(verification.documentVerified).toBe(false);
        expect(verification.checksumPresent).toBe(false);
        expect(UNWIRED_DOCUMENT_VAULT.applyRetention({ societyId: 's1', documentId: 'd1', retainUntil: '2027-01-01', legalHold: true }).applied).toBe(false);
    });
    it('never produces a finance amount, even when a reference is raised', () => {
        const reference = UNWIRED_FINANCE.raiseReference({
            societyId: 's1',
            caseId: 'c1',
            kind: 'APPROVED_PENALTY',
            reason: 'Damage recorded in an inspection.',
            raisedByUserId: 'u1',
            relatedPartyUnitId: 'unit-2',
        });
        expect(reference.amountMinor).toBeUndefined();
        expect(reference.status).toBe('REQUESTED');
        expect(reference.approvedByUserId).toBeUndefined();
        expect(UNWIRED_FINANCE.readReference('s1', 'any')).toBeUndefined();
        expect(UNWIRED_FINANCE.listForCase('s1', 'c1')).toEqual([]);
        expect(UNWIRED_FINANCE.reverse({ societyId: 's1', referenceId: 'r1', reason: 'x', requestedByUserId: 'u1' })).toBeUndefined();
    });
    it('never returns a move-out clearance verdict', () => {
        expect(UNWIRED_MOVE_OUT.readClearance('s1', 'c1')).toBeUndefined();
        expect(UNWIRED_MOVE_OUT.refreshProjection('s1', 'c1')).toBeUndefined();
    });
});

