import {
  computeNetBalance,
  evaluateSettlement,
  isSettledInFull,
  outcomeFor,
  settlementChecksum,
  supersededBy,
  totalPayable,
} from '../settlementEngine';
import type { SettlementEvaluationInput, SettlementLine } from '../../types/settlement.types';
import { inr } from '../../types/money';

function line(overrides: Partial<SettlementLine> = {}): SettlementLine {
  return {
    lineId: 'line-1',
    kind: 'MAINTENANCE_DUES',
    origin: 'DEBIT',
    amount: inr(25000),
    descriptionKey: 'desc.maintenance',
    sourceDomain: 'ACCOUNTING_LEDGER',
    sourceReference: 'ledger-1',
    sourceVersion: 'v1',
    asOfDate: '2026-10-01',
    countedTowardsBalance: true,
    disputeReference: undefined,
    ...overrides,
  };
}

function input(overrides: Partial<SettlementEvaluationInput> = {}): SettlementEvaluationInput {
  return {
    moveOutRequestId: 'mov-1',
    moveOutRevision: 4,
    societyId: 'soc-1',
    unitId: 'unit-9',
    residentId: 'res-1',
    currency: 'INR',
    asOfDate: '2026-10-01',
    computedAt: '2026-10-01T00:00:00.000Z',
    computedByActorId: 'actor-treasurer',
    policyVersion: 'settlement.policy.v1',
    lines: [line()],
    reconciliationStatus: 'RECONCILED',
    reconciliationReference: 'recon-1',
    ledgerWatermark: 'wm-99',
    supersedesSettlementId: undefined,
    ...overrides,
  };
}

describe('settlementEngine', () => {
  it('marks a reconciled ledger authoritative and payable by the resident', () => {
    const evaluation = evaluateSettlement(input());
    expect(evaluation.isAuthoritative).toBe(true);
    expect(evaluation.blockingReasons).toEqual([]);
    expect(evaluation.settlement.outcome).toBe('PAYABLE_BY_RESIDENT');
    expect(evaluation.settlement.netBalance.minorUnits).toBe(25000);
    expect(evaluation.settlement.grossDebit.minorUnits).toBe(25000);
    expect(evaluation.settlement.grossCredit.minorUnits).toBe(0);
  });

  it('never produces an authoritative settlement from an unreconciled ledger', () => {
    const evaluation = evaluateSettlement(input({ reconciliationStatus: 'UNRECONCILED' }));
    expect(evaluation.isAuthoritative).toBe(false);
    expect(evaluation.blockingReasons).toContain('settlement.ledgerNotReconciled');
  });

  it('never produces an authoritative settlement without a reconciliation reference or watermark', () => {
    const evaluation = evaluateSettlement(
      input({ reconciliationReference: undefined, ledgerWatermark: undefined }),
    );
    expect(evaluation.isAuthoritative).toBe(false);
    expect(evaluation.blockingReasons).toEqual(
      expect.arrayContaining([
        'settlement.missingReconciliationReference',
        'settlement.missingLedgerWatermark',
      ]),
    );
  });

  it('nets debits against credits exactly in minor units', () => {
    const evaluation = evaluateSettlement(
      input({
        lines: [
          line({ lineId: 'd1', amount: inr(30000) }),
          line({ lineId: 'd2', amount: inr(2000) }),
          line({ lineId: 'c1', origin: 'CREDIT', kind: 'PAYMENT_RECEIVED', amount: inr(12000) }),
        ],
      }),
    );
    expect(evaluation.settlement.grossDebit.minorUnits).toBe(32000);
    expect(evaluation.settlement.grossCredit.minorUnits).toBe(12000);
    expect(evaluation.settlement.netBalance.minorUnits).toBe(20000);
  });

  it('reports a refund when credits exceed debits', () => {
    const evaluation = evaluateSettlement(
      input({
        lines: [
          line({ lineId: 'd1', amount: inr(10000) }),
          line({ lineId: 'c1', origin: 'CREDIT', kind: 'SECURITY_DEPOSIT_HELD', amount: inr(55000) }),
        ],
      }),
    );
    expect(evaluation.settlement.outcome).toBe('REFUND_DUE_TO_RESIDENT');
    expect(evaluation.settlement.netBalance.minorUnits).toBe(-45000);
  });

  it('reports no balance when debits and credits offset exactly', () => {
    const evaluation = evaluateSettlement(
      input({
        lines: [
          line({ lineId: 'd1', amount: inr(15000) }),
          line({ lineId: 'c1', origin: 'CREDIT', kind: 'PAYMENT_RECEIVED', amount: inr(15000) }),
        ],
      }),
    );
    expect(evaluation.settlement.outcome).toBe('NO_BALANCE');
    expect(evaluation.settlement.netBalance.minorUnits).toBe(0);
    expect(isSettledInFull(evaluation.settlement)).toBe(true);
  });

  it('excludes uncounted informational lines from the balance but keeps them in the record', () => {
    const evaluation = evaluateSettlement(
      input({
        lines: [
          line({ lineId: 'd1', amount: inr(10000) }),
          line({ lineId: 'note', kind: 'OTHER_RECOVERY', amount: inr(99999), countedTowardsBalance: false }),
        ],
      }),
    );
    expect(evaluation.settlement.netBalance.minorUnits).toBe(10000);
    expect(evaluation.settlement.lines).toHaveLength(2);
  });

  it('reports not due when nothing is counted towards the balance', () => {
    const evaluation = evaluateSettlement(
      input({ lines: [line({ countedTowardsBalance: false })] }),
    );
    expect(evaluation.settlement.outcome).toBe('NOT_DUE');
  });

  it('rejects a mixed currency line', () => {
    const evaluation = evaluateSettlement(
      input({ lines: [line({ amount: { minorUnits: 100, currency: 'USD' as 'INR' } })] }),
    );
    expect(evaluation.isAuthoritative).toBe(false);
    expect(evaluation.blockingReasons).toContain('line.line-1.currencyMismatch');
  });

  it('rejects a sign that contradicts the declared origin', () => {
    const evaluation = evaluateSettlement(
      input({
        lines: [
          line({ lineId: 'bad-debit', amount: inr(-500) }),
          line({ lineId: 'bad-credit', origin: 'CREDIT', kind: 'PAYMENT_RECEIVED', amount: inr(500) }),
        ],
      }),
    );
    expect(evaluation.blockingReasons).toContain('line.bad-debit.negativeDebit');
    expect(evaluation.blockingReasons).toContain('line.bad-credit.positiveCredit');
  });

  it('refuses to count a disputed line towards the balance', () => {
    const evaluation = evaluateSettlement(
      input({ lines: [line({ disputeReference: 'dispute-1' })] }),
    );
    expect(evaluation.isAuthoritative).toBe(false);
    expect(evaluation.blockingReasons).toContain('line.line-1.disputedButCounted');
  });

  it('requires a source version on every line so a snapshot can be reproduced', () => {
    const evaluation = evaluateSettlement(input({ lines: [line({ sourceVersion: '' })] }));
    expect(evaluation.blockingReasons).toContain('line.line-1.missingSourceVersion');
  });

  it('changes the checksum when any amount or watermark changes', () => {
    const base = evaluateSettlement(input()).settlement;
    const changedAmount = evaluateSettlement(input({ lines: [line({ amount: inr(25001) })] })).settlement;
    const changedWatermark = evaluateSettlement(input({ ledgerWatermark: 'wm-100' })).settlement;
    expect(base.checksum).not.toBe(changedAmount.checksum);
    expect(base.checksum).not.toBe(changedWatermark.checksum);
    expect(base.checksum).toBe(settlementChecksum(base));
  });

  it('detects supersession by move out revision', () => {
    const prior = evaluateSettlement(input({ moveOutRevision: 3 })).settlement;
    const next = evaluateSettlement(input({ moveOutRevision: 4 })).settlement;
    expect(supersededBy(prior, next)).toBe(true);
    expect(supersededBy(next, prior)).toBe(false);
  });

  it('totals only resident payable balances', () => {
    const payable = evaluateSettlement(input()).settlement;
    const refund = evaluateSettlement(
      input({ moveOutRevision: 5, lines: [line({ origin: 'CREDIT', kind: 'REFUND_DUE', amount: inr(9000) })] }),
    ).settlement;
    expect(totalPayable([payable, refund], 'INR').minorUnits).toBe(25000);
  });

  it('maps balances to outcomes deterministically', () => {
    expect(outcomeFor(inr(0), true)).toBe('NO_BALANCE');
    expect(outcomeFor(inr(1), true)).toBe('PAYABLE_BY_RESIDENT');
    expect(outcomeFor(inr(-1), true)).toBe('REFUND_DUE_TO_RESIDENT');
    expect(outcomeFor(inr(50000), false)).toBe('NOT_DUE');
  });

  it('computes the net balance independently of the snapshot', () => {
    const settlement = evaluateSettlement(input()).settlement;
    expect(computeNetBalance(settlement.lines, 'INR').minorUnits).toBe(settlement.netBalance.minorUnits);
  });
});
