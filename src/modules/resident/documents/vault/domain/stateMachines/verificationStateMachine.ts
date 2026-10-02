import type { Absent } from '../../../../../../shared/types/absence.types';
import type {
  DocumentVaultErrorCode,
  DocumentVaultViolation,
  TransitionResult,
  VaultClock,
} from '../types/primitives';
import { violation } from '../types/primitives';
import type {
  SignatureEnvelope,
  SignatureEnvelopeState,
  SignatureMethod,
  SignatureProviderState,
  SignatureSigner,
  VerificationCase,
  VerificationCaseState,
  VerificationChecklist,
  VerificationDecision,
  VerificationDecisionRecord,
} from '../types/verification.types';

const VERIFICATION_TRANSITIONS: Readonly<
  Record<VerificationCaseState, readonly VerificationCaseState[]>
> = {
  OPEN: ['IN_REVIEW', 'APPROVED', 'REJECTED', 'RESUBMISSION_REQUIRED', 'EXPIRED', 'REVOKED', 'CLOSED'],
  IN_REVIEW: ['APPROVED', 'REJECTED', 'RESUBMISSION_REQUIRED', 'EXPIRED', 'REVOKED'],
  APPROVED: ['CLOSED', 'REVOKED', 'EXPIRED'],
  REJECTED: ['CLOSED'],
  RESUBMISSION_REQUIRED: ['CLOSED', 'EXPIRED'],
  EXPIRED: ['CLOSED'],
  REVOKED: ['CLOSED'],
  CLOSED: [],
};

const SIGNATURE_TRANSITIONS: Readonly<
  Record<SignatureEnvelopeState, readonly SignatureEnvelopeState[]>
> = {
  PENDING: ['PARTIALLY_SIGNED', 'SIGNED', 'FAILED', 'REVOKED'],
  PARTIALLY_SIGNED: ['SIGNED', 'FAILED', 'REVOKED'],
  SIGNED: ['REVOKED'],
  FAILED: ['PENDING', 'REVOKED'],
  REVOKED: [],
};

const DECISION_TO_STATE: Readonly<
  Record<VerificationDecision, VerificationCaseState>
> = {
  APPROVE: 'APPROVED',
  REJECT: 'REJECTED',
  REQUEST_RESUBMISSION: 'RESUBMISSION_REQUIRED',
  RESUBMIT: 'IN_REVIEW',
  EXPIRE: 'EXPIRED',
  REVOKE: 'REVOKED',
};

export function canTransitionVerification(
  from: VerificationCaseState,
  to: VerificationCaseState,
): TransitionResult<VerificationCaseState> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  if (!VERIFICATION_TRANSITIONS[from].includes(to)) {
    return {
      allowed: false,
      from,
      attempted: to,
      violation: violation(
        'ILLEGAL_TRANSITION',
        `verificationCase.state.${to}`,
        `Verification case cannot move from ${from} to ${to}.`,
      ),
    };
  }
  return { allowed: true, from, to, warnings: [] };
}

export function canTransitionSignature(
  from: SignatureEnvelopeState,
  to: SignatureEnvelopeState,
): TransitionResult<SignatureEnvelopeState> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  if (!SIGNATURE_TRANSITIONS[from].includes(to)) {
    return {
      allowed: false,
      from,
      attempted: to,
      violation: violation(
        'ILLEGAL_TRANSITION',
        `signatureEnvelope.state.${to}`,
        `Signature envelope cannot move from ${from} to ${to}.`,
      ),
    };
  }
  return { allowed: true, from, to, warnings: [] };
}

export function isReviewable(state: VerificationCaseState): boolean {
  return state === 'OPEN' || state === 'IN_REVIEW' || state === 'RESUBMISSION_REQUIRED';
}

export function missingRequiredItems(
  checklist: VerificationChecklist,
): readonly string[] {
  return checklist.items
    .filter((item) => item.required && item.state === 'PENDING')
    .map((item) => item.id);
}

export function isChecklistComplete(checklist: VerificationChecklist): boolean {
  return missingRequiredItems(checklist).length === 0;
}

export function hasFailedRequiredItem(checklist: VerificationChecklist): boolean {
  return checklist.items.some((item) => item.required && item.state === 'FAILED');
}

export function decisionTargetState(
  decision: VerificationDecision,
): VerificationCaseState {
  return DECISION_TO_STATE[decision];
}

export function requiresReason(decision: VerificationDecision): boolean {
  return decision === 'REJECT' || decision === 'REQUEST_RESUBMISSION' || decision === 'REVOKE';
}

export function approvalBlocked(
  checklist: VerificationChecklist,
  decision: VerificationDecision,
): DocumentVaultViolation | Absent {
  if (decision !== 'APPROVE') {
    return undefined;
  }
  const missing = missingRequiredItems(checklist);
  if (missing.length > 0) {
    return violation(
      'VERIFICATION_CHECKLIST_INCOMPLETE',
      'verificationCase.checklist',
      `Required checklist items are incomplete: ${missing.join(', ')}.`,
    );
  }
  if (hasFailedRequiredItem(checklist)) {
    return violation(
      'VERIFICATION_CHECKLIST_INCOMPLETE',
      'verificationCase.checklist',
      'A required checklist item is marked failed.',
    );
  }
  return undefined;
}

export function isResubmissionExpired(
  verificationCase: VerificationCase,
  clock: VaultClock,
): boolean {
  const window = verificationCase.resubmission;
  if (window === undefined) {
    return false;
  }
  return Date.parse(window.deadline) <= clock.now().getTime();
}

export function isResubmissionExhausted(verificationCase: VerificationCase): boolean {
  return verificationCase.resubmission?.exhausted === true;
}

export function isCaseClosed(state: VerificationCaseState): boolean {
  return state === 'CLOSED';
}

export function isSignatureProviderBlocking(provider: SignatureProviderState): boolean {
  return provider === 'UNAVAILABLE' || provider === 'FAILED';
}

export function isSignatureSatisfied(envelope: SignatureEnvelope): boolean {
  return envelope.state === 'SIGNED' && envelope.signers.length > 0;
}

export function canSealSignature(
  envelope: SignatureEnvelope,
  expectedSigners: number,
): DocumentVaultViolation | Absent {
  if (isSignatureProviderBlocking(envelope.provider)) {
    return violation(
      'SIGNATURE_PROVIDER_UNAVAILABLE',
      'signatureEnvelope.provider',
      'Signature provider is unavailable; the envelope cannot be sealed.',
    );
  }
  if (envelope.signers.length < expectedSigners) {
    return violation(
      'SIGNATURE_NOT_VERIFIED',
      'signatureEnvelope.signers',
      `Expected ${expectedSigners} signature(s) but recorded ${envelope.signers.length}.`,
    );
  }
  return undefined;
}

export function hasSigner(
  envelope: SignatureEnvelope,
  signerId: string,
): boolean {
  return envelope.signers.some((signer) => signer.signerId === signerId);
}

export function nextSignatureState(
  current: SignatureEnvelopeState,
  signerCount: number,
  expectedSigners: number,
): SignatureEnvelopeState {
  if (signerCount >= expectedSigners) {
    return 'SIGNED';
  }
  return current === 'PENDING' ? 'PARTIALLY_SIGNED' : current;
}

export function appendDecision(
  verificationCase: VerificationCase,
  decision: VerificationDecision,
  decidedBy: string,
  decidedAt: string,
  reason: string | Absent,
  checklist: VerificationChecklist,
): readonly VerificationDecisionRecord[] {
  const record: VerificationDecisionRecord = {
    decision,
    decidedBy,
    decidedAt,
    reason,
    checklistSnapshot: checklist,
    reviewedVersionId: verificationCase.versionId,
    reviewedVersionNumber: verificationCase.versionNumber,
  };
  return [...verificationCase.decisions, record];
}

export function applyChecklistCompletion(
  checklist: VerificationChecklist,
  itemIds: readonly string[],
  actorId: string,
  at: string,
): VerificationChecklist {
  return {
    templateId: checklist.templateId,
    templateVersion: checklist.templateVersion,
    items: checklist.items.map((item) => {
      if (!itemIds.includes(item.id) || item.state === 'COMPLETED') {
        return item;
      }
      return { ...item, state: 'COMPLETED', completedBy: actorId, completedAt: at };
    }),
  };
}

export function applyChecklistFailure(
  checklist: VerificationChecklist,
  itemId: string,
  actorId: string,
  at: string,
  note: string,
): VerificationChecklist {
  return {
    templateId: checklist.templateId,
    templateVersion: checklist.templateVersion,
    items: checklist.items.map((item) =>
      item.id === itemId
        ? { ...item, state: 'FAILED', completedBy: actorId, completedAt: at, note }
        : item,
    ),
  };
}

export function buildSigner(
  signerId: string,
  signerRole: string,
  method: SignatureMethod,
  payloadDigest: string,
  digestAlgorithm: 'SHA-256' | 'SHA-512',
  at: string,
  providerReference: string | Absent,
  certificateThumbprint: string | Absent,
): SignatureSigner {
  return {
    signerId,
    signerRole,
    signedAt: at,
    method,
    providerReference,
    certificateThumbprint,
    signedPayloadDigest: payloadDigest,
    algorithm: digestAlgorithm,
    attestedAt: undefined,
  };
}

export function signatureErrorCode(
  decision: VerificationDecision,
): DocumentVaultErrorCode {
  return decision === 'APPROVE' ? 'VERIFICATION_CHECKLIST_INCOMPLETE' : 'VERIFICATION_REASON_REQUIRED';
}
