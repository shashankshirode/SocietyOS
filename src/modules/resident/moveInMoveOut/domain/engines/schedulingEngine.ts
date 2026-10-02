import type { Absent } from '../../../../../shared/types/absence.types';
import { allViolations, isAbsent } from '../guards/commandSupport';
import type { DomainViolation } from '../types/primitives';
import {
  MINUTES_PER_DAY,
  MS_PER_MINUTE,
  type Appointment,
  type ClockInterval,
  type DailyWindow,
  type GeneratedSlot,
  type SchedulingPolicy,
  type SlotHold,
  type SlotHoldRequest,
  type SlotRejection,
  type SlotRejectionOutcome,
} from '../types/scheduling.types';

export type ExistingCommitment = {
  readonly commitmentId: string;
  readonly resourceId: string;
  readonly interval: ClockInterval;
  readonly kind: 'APPOINTMENT' | 'MAINTENANCE' | 'BLACKOUT' | 'BOOKING';
};

const DAY_MS = 24 * 60 * MS_PER_MINUTE;

function toEpochMs(iso: string): number | Absent {
  const parsed = Date.parse(iso);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function overlaps(left: ClockInterval, right: ClockInterval): boolean {
  const leftStart = toEpochMs(left.startIso);
  const leftEnd = toEpochMs(left.endIso);
  const rightStart = toEpochMs(right.startIso);
  const rightEnd = toEpochMs(right.endIso);
  if (
    leftStart === undefined ||
    leftEnd === undefined ||
    rightStart === undefined ||
    rightEnd === undefined
  ) {
    return false;
  }
  return leftStart < rightEnd && rightStart < leftEnd;
}

function applyBuffer(interval: ClockInterval, beforeMinutes: number, afterMinutes: number): ClockInterval {
  const startMs = toEpochMs(interval.startIso);
  const endMs = toEpochMs(interval.endIso);
  if (startMs === undefined || endMs === undefined) {
    return interval;
  }
  return {
    startIso: new Date(startMs - beforeMinutes * MS_PER_MINUTE).toISOString(),
    endIso: new Date(endMs + afterMinutes * MS_PER_MINUTE).toISOString(),
  };
}

function minutesOfDay(iso: string, timezoneOffsetMinutes: number): number {
  const parsed = toEpochMs(iso);
  if (parsed === undefined) {
    return -1;
  }
  const shifted = new Date(parsed + timezoneOffsetMinutes * MS_PER_MINUTE);
  return shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
}

function dayOfWeek(iso: string, timezoneOffsetMinutes: number): number {
  const parsed = toEpochMs(iso);
  if (parsed === undefined) {
    return -1;
  }
  return new Date(parsed + timezoneOffsetMinutes * MS_PER_MINUTE).getUTCDay();
}

function windowFor(
  policy: SchedulingPolicy,
  startIso: string,
): DailyWindow | Absent {
  const day = dayOfWeek(startIso, policy.timezoneOffsetMinutes);
  const minute = minutesOfDay(startIso, policy.timezoneOffsetMinutes);
  return policy.dailyWindows.find(
    (window) => window.dayOfWeek === day && minute >= window.startMinuteOfDay && minute < window.endMinuteOfDay,
  );
}

function windowFitsDuration(policy: SchedulingPolicy, startIso: string, endIso: string): boolean {
  const window = windowFor(policy, startIso);

  if (window === undefined) {
    return false;
  }

  const endMinute = minutesOfDay(endIso, policy.timezoneOffsetMinutes);
  return endMinute <= window.endMinuteOfDay;
}

export function checkSlot(
  policy: SchedulingPolicy,
  requested: ClockInterval,
  commitments: readonly ExistingCommitment[],
  nowIso: string,
): SlotRejectionOutcome {
  const rejections: SlotRejection[] = [];
  const requestedEffective = applyBuffer(
    requested,
    policy.bufferBeforeMinutes,
    policy.bufferAfterMinutes,
  );

  const window = windowFor(policy, requested.startIso);

  if (window === undefined) {
    rejections.push({
      code: 'OUTSIDE_ALLOWED_WINDOW',
      conflictId: undefined,
      detailKey: 'slot.outsideAllowedWindow',
    });
  } else if (window.windowKind === 'BLACKOUT') {
    rejections.push({
      code: 'INSIDE_BLACKOUT',
      conflictId: undefined,
      detailKey: 'slot.insideBlackout',
    });
  } else if (window.windowKind === 'RESTRICTED') {
    rejections.push({
      code: 'INSIDE_RESTRICTED_WINDOW',
      conflictId: undefined,
      detailKey: 'slot.insideRestrictedWindow',
    });
  }

  if (!windowFitsDuration(policy, requested.startIso, requested.endIso)) {
    rejections.push({
      code: 'DURATION_MISMATCH',
      conflictId: undefined,
      detailKey: 'slot.durationMismatch',
    });
  }

  const requestedStart = toEpochMs(requested.startIso);
  const requestedEnd = toEpochMs(requested.endIso);
  const durationMinutes =
    requestedStart === undefined || requestedEnd === undefined
      ? Number.NaN
      : (requestedEnd - requestedStart) / MS_PER_MINUTE;

  if (durationMinutes !== policy.slotDurationMinutes) {
    rejections.push({
      code: 'DURATION_MISMATCH',
      conflictId: undefined,
      detailKey: 'slot.durationMismatch',
    });
  }

  const nowMs = toEpochMs(nowIso);
  const noticeMinutes =
    requestedStart === undefined || nowMs === undefined
      ? Number.NaN
      : (requestedStart - nowMs) / MS_PER_MINUTE;

  if (Number.isNaN(noticeMinutes) || noticeMinutes < policy.minimumNoticeMinutes) {
    rejections.push({
      code: 'INSUFFICIENT_NOTICE',
      conflictId: undefined,
      detailKey: 'slot.insufficientNotice',
    });
  }

  const advanceDays =
    requestedStart === undefined || nowMs === undefined
      ? Number.NaN
      : (requestedStart - nowMs) / DAY_MS;

  if (Number.isNaN(advanceDays) || advanceDays > policy.maximumAdvanceDays) {
    rejections.push({
      code: 'BEYOND_ADVANCE_LIMIT',
      conflictId: undefined,
      detailKey: 'slot.beyondAdvanceLimit',
    });
  }

  for (const commitment of commitments) {
    if (commitment.resourceId !== policy.resourceId) {
      continue;
    }

    if (overlaps(requestedEffective, commitment.interval)) {
      rejections.push({
        code: commitment.kind === 'BLACKOUT' ? 'INSIDE_BLACKOUT' : 'BUFFER_CONFLICT',
        conflictId: commitment.commitmentId,
        detailKey: 'slot.bufferConflict',
      });
    } else if (overlaps(requested, commitment.interval)) {
      rejections.push({
        code: 'DIRECT_OVERLAP',
        conflictId: commitment.commitmentId,
        detailKey: 'slot.directOverlap',
      });
    }
  }

  if (rejections.length > 0) {
    return { acceptable: false, rejections };
  }

  return { acceptable: true, warnings: [] };
}

export function generateSlots(
  policy: SchedulingPolicy,
  fromIso: string,
  days: number,
  commitments: readonly ExistingCommitment[],
): readonly GeneratedSlot[] {
  const slots: GeneratedSlot[] = [];

  const fromMs = toEpochMs(fromIso);

  if (fromMs === undefined) {
    return [];
  }

  for (let dayOffset = 0; dayOffset < days; dayOffset += 1) {
    const dayStart = new Date(fromMs + dayOffset * DAY_MS);
    const day = dayStart.getUTCDay();

    for (const window of policy.dailyWindows) {
      if (window.dayOfWeek !== day) {
        continue;
      }

      for (
        let minute = window.startMinuteOfDay;
        minute + policy.slotDurationMinutes <= window.endMinuteOfDay;
        minute += policy.slotDurationMinutes
      ) {
        const start = new Date(
          dayStart.getTime() -
            dayStart.getUTCHours() * MS_PER_MINUTE -
            dayStart.getUTCMinutes() * MS_PER_MINUTE +
            (minute - policy.timezoneOffsetMinutes) * MS_PER_MINUTE,
        );
        const end = new Date(start.getTime() + policy.slotDurationMinutes * MS_PER_MINUTE);
        const interval: ClockInterval = { startIso: start.toISOString(), endIso: end.toISOString() };
        const outcome = checkSlot(policy, interval, commitments, fromIso);
        const bookable = outcome.acceptable;
        const effective = applyBuffer(interval, policy.bufferBeforeMinutes, policy.bufferAfterMinutes);

        slots.push({
          slotId: `slot-${policy.policyId}-${start.toISOString()}`,
          resourceKind: policy.resourceKind,
          resourceId: policy.resourceId,
          policyId: policy.policyId,
          startIso: interval.startIso,
          endIso: interval.endIso,
          windowKind: window.windowKind,
          bookable,
          rejectionKey: bookable
            ? undefined
            : outcome.acceptable
              ? undefined
              : (outcome.rejections[0]?.detailKey ?? 'slot.unavailable'),
          effectiveStartIso: effective.startIso,
          effectiveEndIso: effective.endIso,
        });
      }
    }
  }

  return slots;
}

function holdViolations(request: SlotHoldRequest): readonly DomainViolation[] {
  const groups: DomainViolation[][] = [];

  if (isAbsent(request.idempotencyKey)) {
    groups.push([{ code: 'IDEMPOTENCY_KEY_REQUIRED', field: 'request.idempotencyKey', blocking: true }]);
  }

  const activeHolds = request.existingHolds.filter(
    (hold) =>
      hold.societyId === request.societyId &&
      hold.heldForResidentId === request.residentId &&
      (hold.status === 'HELD' || hold.status === 'CONFIRMED'),
  );

  if (activeHolds.length >= request.policy.maximumActiveHoldsPerResident) {
    groups.push([{ code: 'SLOT_HOLD_EXPIRED', field: 'request.maximumActiveHolds', blocking: true }]);
  }

  return allViolations(groups);
}

export function holdViolationsFor(request: SlotHoldRequest): readonly DomainViolation[] {
  return holdViolations(request);
}

export function requestHold(
  request: SlotHoldRequest,
  commitments: readonly ExistingCommitment[],
): { readonly hold: SlotHold } | { readonly rejections: readonly SlotRejection[]; readonly violations: readonly DomainViolation[] } {
  const violations = holdViolations(request);

  if (violations.length > 0) {
    return { rejections: [], violations };
  }

  const outcome = checkSlot(
    request.policy,
    { startIso: request.startIso, endIso: request.endIso },
    commitments,
    request.nowIso,
  );

  if (!outcome.acceptable) {
    return { rejections: outcome.rejections, violations: [] };
  }

  const effective = applyBuffer(
    { startIso: request.startIso, endIso: request.endIso },
    request.policy.bufferBeforeMinutes,
    request.policy.bufferAfterMinutes,
  );

  const expiryMinutes = Math.max(request.policy.minimumNoticeMinutes, 60);
  const nowMs = toEpochMs(request.nowIso);

  if (nowMs === undefined) {
    return {
      rejections: [
        { code: 'INSUFFICIENT_NOTICE', conflictId: undefined, detailKey: 'slot.clockUnavailable' },
      ],
      violations: [],
    };
  }

  return {
    hold: {
      holdId: request.holdId,
      resourceKind: request.policy.resourceKind,
      resourceId: request.policy.resourceId,
      societyId: request.societyId,
      heldByActorId: request.actorId,
      heldForResidentId: request.residentId,
      startIso: request.startIso,
      endIso: request.endIso,
      effectiveStartIso: effective.startIso,
      effectiveEndIso: effective.endIso,
      status: 'HELD',
      idempotencyKey: request.idempotencyKey,
      createdAt: request.nowIso,
      expiresAt: new Date(nowMs + expiryMinutes * MS_PER_MINUTE).toISOString(),
      confirmedAt: undefined,
      releasedAt: undefined,
      releaseReasonKey: undefined,
      counterSignedByActorId: undefined,
      linkedRequestId: request.linkedRequestId,
    },
  };
}

export function confirmHold(
  hold: SlotHold,
  nowIso: string,
  policy: SchedulingPolicy,
  commitments: readonly ExistingCommitment[],
): { readonly hold: SlotHold } | { readonly rejections: readonly SlotRejection[] } {
  if (hold.status === 'RELEASED' || hold.status === 'EXPIRED') {
    return {
      rejections: [
        { code: 'HOLD_NOT_ACTIVE', conflictId: hold.holdId, detailKey: 'slot.holdNotActive' },
      ],
    };
  }

  if (policy.requiresSocietyCounterSign && isAbsent(hold.counterSignedByActorId)) {
    return {
      rejections: [
        { code: 'COUNTER_SIGN_REQUIRED', conflictId: hold.holdId, detailKey: 'slot.counterSignRequired' },
      ],
    };
  }

  const outcome = checkSlot(
    policy,
    { startIso: hold.startIso, endIso: hold.endIso },
    commitments,
    nowIso,
  );

  if (!outcome.acceptable) {
    return { rejections: outcome.rejections };
  }

  return { hold: { ...hold, status: 'CONFIRMED', confirmedAt: nowIso } };
}

export function releaseHold(hold: SlotHold, nowIso: string, reasonKey: string): SlotHold {
  return {
    ...hold,
    status: 'RELEASED',
    releasedAt: nowIso,
    releaseReasonKey: reasonKey,
  };
}

export function expireStaleHolds(
  holds: readonly SlotHold[],
  nowIso: string,
): readonly SlotHold[] {
  return holds.map((hold) => {
    const expiresAt = toEpochMs(hold.expiresAt);
    const nowMs = toEpochMs(nowIso);
    if (hold.status !== 'HELD' || expiresAt === undefined || nowMs === undefined || expiresAt > nowMs) {
      return hold;
    }
    return { ...hold, status: 'EXPIRED' as const };
  });
}

export function toAppointment(
  hold: SlotHold,
  appointmentId: string,
  createdAt: string,
): Appointment {
  return {
    appointmentId,
    resourceKind: hold.resourceKind,
    resourceId: hold.resourceId,
    societyId: hold.societyId,
    residentId: hold.heldForResidentId,
    startIso: hold.startIso,
    endIso: hold.endIso,
    holdId: hold.holdId,
    counterSignedByActorId: hold.counterSignedByActorId,
    linkedRequestId: hold.linkedRequestId === undefined ? 'unlinked' : hold.linkedRequestId,
    createdAt,
    cancelledAt: undefined,
    cancellationReasonKey: undefined,
  };
}

export function holdsForResource(
  holds: readonly SlotHold[],
  resourceId: string,
): readonly ExistingCommitment[] {
  return holds
    .filter((hold) => hold.resourceId === resourceId && hold.status !== 'RELEASED' && hold.status !== 'EXPIRED')
    .map((hold) => ({
      commitmentId: hold.holdId,
      resourceId: hold.resourceId,
      interval: { startIso: hold.startIso, endIso: hold.endIso },
      kind: 'APPOINTMENT' as const,
    }));
}

export function windowsWithinDay(policy: SchedulingPolicy): readonly DailyWindow[] {
  return policy.dailyWindows.filter(
    (window) => window.endMinuteOfDay - window.startMinuteOfDay >= policy.slotDurationMinutes,
  );
}

export function totalDailyMinutes(policy: SchedulingPolicy): number {
  return policy.dailyWindows.reduce(
    (total, window) => total + (window.endMinuteOfDay - window.startMinuteOfDay),
    0,
  );
}

export function policyIsStale(policy: SchedulingPolicy, expectedVersion: string): boolean {
  return policy.policyVersion !== expectedVersion;
}

export function isWithinDay(minuteOfDay: number): boolean {
  return minuteOfDay >= 0 && minuteOfDay < MINUTES_PER_DAY;
}
