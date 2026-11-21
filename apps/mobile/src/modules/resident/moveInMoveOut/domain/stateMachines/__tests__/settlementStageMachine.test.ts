import { applySettlementCommand, settlementStagePath, isSettlementTerminalStage } from '../settlementStageMachine';
import type { SettlementStageState, SettlementStageCommand } from '../settlementStageMachine';

const TREASURER = {
  actorId: 'actor-treasurer',
  actorType: 'TREASURER',
  displayName: 'Treasurer',
  societyId: 'soc-1',
  unitId: undefined,
  onBehalfOfResidentId: undefined,
} as const;

const SYSTEM = { ...TREASURER, actorId: 'actor-system', actorType: 'SYSTEM' } as const;

function makeState(stage: SettlementStageState['stage'] = 'REQUESTED', revision = 1): SettlementStageState {
  return {
    settlementId: 'stl-mov-1-r4',
    moveOutRequestId: 'mov-1',
    moveOutRevision: 4,
    scope: { societyId: 'soc-1', unitId: 'unit-9', residentId: 'res-1', occupancyRelationshipId: 'rel-1' },
    stage,
    revision,
    frozenPeriod: stage === 'REQUESTED' ? undefined : { from: '2026-10-01', to: '2026-10-31' },
    authoritative: stage === 'CLEARED',
    exceptionReasonKeys: stage === 'EXCEPTION' ? ['reason.pendingInvoice'] : [],
    clearedAt: stage === 'CLEARED' ? '2026-10-02T00:00:00.000Z' : undefined,
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
  };
}

function makeCommand(overrides: Partial<SettlementStageCommand> = {}): SettlementStageCommand {
  return {
    kind: 'FREEZE_PERIOD',
    actor: TREASURER,
    idempotencyKey: 'idem-1',
    expectedRevision: 1,
    occurredAt: '2026-10-01T01:00:00.000Z',
    periodFrom: '2026-10-01',
    periodTo: '2026-10-31',
    settlementSnapshotId: undefined,
    exceptionReasonKeys: [],
    ...overrides,
  };
}

describe('settlementStageMachine', () => {
  it('declares the F13 progression', () => {
    expect(settlementStagePath()).toEqual([
      'REQUESTED',
      'CALCULATING',
      'REVIEW',
      'SETTLEMENT_PENDING',
      'CLEARED',
    ]);
    expect(isSettlementTerminalStage('CLEARED')).toBe(true);
    expect(isSettlementTerminalStage('EXCEPTION')).toBe(false);
    expect(isSettlementTerminalStage('REVIEW')).toBe(false);
  });

  it('freezes the period before any calculation is recorded', () => {
    const outcome = applySettlementCommand(makeState(), makeCommand());
    expect(outcome.allowed).toBe(true);
    if (outcome.allowed) {
      expect(outcome.toStage).toBe('CALCULATING');
      expect(outcome.state.frozenPeriod).toEqual({ from: '2026-10-01', to: '2026-10-31' });
    }
  });

  it('requires the period to be frozen before it can be reviewed', () => {
    const outcome = applySettlementCommand(
      { ...makeState('CALCULATING'), frozenPeriod: undefined },
      makeCommand({ kind: 'RECORD_REVIEW', expectedRevision: 1 }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.field)).toContain('state.frozenPeriod');
    }
  });

  it('walks requested to cleared and marks the result authoritative', () => {
    let state = makeState();
    const steps: readonly (readonly [SettlementStageCommand['kind'], string])[] = [
      ['FREEZE_PERIOD', 'CALCULATING'],
      ['RECORD_REVIEW', 'REVIEW'],
      ['AWAIT_SETTLEMENT', 'SETTLEMENT_PENDING'],
      ['RECORD_CLEARANCE', 'CLEARED'],
    ];

    for (const [kind, expected] of steps) {
      const outcome = applySettlementCommand(
        state,
        makeCommand({ kind, expectedRevision: state.revision, settlementSnapshotId: 'stl-1' }),
      );
      expect(outcome.allowed).toBe(true);
      if (outcome.allowed) {
        expect(outcome.toStage).toBe(expected);
        state = outcome.state;
      }
    }

    expect(state.stage).toBe('CLEARED');
    expect(state.authoritative).toBe(true);
    expect(state.clearedAt).toBeDefined();
  });

  it('refuses to clear without a settlement snapshot reference', () => {
    const outcome = applySettlementCommand(
      makeState('SETTLEMENT_PENDING'),
      makeCommand({ kind: 'RECORD_CLEARANCE', expectedRevision: 1 }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.field)).toContain(
        'command.settlementSnapshotId',
      );
    }
  });

  it('refuses to clear from a stage that has not reached settlement', () => {
    const outcome = applySettlementCommand(
      makeState('REVIEW'),
      makeCommand({ kind: 'RECORD_CLEARANCE', expectedRevision: 1, settlementSnapshotId: 'stl-1' }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.code)).toContain('ILLEGAL_TRANSITION');
    }
  });

  it('records a recoverable exception from any pre terminal stage', () => {
    const outcome = applySettlementCommand(
      makeState('REVIEW'),
      makeCommand({
        kind: 'RECORD_EXCEPTION',
        expectedRevision: 1,
        exceptionReasonKeys: ['reason.disputedDamage', 'reason.missingMeterReading'],
      }),
    );
    expect(outcome.allowed).toBe(true);
    if (outcome.allowed) {
      expect(outcome.toStage).toBe('EXCEPTION');
      expect(outcome.state.exceptionReasonKeys).toHaveLength(2);
      expect(outcome.state.authoritative).toBe(false);
    }
  });

  it('requires at least one reason for an exception so it is actionable', () => {
    const outcome = applySettlementCommand(
      makeState('REVIEW'),
      makeCommand({ kind: 'RECORD_EXCEPTION', expectedRevision: 1, exceptionReasonKeys: [] }),
    );
    expect(outcome.allowed).toBe(false);
  });

  it('lets an exception re-enter review without corrupting history', () => {
    const outcome = applySettlementCommand(
      makeState('EXCEPTION'),
      makeCommand({ kind: 'RECORD_REVIEW', expectedRevision: 1 }),
    );
    expect(outcome.allowed).toBe(true);
    if (outcome.allowed) {
      expect(outcome.toStage).toBe('REVIEW');
      expect(outcome.state.revision).toBe(2);
    }
  });

  it('never deletes the recorded exception reasons when the settlement is later cleared', () => {
    const exception = applySettlementCommand(
      makeState('EXCEPTION', 2),
      makeCommand({ kind: 'RECORD_REVIEW', expectedRevision: 2 }),
    );
    expect(exception.allowed).toBe(true);
    if (!exception.allowed) {
      return;
    }
    const cleared = applySettlementCommand(
      exception.state,
      makeCommand({
        kind: 'RECORD_CLEARANCE',
        expectedRevision: exception.state.revision,
        settlementSnapshotId: 'stl-1',
      }),
    );
    expect(cleared.allowed).toBe(false);
  });

  it('rejects a stale revision and a foreign society actor', () => {
    const stale = applySettlementCommand(makeState('REVIEW', 5), makeCommand({ expectedRevision: 4 }));
    expect(stale.allowed).toBe(false);

    const foreign = applySettlementCommand(
      makeState('REVIEW'),
      makeCommand({ actor: { ...TREASURER, societyId: 'soc-other' } }),
    );
    expect(foreign.allowed).toBe(false);
  });

  it('refuses a system actor for financial adjustment', () => {
    const outcome = applySettlementCommand(
      makeState('REQUESTED'),
      makeCommand({ actor: SYSTEM }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.code)).toContain('ACTOR_NOT_AUTHORIZED');
    }
  });
});
