import type { Absent } from '../../../../../shared/types/absence.types';

export type SchedulingResourceKind =
  | 'LIFT_MOVE_SLOT'
  | 'LOADING_BAY'
  | 'MOVING_VEHICLE_GATE_WINDOW'
  | 'MANAGER_INSPECTION_VISIT'
  | 'SECURITY_HANDOVER_APPOINTMENT';

export type SchedulingWindowKind = 'ALLOWED' | 'BLACKOUT' | 'RESTRICTED';

export type ClockInterval = {
  readonly startIso: string;
  readonly endIso: string;
};

export type DailyWindow = {
  readonly dayOfWeek: number;
  readonly startMinuteOfDay: number;
  readonly endMinuteOfDay: number;
  readonly windowKind: SchedulingWindowKind;
  readonly labelKey: string;
};

export type SchedulingPolicy = {
  readonly policyId: string;
  readonly policyVersion: string;
  readonly resourceKind: SchedulingResourceKind;
  readonly resourceId: string;
  readonly timezoneOffsetMinutes: number;
  readonly slotDurationMinutes: number;
  readonly bufferBeforeMinutes: number;
  readonly bufferAfterMinutes: number;
  readonly dailyWindows: readonly DailyWindow[];
  readonly minimumNoticeMinutes: number;
  readonly maximumAdvanceDays: number;
  readonly maximumActiveHoldsPerResident: number;
  readonly requiresSocietyCounterSign: boolean;
};

export type GeneratedSlot = {
  readonly slotId: string;
  readonly resourceKind: SchedulingResourceKind;
  readonly resourceId: string;
  readonly policyId: string;
  readonly startIso: string;
  readonly endIso: string;
  readonly windowKind: SchedulingWindowKind;
  readonly bookable: boolean;
  readonly rejectionKey: string | Absent;
  readonly effectiveStartIso: string;
  readonly effectiveEndIso: string;
};

export type SlotRejectionCode =
  | 'OUTSIDE_ALLOWED_WINDOW'
  | 'INSIDE_BLACKOUT'
  | 'INSIDE_RESTRICTED_WINDOW'
  | 'INSUFFICIENT_NOTICE'
  | 'BEYOND_ADVANCE_LIMIT'
  | 'DURATION_MISMATCH'
  | 'BUFFER_CONFLICT'
  | 'DIRECT_OVERLAP'
  | 'HOLD_LIMIT_REACHED'
  | 'HOLD_NOT_ACTIVE'
  | 'COUNTER_SIGN_REQUIRED'
  | 'UNKNOWN_RESOURCE'
  | 'STALE_POLICY';

export type SlotRejection = {
  readonly code: SlotRejectionCode;
  readonly conflictId: string | Absent;
  readonly detailKey: string;
};

export type SlotRejectionOutcome =
  | { readonly acceptable: true; readonly warnings: readonly SlotRejection[] }
  | { readonly acceptable: false; readonly rejections: readonly SlotRejection[] };

export type SlotHoldStatus = 'HELD' | 'CONFIRMED' | 'RELEASED' | 'EXPIRED';

export type SlotHold = {
  readonly holdId: string;
  readonly resourceKind: SchedulingResourceKind;
  readonly resourceId: string;
  readonly societyId: string;
  readonly heldByActorId: string;
  readonly heldForResidentId: string;
  readonly startIso: string;
  readonly endIso: string;
  readonly effectiveStartIso: string;
  readonly effectiveEndIso: string;
  readonly status: SlotHoldStatus;
  readonly idempotencyKey: string;
  readonly createdAt: string;
  readonly expiresAt: string;
  readonly confirmedAt: string | Absent;
  readonly releasedAt: string | Absent;
  readonly releaseReasonKey: string | Absent;
  readonly counterSignedByActorId: string | Absent;
  readonly linkedRequestId: string | Absent;
};

export type SlotHoldRequest = {
  readonly holdId: string;
  readonly societyId: string;
  readonly actorId: string;
  readonly residentId: string;
  readonly policy: SchedulingPolicy;
  readonly startIso: string;
  readonly endIso: string;
  readonly idempotencyKey: string;
  readonly nowIso: string;
  readonly existingHolds: readonly SlotHold[];
  readonly linkedRequestId: string | Absent;
};

export type Appointment = {
  readonly appointmentId: string;
  readonly resourceKind: SchedulingResourceKind;
  readonly resourceId: string;
  readonly societyId: string;
  readonly residentId: string;
  readonly startIso: string;
  readonly endIso: string;
  readonly holdId: string;
  readonly counterSignedByActorId: string | Absent;
  readonly linkedRequestId: string;
  readonly createdAt: string;
  readonly cancelledAt: string | Absent;
  readonly cancellationReasonKey: string | Absent;
};

export const MINUTES_PER_DAY = 1440;
export const MS_PER_MINUTE = 60_000;
