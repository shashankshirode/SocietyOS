import { canonicalPreimageSha256, optionalPart, requiredPart, requiredString, type CanonicalPart } from '../crypto/canonicalJson';
import { addMoney, inr, moneyEquals, subtractMoney, sumMoney, type Money } from '../types/money';
import type {
  SettlementEvaluation,
  SettlementEvaluationInput,
  SettlementLine,
  SettlementOutcome,
  SettlementReconciliationStatus,
  FinalSettlement,
} from '../types/settlement.types';

const POLICY_LINE_KINDS: ReadonlySet<SettlementLine['kind']> = new Set([
  'MAINTENANCE_DUES',
  'UTILITY_CHARGES',
  'PENALTY',
  'DAMAGE_RECOVERY',
  'LIFT_PADDING_CHARGE',
  'VENDOR_DUES',
  'OTHER_RECOVERY',
  'SECURITY_DEPOSIT_HELD',
  'PAYMENT_RECEIVED',
  'ADVANCE_CREDIT',
  'REFUND_DUE',
  'WRITE_OFF',
]);

export function outcomeFor(
  netBalance: Money,
  hasCountedLines: boolean,
): SettlementOutcome {
  if (!hasCountedLines) {
    return 'NOT_DUE';
  }
  if (netBalance.minorUnits === 0) {
    return 'NO_BALANCE';
  }
  if (netBalance.minorUnits > 0) {
    return 'PAYABLE_BY_RESIDENT';
  }
  return 'REFUND_DUE_TO_RESIDENT';
}

export function computeNetBalance(lines: readonly SettlementLine[], currency: string): Money {
  const counted = lines.filter(
    (line) => line.countedTowardsBalance && line.amount.currency === currency,
  );

  const debits = counted.filter((line) => line.origin === 'DEBIT').map((line) => line.amount);
  const credits = counted.filter((line) => line.origin === 'CREDIT').map((line) => line.amount);

  const grossDebit = sumMoney(debits, 'INR');
  const grossCredit = sumMoney(credits, 'INR');

  return subtractMoney(grossDebit, grossCredit);
}

export function lineProblems(line: SettlementLine, currency: string): readonly string[] {
  const problems: string[] = [];

  if (!POLICY_LINE_KINDS.has(line.kind)) {
    problems.push(`line.${line.lineId}.unsupportedKind`);
  }

  if (line.amount.currency !== currency) {
    problems.push(`line.${line.lineId}.currencyMismatch`);
  }

  if (line.amount.minorUnits === 0) {
    problems.push(`line.${line.lineId}.zeroAmount`);
  }

  if (line.origin === 'DEBIT' && line.amount.minorUnits < 0) {
    problems.push(`line.${line.lineId}.negativeDebit`);
  }

  if (line.origin === 'CREDIT' && line.amount.minorUnits > 0) {
    problems.push(`line.${line.lineId}.positiveCredit`);
  }

  if (line.disputeReference !== undefined && line.countedTowardsBalance) {
    problems.push(`line.${line.lineId}.disputedButCounted`);
  }

  if (line.sourceVersion.trim().length === 0) {
    problems.push(`line.${line.lineId}.missingSourceVersion`);
  }

  return problems;
}

export function settlementChecksum(settlement: FinalSettlement): string {
  const parts: readonly CanonicalPart[] = [
    requiredPart('moveOutRequestId', settlement.moveOutRequestId),
    requiredPart('moveOutRevision', settlement.moveOutRevision),
    requiredString('societyId', settlement.societyId),
    requiredString('unitId', settlement.unitId),
    requiredString('residentId', settlement.residentId),
    requiredString('asOfDate', settlement.asOfDate),
    requiredString('policyVersion', settlement.policyVersion),
    requiredPart('grossDebitMinor', settlement.grossDebit.minorUnits),
    requiredPart('grossCreditMinor', settlement.grossCredit.minorUnits),
    requiredPart('netBalanceMinor', settlement.netBalance.minorUnits),
    requiredString('outcome', settlement.outcome),
    requiredString('reconciliationStatus', settlement.reconciliationStatus),
    optionalPart('ledgerWatermark', settlement.ledgerWatermark),
    optionalPart('supersedesSettlementId', settlement.supersedesSettlementId),
    requiredPart(
      'lines',
      settlement.lines.map(
        (line) =>
          `${line.lineId}|${line.kind}|${line.origin}|${line.amount.minorUnits}|${line.sourceDomain}|${line.sourceReference}|${line.sourceVersion}|${String(line.countedTowardsBalance)}`,
      ),
    ),
  ];

  return canonicalPreimageSha256('sos.settlement.v1', parts);
}

function buildSettlement(
  input: SettlementEvaluationInput,
  outcome: SettlementOutcome,
): FinalSettlement {
  const counted = input.lines.filter(
    (line) => line.countedTowardsBalance && line.amount.currency === input.currency,
  );

  const grossDebit = sumMoney(
    counted.filter((line) => line.origin === 'DEBIT').map((line) => line.amount),
    'INR',
  );
  const grossCredit = sumMoney(
    counted.filter((line) => line.origin === 'CREDIT').map((line) => line.amount),
    'INR',
  );

  const base: FinalSettlement = {
    settlementId: `stl-${input.moveOutRequestId}-r${input.moveOutRevision}`,
    moveOutRequestId: input.moveOutRequestId,
    moveOutRevision: input.moveOutRevision,
    societyId: input.societyId,
    unitId: input.unitId,
    residentId: input.residentId,
    currency: input.currency,
    asOfDate: input.asOfDate,
    computedAt: input.computedAt,
    computedByActorId: input.computedByActorId,
    policyVersion: input.policyVersion,
    lines: input.lines,
    grossDebit,
    grossCredit,
    netBalance: subtractMoney(grossDebit, grossCredit),
    outcome,
    reconciliationStatus: input.reconciliationStatus,
    reconciliationReference: input.reconciliationReference,
    ledgerWatermark: input.ledgerWatermark,
    supersedesSettlementId: input.supersedesSettlementId,
    checksum: '',
  };

  return { ...base, checksum: settlementChecksum(base) };
}

export function evaluateSettlement(input: SettlementEvaluationInput): SettlementEvaluation {
  const blockingReasons: string[] = [];

  for (const line of input.lines) {
    for (const problem of lineProblems(line, input.currency)) {
      blockingReasons.push(problem);
    }
  }

  if (input.reconciliationStatus !== 'RECONCILED') {
    blockingReasons.push('settlement.ledgerNotReconciled');
  }

  if (input.reconciliationReference === undefined) {
    blockingReasons.push('settlement.missingReconciliationReference');
  }

  if (input.ledgerWatermark === undefined) {
    blockingReasons.push('settlement.missingLedgerWatermark');
  }

  const netBalance = computeNetBalance(input.lines, input.currency);
  const hasCountedLines = input.lines.some(
    (line) => line.countedTowardsBalance && line.amount.currency === input.currency,
  );
  const outcome = outcomeFor(netBalance, hasCountedLines);

  return {
    settlement: buildSettlement(input, outcome),
    isAuthoritative: blockingReasons.length === 0,
    blockingReasons,
  };
}

export function isSettledInFull(settlement: FinalSettlement): boolean {
  return (
    settlement.outcome === 'NO_BALANCE' ||
    (settlement.reconciliationStatus === 'RECONCILED' &&
      moneyEquals(settlement.netBalance, inr(0)))
  );
}

export function supersededBy(
  prior: FinalSettlement,
  next: FinalSettlement,
): boolean {
  return next.moveOutRequestId === prior.moveOutRequestId && next.moveOutRevision > prior.moveOutRevision;
}

export function reconcileStatusesAgree(
  settlement: FinalSettlement,
  status: SettlementReconciliationStatus,
): boolean {
  return settlement.reconciliationStatus === status;
}

export function totalPayable(
  settlements: readonly FinalSettlement[],
  currency: string,
): Money {
  return settlements.reduce<Money>((total, settlement) => {
    if (settlement.outcome !== 'PAYABLE_BY_RESIDENT' || settlement.currency !== currency) {
      return total;
    }
    return addMoney(total, settlement.netBalance);
  }, inr(0));
}
