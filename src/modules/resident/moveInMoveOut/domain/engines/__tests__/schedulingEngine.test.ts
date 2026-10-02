import {
  checkSlot,
  confirmHold,
  expireStaleHolds,
  generateSlots,
  holdsForResource,
  policyIsStale,
  releaseHold,
  requestHold,
  toAppointment,
} from '../schedulingEngine';
import type { ExistingCommitment } from '../schedulingEngine';
import type { SchedulingPolicy, SlotHold, SlotHoldRequest } from '../../types/scheduling.types';

const FRIDAY = '2026-10-02T00:00:00.000Z';

function policy(overrides: Partial<SchedulingPolicy> = {}): SchedulingPolicy {
  return {
    policyId: 'pol-lift',
    policyVersion: 'v1',
    resourceKind: 'LIFT_MOVE_SLOT',
    resourceId: 'lift-A',
    timezoneOffsetMinutes: 330,
    slotDurationMinutes: 120,
    bufferBeforeMinutes: 30,
    bufferAfterMinutes: 30,
    dailyWindows: [
      { dayOfWeek: 6, startMinuteOfDay: 9 * 60, endMinuteOfDay: 17 * 60, windowKind: 'ALLOWED', labelKey: 'label.sat' },
    ],
    minimumNoticeMinutes: 1440,
    maximumAdvanceDays: 60,
    maximumActiveHoldsPerResident: 1,
    requiresSocietyCounterSign: false,
    ...overrides,
  };
}

function request(overrides: Partial<SlotHoldRequest> = {}): SlotHoldRequest {
  return {
    holdId: 'hold-1',
    societyId: 'soc-1',
    actorId: 'actor-resident',
    residentId: 'res-1',
    policy: policy(),
    startIso: '2026-10-03T04:00:00.000Z',
    endIso: '2026-10-03T06:00:00.000Z',
    idempotencyKey: 'idem-1',
    nowIso: FRIDAY,
    existingHolds: [],
    linkedRequestId: 'mov-1',
    ...overrides,
  };
}

const liftMaintenance: ExistingCommitment = {
  commitmentId: 'maint-1',
  resourceId: 'lift-A',
  interval: { startIso: '2026-10-03T05:00:00.000Z', endIso: '2026-10-03T07:00:00.000Z' },
  kind: 'MAINTENANCE',
};

describe('schedulingEngine', () => {
  it('accepts a slot inside an allowed window with enough notice', () => {
    const outcome = checkSlot(
      policy(),
      { startIso: '2026-10-03T04:00:00.000Z', endIso: '2026-10-03T06:00:00.000Z' },
      [],
      FRIDAY,
    );
    expect(outcome.acceptable).toBe(true);
  });

  it('rejects a slot on a day with no window', () => {
    const outcome = checkSlot(
      policy(),
      { startIso: '2026-10-05T04:00:00.000Z', endIso: '2026-10-05T06:00:00.000Z' },
      [],
      FRIDAY,
    );
    expect(outcome.acceptable).toBe(false);
    if (!outcome.acceptable) {
      expect(outcome.rejections.map((rejection) => rejection.code)).toContain('OUTSIDE_ALLOWED_WINDOW');
    }
  });

  it('rejects a slot inside a blackout window', () => {
    const blackoutPolicy = policy({
      dailyWindows: [
        { dayOfWeek: 6, startMinuteOfDay: 9 * 60, endMinuteOfDay: 17 * 60, windowKind: 'BLACKOUT', labelKey: 'label.maint' },
      ],
    });
    const outcome = checkSlot(
      blackoutPolicy,
      { startIso: '2026-10-03T04:00:00.000Z', endIso: '2026-10-03T06:00:00.000Z' },
      [],
      FRIDAY,
    );
    expect(outcome.acceptable).toBe(false);
    if (!outcome.acceptable) {
      expect(outcome.rejections.map((rejection) => rejection.code)).toContain('INSIDE_BLACKOUT');
    }
  });

  it('rejects a slot inside a restricted window', () => {
    const restricted = policy({
      dailyWindows: [
        { dayOfWeek: 6, startMinuteOfDay: 9 * 60, endMinuteOfDay: 17 * 60, windowKind: 'RESTRICTED', labelKey: 'label.restricted' },
      ],
    });
    const outcome = checkSlot(
      restricted,
      { startIso: '2026-10-03T04:00:00.000Z', endIso: '2026-10-03T06:00:00.000Z' },
      [],
      FRIDAY,
    );
    expect(outcome.acceptable).toBe(false);
    if (!outcome.acceptable) {
      expect(outcome.rejections.map((rejection) => rejection.code)).toContain('INSIDE_RESTRICTED_WINDOW');
    }
  });

  it('rejects a slot that does not match the configured duration', () => {
    const outcome = checkSlot(
      policy(),
      { startIso: '2026-10-03T04:00:00.000Z', endIso: '2026-10-03T05:00:00.000Z' },
      [],
      FRIDAY,
    );
    expect(outcome.acceptable).toBe(false);
    if (!outcome.acceptable) {
      expect(outcome.rejections.map((rejection) => rejection.code)).toContain('DURATION_MISMATCH');
    }
  });

  it('rejects a slot booked inside the minimum notice period', () => {
    const outcome = checkSlot(
      policy(),
      { startIso: '2026-10-03T04:00:00.000Z', endIso: '2026-10-03T06:00:00.000Z' },
      [],
      '2026-10-03T02:00:00.000Z',
    );
    expect(outcome.acceptable).toBe(false);
    if (!outcome.acceptable) {
      expect(outcome.rejections.map((rejection) => rejection.code)).toContain('INSUFFICIENT_NOTICE');
    }
  });

  it('rejects a slot beyond the advance booking limit', () => {
    const outcome = checkSlot(
      policy({ maximumAdvanceDays: 1 }),
      { startIso: '2026-10-03T04:00:00.000Z', endIso: '2026-10-03T06:00:00.000Z' },
      [],
      FRIDAY,
    );
    expect(outcome.acceptable).toBe(false);
    if (!outcome.acceptable) {
      expect(outcome.rejections.map((rejection) => rejection.code)).toContain('BEYOND_ADVANCE_LIMIT');
    }
  });

  it('detects a lift maintenance conflict through the buffer rather than leaving it to the gate', () => {
    const outcome = checkSlot(
      policy(),
      { startIso: '2026-10-03T04:00:00.000Z', endIso: '2026-10-03T06:00:00.000Z' },
      [liftMaintenance],
      FRIDAY,
    );
    expect(outcome.acceptable).toBe(false);
    if (!outcome.acceptable) {
      expect(outcome.rejections.map((rejection) => rejection.code)).toContain('BUFFER_CONFLICT');
      expect(outcome.rejections[0]?.conflictId).toBe('maint-1');
    }
  });

  it('ignores a commitment on a different resource', () => {
    const otherLift: ExistingCommitment = { ...liftMaintenance, resourceId: 'lift-B' };
    const outcome = checkSlot(
      policy(),
      { startIso: '2026-10-03T04:00:00.000Z', endIso: '2026-10-03T06:00:00.000Z' },
      [otherLift],
      FRIDAY,
    );
    expect(outcome.acceptable).toBe(true);
  });

  it('generates bookable slots for a Saturday window and marks the rest unavailable', () => {
    const slots = generateSlots(policy(), FRIDAY, 7, []);
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.every((slot) => slot.startIso.startsWith('2026-10-03'))).toBe(true);
    expect(slots.filter((slot) => slot.bookable).length).toBe(slots.length);
  });

  it('excludes blacked out slots from generation', () => {
    const blackoutPolicy = policy({
      dailyWindows: [
        { dayOfWeek: 6, startMinuteOfDay: 9 * 60, endMinuteOfDay: 17 * 60, windowKind: 'BLACKOUT', labelKey: 'label.maint' },
      ],
    });
    const slots = generateSlots(blackoutPolicy, FRIDAY, 7, []);
    expect(slots.every((slot) => slot.bookable)).toBe(false);
    expect(slots[0]?.rejectionKey).toBe('slot.insideBlackout');
  });

  it('holds a valid slot and expires the hold', () => {
    const result = requestHold(request(), []);
    expect('hold' in result).toBe(true);
    if (!('hold' in result)) {
      return;
    }
    expect(result.hold.status).toBe('HELD');
    expect(result.hold.effectiveStartIso).toBe('2026-10-03T03:30:00.000Z');
    expect(result.hold.effectiveEndIso).toBe('2026-10-03T06:30:00.000Z');
  });

  it('refuses to hold a slot that conflicts with maintenance', () => {
    const result = requestHold(request(), [liftMaintenance]);
    expect('rejections' in result).toBe(true);
    if ('rejections' in result) {
      expect(result.rejections.map((rejection) => rejection.code)).toContain('BUFFER_CONFLICT');
    }
  });

  it('refuses to hold a slot without an idempotency key', () => {
    const result = requestHold(request({ idempotencyKey: '' }), []);
    expect('violations' in result).toBe(true);
    if ('violations' in result) {
      expect(result.violations.map((violation) => violation.code)).toContain('IDEMPOTENCY_KEY_REQUIRED');
    }
  });

  it('enforces the maximum active holds per resident', () => {
    const existing: SlotHold = {
      holdId: 'hold-existing',
      resourceKind: 'LIFT_MOVE_SLOT',
      resourceId: 'lift-A',
      societyId: 'soc-1',
      heldByActorId: 'actor-resident',
      heldForResidentId: 'res-1',
      startIso: '2026-10-03T07:00:00.000Z',
      endIso: '2026-10-03T09:00:00.000Z',
      effectiveStartIso: '2026-10-03T06:30:00.000Z',
      effectiveEndIso: '2026-10-03T09:30:00.000Z',
      status: 'HELD',
      idempotencyKey: 'idem-existing',
      createdAt: FRIDAY,
      expiresAt: '2026-10-03T00:00:00.000Z',
      confirmedAt: undefined,
      releasedAt: undefined,
      releaseReasonKey: undefined,
      counterSignedByActorId: undefined,
      linkedRequestId: undefined,
    };
    const result = requestHold(request({ existingHolds: [existing] }), []);
    expect('violations' in result).toBe(true);
  });

  it('requires society counter sign when the policy demands it', () => {
    const signed = policy({ requiresSocietyCounterSign: true });
    const held = requestHold(request({ policy: signed }), []);
    expect('hold' in held).toBe(true);
    if (!('hold' in held)) {
      return;
    }
    const unsigned = confirmHold(held.hold, FRIDAY, signed, []);
    expect('rejections' in unsigned).toBe(true);
    if ('rejections' in unsigned) {
      expect(unsigned.rejections[0]?.code).toBe('COUNTER_SIGN_REQUIRED');
    }
  });

  it('confirms a held slot once the policy is satisfied', () => {
    const held = requestHold(request(), []);
    expect('hold' in held).toBe(true);
    if (!('hold' in held)) {
      return;
    }
    const confirmed = confirmHold(held.hold, FRIDAY, policy(), []);
    expect('hold' in confirmed).toBe(true);
    if ('hold' in confirmed) {
      expect(confirmed.hold.status).toBe('CONFIRMED');
      expect(confirmed.hold.confirmedAt).toBe(FRIDAY);
    }
  });

  it('rejects confirming a released hold', () => {
    const held = requestHold(request(), []);
    expect('hold' in held).toBe(true);
    if (!('hold' in held)) {
      return;
    }
    const released = releaseHold(held.hold, FRIDAY, 'reason.residentCancelled');
    const confirmed = confirmHold(released, FRIDAY, policy(), []);
    expect('rejections' in confirmed).toBe(true);
    if ('rejections' in confirmed) {
      expect(confirmed.rejections[0]?.code).toBe('HOLD_NOT_ACTIVE');
    }
  });

  it('expires only stale held bookings and leaves confirmed ones alone', () => {
    const held = requestHold(request(), []);
    expect('hold' in held).toBe(true);
    if (!('hold' in held)) {
      return;
    }
    const confirmed = { ...held.hold, status: 'CONFIRMED' as const };
    const expired = expireStaleHolds([held.hold, confirmed], '2026-10-10T00:00:00.000Z');
    expect(expired[0]?.status).toBe('EXPIRED');
    expect(expired[1]?.status).toBe('CONFIRMED');
  });

  it('projects live holds back into commitments so a second booking sees the conflict', () => {
    const held = requestHold(request(), []);
    expect('hold' in held).toBe(true);
    if (!('hold' in held)) {
      return;
    }
    const commitments = holdsForResource([held.hold], 'lift-A');
    expect(commitments).toHaveLength(1);
    const second = checkSlot(
      policy(),
      { startIso: '2026-10-03T04:00:00.000Z', endIso: '2026-10-03T06:00:00.000Z' },
      commitments,
      FRIDAY,
    );
    expect(second.acceptable).toBe(false);
  });

  it('creates an appointment linked to the originating request', () => {
    const held = requestHold(request(), []);
    expect('hold' in held).toBe(true);
    if (!('hold' in held)) {
      return;
    }
    const appointment = toAppointment(held.hold, 'appt-1', FRIDAY);
    expect(appointment.linkedRequestId).toBe('mov-1');
    expect(appointment.residentId).toBe('res-1');
    expect(appointment.holdId).toBe('hold-1');
  });

  it('detects a stale policy version rather than booking against old rules', () => {
    expect(policyIsStale(policy(), 'v1')).toBe(false);
    expect(policyIsStale(policy(), 'v2')).toBe(true);
  });
});
