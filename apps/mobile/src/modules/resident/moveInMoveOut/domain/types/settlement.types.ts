import type { Absent } from '../../../../../shared/types/absence.types';
import type { Money } from './money';

export type SettlementLineKind =
  | 'MAINTENANCE_DUES'
  | 'UTILITY_CHARGES'
  | 'PENALTY'
  | 'DAMAGE_RECOVERY'
  | 'LIFT_PADDING_CHARGE'
  | 'VENDOR_DUES'
  | 'OTHER_RECOVERY'
  | 'SECURITY_DEPOSIT_HELD'
  | 'PAYMENT_RECEIVED'
  | 'ADVANCE_CREDIT'
  | 'REFUND_DUE'
  | 'WRITE_OFF';

export type SettlementLineOrigin = 'DEBIT' | 'CREDIT';

export type SettlementSourceDomain =
  | 'ACCOUNTING_LEDGER'
  | 'BILLING'
  | 'PAYMENTS'
  | 'REFUNDS'
  | 'ADJUSTMENTS'
  | 'FACILITY_DAMAGE'
  | 'SECURITY_DEPOSIT'
  | 'TREASURY';

export type SettlementLine = {
  readonly lineId: string;
  readonly kind: SettlementLineKind;
  readonly origin: SettlementLineOrigin;
  readonly amount: Money;
  readonly descriptionKey: string;
  readonly sourceDomain: SettlementSourceDomain;
  readonly sourceReference: string;
  readonly sourceVersion: string;
  readonly asOfDate: string;
  readonly countedTowardsBalance: boolean;
  readonly disputeReference: string | Absent;
};

export type SettlementOutcome = 'NOT_DUE' | 'PAYABLE_BY_RESIDENT' | 'REFUND_DUE_TO_RESIDENT' | 'NO_BALANCE';

export type SettlementReconciliationStatus = 'RECONCILED' | 'UNRECONCILED' | 'SOURCE_UNAVAILABLE';

export type FinalSettlement = {
  readonly settlementId: string;
  readonly moveOutRequestId: string;
  readonly moveOutRevision: number;
  readonly societyId: string;
  readonly unitId: string;
  readonly residentId: string;
  readonly currency: string;
  readonly asOfDate: string;
  readonly computedAt: string;
  readonly computedByActorId: string;
  readonly policyVersion: string;
  readonly lines: readonly SettlementLine[];
  readonly grossDebit: Money;
  readonly grossCredit: Money;
  readonly netBalance: Money;
  readonly outcome: SettlementOutcome;
  readonly reconciliationStatus: SettlementReconciliationStatus;
  readonly reconciliationReference: string | Absent;
  readonly ledgerWatermark: string | Absent;
  readonly supersedesSettlementId: string | Absent;
  readonly checksum: string;
};

export type SettlementEvaluationInput = {
  readonly moveOutRequestId: string;
  readonly moveOutRevision: number;
  readonly societyId: string;
  readonly unitId: string;
  readonly residentId: string;
  readonly currency: string;
  readonly asOfDate: string;
  readonly computedAt: string;
  readonly computedByActorId: string;
  readonly policyVersion: string;
  readonly lines: readonly SettlementLine[];
  readonly reconciliationStatus: SettlementReconciliationStatus;
  readonly reconciliationReference: string | Absent;
  readonly ledgerWatermark: string | Absent;
  readonly supersedesSettlementId: string | Absent;
};

export type SettlementEvaluation = {
  readonly settlement: FinalSettlement;
  readonly isAuthoritative: boolean;
  readonly blockingReasons: readonly string[];
};

export type SettlementStage =
  | 'REQUESTED'
  | 'CALCULATING'
  | 'REVIEW'
  | 'SETTLEMENT_PENDING'
  | 'CLEARED'
  | 'EXCEPTION';

export const SETTLEMENT_STAGE_PATH: readonly SettlementStage[] = [
  'REQUESTED',
  'CALCULATING',
  'REVIEW',
  'SETTLEMENT_PENDING',
  'CLEARED',
];

export const SETTLEMENT_TERMINAL_STAGES: readonly SettlementStage[] = ['CLEARED'];
