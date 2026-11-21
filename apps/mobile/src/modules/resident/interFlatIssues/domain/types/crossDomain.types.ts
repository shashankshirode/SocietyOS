import type { Absent } from '../../../../../shared/types/absence.types';
import type { EvidenceVaultVerification } from './evidence.types';
export type AdapterReadiness = 'LIVE' | 'DEGRADED' | 'MOCK_ONLY' | 'ABSENT';
export type AdapterReadinessReport = {
    readonly adapterId: string;
    readonly domain: 'DOCUMENT_VAULT' | 'FINANCE' | 'MOVE_OUT';
    readonly readiness: AdapterReadiness;
    readonly detail: string;
    readonly checkedAt: string;
    readonly blockedCapabilities: readonly string[];
};
export function adapterServesCapability(report: AdapterReadinessReport, capability: string): {
    readonly enabled: boolean;
    readonly reason: string;
} {
    if (report.readiness === 'LIVE') {
        return { enabled: true, reason: `${report.adapterId} is live.` };
    }
    if (report.readiness === 'DEGRADED') {
        return {
            enabled: false,
            reason: `${report.adapterId} is degraded; capability '${capability}' is held back until it recovers.`,
        };
    }
    return {
        enabled: false,
        reason: `${report.adapterId} is ${report.readiness} (${report.detail}). Capability '${capability}' must not be enabled.`,
    };
}
export type VaultUploadRequest = {
    readonly societyId: string;
    readonly caseId: string;
    readonly uploadedByUserId: string;
    readonly kind: 'PHOTO' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'LOG_EXTRACT' | 'TESTIMONY';
    readonly fileName: string;
    readonly byteLength: number;
    readonly contentType: string;
    readonly contentDigest: string;
};
export type VaultUploadResult = {
    readonly accepted: boolean;
    readonly documentId: string | Absent;
    readonly versionId: string | Absent;
    readonly serverDigest: string | Absent;
    readonly checksumAlgorithm: string | Absent;
    readonly storageClass: 'ENCRYPTED_AT_REST' | 'UNENCRYPTED' | Absent;
    readonly detail: string;
};
export type VaultRetrievalRequest = {
    readonly societyId: string;
    readonly documentId: string;
    readonly versionId: string | Absent;
    readonly requestedByUserId: string;
};
export type VaultRetrievalResult = {
    readonly available: boolean;
    readonly downloadUrl: string | Absent;
    readonly expiresAt: string | Absent;
    readonly serverDigest: string | Absent;
    readonly detail: string;
};
export type VaultRetentionRequest = {
    readonly societyId: string;
    readonly documentId: string;
    readonly retainUntil: string;
    readonly legalHold: boolean;
};
export type VaultRetentionResult = {
    readonly applied: boolean;
    readonly holdId: string | Absent;
    readonly retainUntil: string | Absent;
    readonly detail: string;
};
export type DocumentVaultAdapter = {
    readonly adapterId: string;
    readonly readiness: () => AdapterReadinessReport;
    readonly upload: (request: VaultUploadRequest) => VaultUploadResult;
    readonly retrieve: (request: VaultRetrievalRequest) => VaultRetrievalResult;
    readonly verify: (input: {
        readonly societyId: string;
        readonly caseId: string;
        readonly requestingUserId: string;
        readonly documentId: string;
        readonly versionId: string;
    }) => EvidenceVaultVerification;
    readonly applyRetention: (request: VaultRetentionRequest) => VaultRetentionResult;
};
export type FinanceReferenceKind = 'APPROVED_DAMAGE_OBLIGATION' | 'APPROVED_PENALTY' | 'REVERSAL' | 'CREDIT_NOTE' | 'WRITE_OFF';
export type FinanceReferenceRequest = {
    readonly societyId: string;
    readonly caseId: string;
    readonly kind: FinanceReferenceKind;
    readonly reason: string;
    readonly raisedByUserId: string;
    readonly relatedPartyUnitId: string | Absent;
};
export type FinanceReference = {
    readonly referenceId: string;
    readonly societyId: string;
    readonly caseId: string;
    readonly kind: FinanceReferenceKind;
    readonly status: 'REQUESTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'REVERSED';
    readonly amountMinor: number | Absent;
    readonly currency: string | Absent;
    readonly approvedByUserId: string | Absent;
    readonly approvedAt: string | Absent;
    readonly reversalOfReferenceId: string | Absent;
    readonly detail: string;
};
export type FinanceAdapter = {
    readonly adapterId: string;
    readonly readiness: () => AdapterReadinessReport;
    readonly raiseReference: (request: FinanceReferenceRequest) => FinanceReference;
    readonly readReference: (societyId: string, referenceId: string) => FinanceReference | Absent;
    readonly listForCase: (societyId: string, caseId: string) => readonly FinanceReference[];
    readonly reverse: (input: {
        readonly societyId: string;
        readonly referenceId: string;
        readonly reason: string;
        readonly requestedByUserId: string;
    }) => FinanceReference | Absent;
};
export type MoveOutClearanceProjection = {
    readonly societyId: string;
    readonly caseId: string;
    readonly unitId: string;
    readonly clearanceStatus: 'CLEARED' | 'BLOCKED' | 'UNDER_REVIEW' | 'NOT_APPLICABLE';
    readonly blockingReferenceIds: readonly string[];
    readonly decidedByUserId: string | Absent;
    readonly decidedAt: string | Absent;
    readonly detail: string;
};
export type MoveOutAdapter = {
    readonly adapterId: string;
    readonly readiness: () => AdapterReadinessReport;
    readonly readClearance: (societyId: string, caseId: string) => MoveOutClearanceProjection | Absent;
    readonly refreshProjection: (societyId: string, caseId: string) => MoveOutClearanceProjection | Absent;
};
const READINESS_DETAIL = 'No live adapter is configured for this domain in this build.';
function blockedReport(adapterId: string, domain: AdapterReadinessReport['domain'], capabilities: readonly string[]): AdapterReadinessReport {
    return {
        adapterId,
        domain,
        readiness: 'MOCK_ONLY',
        detail: READINESS_DETAIL,
        checkedAt: new Date(0).toISOString(),
        blockedCapabilities: capabilities,
    };
}
export const UNWIRED_DOCUMENT_VAULT: DocumentVaultAdapter = {
    adapterId: 'document-vault.unwired',
    readiness: () => blockedReport('document-vault.unwired', 'DOCUMENT_VAULT', [
        'real-evidence',
        'evidence-verification',
        'evidence-retention',
    ]),
    upload: () => ({
        accepted: false,
        documentId: undefined,
        versionId: undefined,
        serverDigest: undefined,
        checksumAlgorithm: undefined,
        storageClass: undefined,
        detail: READINESS_DETAIL,
    }),
    retrieve: () => ({ available: false, downloadUrl: undefined, expiresAt: undefined, serverDigest: undefined, detail: READINESS_DETAIL }),
    verify: () => ({
        available: false,
        documentVerified: false,
        checksumPresent: false,
        subjectAllowed: false,
        detail: READINESS_DETAIL,
    }),
    applyRetention: () => ({ applied: false, holdId: undefined, retainUntil: undefined, detail: READINESS_DETAIL }),
};
export const UNWIRED_FINANCE: FinanceAdapter = {
    adapterId: 'finance.unwired',
    readiness: () => blockedReport('finance.unwired', 'FINANCE', ['financial-reference', 'financial-consequence']),
    raiseReference: (request) => ({
        referenceId: '',
        societyId: request.societyId,
        caseId: request.caseId,
        kind: request.kind,
        status: 'REQUESTED',
        amountMinor: undefined,
        currency: undefined,
        approvedByUserId: undefined,
        approvedAt: undefined,
        reversalOfReferenceId: undefined,
        detail: READINESS_DETAIL,
    }),
    readReference: () => undefined,
    listForCase: () => [],
    reverse: () => undefined,
};
export const UNWIRED_MOVE_OUT: MoveOutAdapter = {
    adapterId: 'move-out.unwired',
    readiness: () => blockedReport('move-out.unwired', 'MOVE_OUT', ['move-out-dispute-clearance']),
    readClearance: () => undefined,
    refreshProjection: () => undefined,
};

