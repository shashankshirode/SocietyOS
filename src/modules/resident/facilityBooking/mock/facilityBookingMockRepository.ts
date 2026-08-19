import * as Crypto from 'expo-crypto';
import { mockResidentHomeContexts } from '../../homeContext/data/residentHomeContext.mockData';
import { mapContextToActive } from '../../homeContext/state/residentHomeContext.store';
import {
  FacilityAvailabilityStatus,
  FacilityBookingFilter,
  FacilityBookingStatus,
  FacilityCategory,
  FacilityCheckInMode,
  FacilityCheckInResultCode,
  FacilityDiscoveryFilter,
  FacilityPaymentStatus,
  FacilityRefundStatus,
  FacilitySlotStatus,
} from '../models/facilityBooking.enums';
import type {
  CancelFacilityBookingRequest,
  CheckFacilityBookingEligibilityRequest,
  CreateFacilityBookingQuoteRequest,
  CreateFacilityBookingRequest,
  FacilityCheckInRequest,
  GetFacilitiesRequest,
  GetFacilityAvailabilityRequest,
  GetFacilityBookingsRequest,
  HoldFacilitySlotRequest,
  JoinFacilityWaitlistRequest,
  LeaveFacilityWaitlistRequest,
  PayFacilityBookingRequest,
  ReleaseFacilitySlotRequest,
  RescheduleFacilityBookingRequest,
  UpdateFacilityCalendarLinkRequest,
} from '../models/facilityBooking.requests';
import type {
  CancelFacilityBookingResult,
  Facility,
  FacilityActivityItem,
  FacilityAvailabilityResult,
  FacilityBooking,
  FacilityBookingDashboardSummary,
  FacilityBookingEligibilityResult,
  FacilityBookingPayment,
  FacilityBookingQrPass,
  FacilityBookingQuote,
  FacilityCheckInResult,
  FacilityNotificationItem,
  FacilitySlot,
  FacilitySlotHold,
  FacilityWaitlistEntry,
  PaginatedResult,
} from '../models/facilityBooking.models';
import { calculateFacilityBookingPrice, calculateQuoteDifferenceInMinorUnits } from '../services/facilityBookingCalculator';
import { calculateFacilityRefund } from '../services/facilityRefundCalculator';
import { resolveFacilityBookingActions } from '../services/facilityBookingActionResolver';
import { createFacilityBookingResidentScope } from '../services/facilityBookingScope';
import { validateFacilityBookingEligibility } from '../services/facilityBookingValidator';
import {
  FacilityBookingRepositoryError,
  type FacilityBookingRepository,
  type FacilitySocietyCancellationRequest,
} from '../data/facilityBooking.repositoryContract';
import {
  facilityBookingMockStore,
  type FacilityBookingMockState,
} from '../state/facilityBookingMockStore';

const HOLD_DURATION_MS = 8 * 60_000;
const QUOTE_DURATION_MS = 10 * 60_000;

function nowIso(): string {
  return new Date().toISOString();
}

function identifier(prefix: string): string {
  return `${prefix}-${Crypto.randomUUID()}`;
}

function scopeForResidence(residenceId: string) {
  const home = mockResidentHomeContexts.find((context) => context.homeContextId === residenceId);
  if (!home) {
    throw new FacilityBookingRepositoryError('RESIDENCE_NOT_FOUND', 'The active residence could not be resolved.');
  }
  return createFacilityBookingResidentScope(mapContextToActive(home));
}

function findFacility(state: FacilityBookingMockState, residenceId: string, facilityId: string): Facility {
  const scope = scopeForResidence(residenceId);
  const facility = state.facilities.find((item) => item.id === facilityId && item.societyId === scope.societyId);
  if (!facility) {
    throw new FacilityBookingRepositoryError('FACILITY_NOT_FOUND', 'This facility is not available for the active residence.');
  }
  return facility;
}

function findSlot(state: FacilityBookingMockState, facilityId: string, slotId: string): FacilitySlot {
  const slot = state.slots.find((item) => item.id === slotId && item.facilityId === facilityId);
  if (!slot) {
    throw new FacilityBookingRepositoryError('SLOT_NOT_FOUND', 'The selected facility slot could not be found.');
  }
  return slot;
}

function findBooking(state: FacilityBookingMockState, residenceId: string, bookingId: string): FacilityBooking {
  const booking = state.bookings.find((item) => item.id === bookingId && item.residenceId === residenceId);
  if (!booking) {
    throw new FacilityBookingRepositoryError('BOOKING_NOT_FOUND', 'This booking is not available for the active residence.');
  }
  return booking;
}

function updateSlot(
  slots: readonly FacilitySlot[],
  slotId: string,
  transform: (slot: FacilitySlot) => FacilitySlot,
): readonly FacilitySlot[] {
  return slots.map((slot) => slot.id === slotId ? transform(slot) : slot);
}

function replaceBooking(
  bookings: readonly FacilityBooking[],
  nextBooking: FacilityBooking,
): readonly FacilityBooking[] {
  return bookings.map((booking) => booking.id === nextBooking.id ? nextBooking : booking);
}

function activeBookingStatuses(): readonly FacilityBookingStatus[] {
  return [
    FacilityBookingStatus.PaymentPending,
    FacilityBookingStatus.Confirmed,
    FacilityBookingStatus.CheckedIn,
    FacilityBookingStatus.InUse,
  ];
}

function createQrPass(bookingReference: string, startsAt: string, facilityLocation: string): FacilityBookingQrPass {
  const token = Crypto.randomUUID();
  return {
    token,
    fallbackCode: token.replaceAll('-', '').slice(0, 8).toUpperCase(),
    validFrom: new Date(Date.parse(startsAt) - 15 * 60_000).toISOString(),
    validUntil: new Date(Date.parse(startsAt) + 30 * 60_000).toISOString(),
    presentationLocation: facilityLocation,
    active: true,
  };
}

function createActivity(
  residenceId: string,
  title: string,
  description: string,
  occurredAt: string,
): FacilityActivityItem {
  return { id: identifier('facility-activity'), residenceId, title, description, occurredAt };
}

function createNotification(
  residenceId: string,
  title: string,
  description: string,
  createdAt: string,
  highPriority: boolean,
): FacilityNotificationItem {
  return {
    id: identifier('facility-notification'),
    residenceId,
    title,
    description,
    createdAt,
    highPriority,
    read: false,
  };
}

function bookingFilterMatches(booking: FacilityBooking, filter: FacilityBookingFilter): boolean {
  if (filter === FacilityBookingFilter.Upcoming) {
    return [
      FacilityBookingStatus.PaymentPending,
      FacilityBookingStatus.Confirmed,
      FacilityBookingStatus.CheckedIn,
      FacilityBookingStatus.InUse,
    ].includes(booking.status);
  }
  if (filter === FacilityBookingFilter.Past) {
    return [FacilityBookingStatus.Completed, FacilityBookingStatus.NoShow].includes(booking.status);
  }
  if (filter === FacilityBookingFilter.Cancelled) {
    return [
      FacilityBookingStatus.CancelledByResident,
      FacilityBookingStatus.CancelledBySociety,
      FacilityBookingStatus.Rejected,
      FacilityBookingStatus.Expired,
      FacilityBookingStatus.RefundPending,
      FacilityBookingStatus.Refunded,
      FacilityBookingStatus.PartiallyRefunded,
    ].includes(booking.status);
  }
  return booking.status === FacilityBookingStatus.Waitlisted;
}

function facilityFilterMatches(item: Facility, filter: FacilityDiscoveryFilter): boolean {
  if (filter === FacilityDiscoveryFilter.All) return true;
  if (filter === FacilityDiscoveryFilter.AvailableToday) {
    return [FacilityAvailabilityStatus.Available, FacilityAvailabilityStatus.LimitedSlots].includes(item.availabilityStatus);
  }
  if (filter === FacilityDiscoveryFilter.Sports) return item.category === FacilityCategory.Sports;
  if (filter === FacilityDiscoveryFilter.Events) return [FacilityCategory.Clubhouse, FacilityCategory.EventSpace].includes(item.category);
  if (filter === FacilityDiscoveryFilter.Fitness) return item.category === FacilityCategory.Fitness;
  if (filter === FacilityDiscoveryFilter.GuestStay) return item.category === FacilityCategory.GuestStay;
  return item.category === FacilityCategory.Outdoor;
}

function paginate<TItem>(items: readonly TItem[], cursor: string | null, pageSize: number): PaginatedResult<TItem> {
  const parsedOffset = cursor ? Number.parseInt(cursor, 10) : 0;
  const offset = Number.isFinite(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;
  const normalizedPageSize = Math.max(1, Math.min(pageSize, 50));
  const page = items.slice(offset, offset + normalizedPageSize);
  const nextOffset = offset + page.length;
  return {
    items: page,
    nextCursor: nextOffset < items.length ? String(nextOffset) : null,
    totalCount: items.length,
  };
}

async function expireStaleHolds(now: string): Promise<void> {
  const state = facilityBookingMockStore.getState();
  const expired = state.holds.filter((hold) => Date.parse(hold.expiresAt) <= Date.parse(now));
  if (expired.length === 0) return;
  const expiredIds = new Set(expired.map((hold) => hold.id));
  const expiredSlotIds = new Set(expired.map((hold) => hold.slotId));
  const bookings = state.bookings.map((booking) => {
    if (booking.status !== FacilityBookingStatus.PaymentPending || !expiredIds.has(booking.quote.holdId)) return booking;
    return {
      ...booking,
      status: FacilityBookingStatus.Expired,
      payment: { ...booking.payment, status: FacilityPaymentStatus.Failed },
      updatedAt: now,
      timeline: [
        ...booking.timeline,
        { id: identifier('timeline'), title: 'Reservation expired', description: 'The payment window ended before confirmation.', occurredAt: now, completed: true },
      ],
    };
  });
  const slots = state.slots.map((slot) => expiredSlotIds.has(slot.id) && slot.status === FacilitySlotStatus.Held
    ? { ...slot, status: FacilitySlotStatus.Available, heldByResidenceId: null, holdExpiresAt: null }
    : slot);
  await facilityBookingMockStore.setState({
    ...state,
    slots,
    holds: state.holds.filter((hold) => !expiredIds.has(hold.id)),
    bookings,
  });
}

async function offerReleasedSlotToWaitlist(
  state: FacilityBookingMockState,
  slotId: string,
  releasedAt: string,
): Promise<FacilityBookingMockState> {
  const candidates = state.waitlist
    .filter((entry) => entry.slotId === slotId && Date.parse(entry.expiresAt) > Date.parse(releasedAt))
    .sort((left, right) => left.position - right.position);
  const candidate = candidates[0];
  if (!candidate) return state;
  const hold: FacilitySlotHold = {
    id: identifier('waitlist-hold'),
    societyId: candidate.societyId,
    residenceId: candidate.residenceId,
    unitId: candidate.unitId,
    facilityId: candidate.facilityId,
    slotId: candidate.slotId,
    createdAt: releasedAt,
    expiresAt: new Date(Date.parse(releasedAt) + HOLD_DURATION_MS).toISOString(),
  };
  return {
    ...state,
    slots: updateSlot(state.slots, slotId, (slot) => ({
      ...slot,
      status: FacilitySlotStatus.Held,
      heldByResidenceId: candidate.residenceId,
      holdExpiresAt: hold.expiresAt,
    })),
    holds: [hold, ...state.holds],
    waitlist: state.waitlist.map((entry) => entry.id === candidate.id
      ? { ...entry, offeredHoldId: hold.id }
      : entry),
    notifications: [
      createNotification(candidate.residenceId, 'A facility slot is available', 'Confirm the offered slot before the temporary hold expires.', releasedAt, true),
      ...state.notifications,
    ],
  };
}

export const facilityBookingMockRepository: FacilityBookingRepository = {
  initialize: () => facilityBookingMockStore.initialize(),
  subscribe: (listener) => facilityBookingMockStore.subscribe(listener),

  async getFacilities(request: GetFacilitiesRequest): Promise<PaginatedResult<Facility>> {
    await this.initialize();
    const scope = scopeForResidence(request.residenceId);
    if (scope.societyId !== request.societyId) {
      throw new FacilityBookingRepositoryError('RESIDENCE_SCOPE_CHANGED', 'The active residence changed. Refresh facilities to continue.');
    }
    const normalizedQuery = request.query.trim().toLocaleLowerCase(scope.locale);
    const facilities = facilityBookingMockStore.getState().facilities
      .filter((item) => item.societyId === request.societyId)
      .filter((item) => facilityFilterMatches(item, request.filter))
      .filter((item) => {
        if (!normalizedQuery) return true;
        return [
          item.name,
          item.category,
          item.locationName,
          item.floorOrZone,
          ...item.amenities.map((amenity) => amenity.name),
        ].some((value) => value.toLocaleLowerCase(scope.locale).includes(normalizedQuery));
      });
    return paginate(facilities, request.cursor, request.pageSize);
  },

  async getFacilityById(residenceId: string, facilityId: string): Promise<Facility> {
    await this.initialize();
    return findFacility(facilityBookingMockStore.getState(), residenceId, facilityId);
  },

  async getAvailability(request: GetFacilityAvailabilityRequest): Promise<FacilityAvailabilityResult> {
    await this.initialize();
    await expireStaleHolds(nowIso());
    const state = facilityBookingMockStore.getState();
    const facility = findFacility(state, request.residenceId, request.facilityId);
    if (facility.societyId !== request.societyId) {
      throw new FacilityBookingRepositoryError('WRONG_SOCIETY', 'This facility belongs to a different society.');
    }
    const start = Date.parse(request.startDate);
    const end = Date.parse(request.endDate);
    const slots = state.slots
      .filter((slot) => slot.facilityId === request.facilityId)
      .filter((slot) => Date.parse(slot.startsAt) >= start && Date.parse(slot.startsAt) <= end)
      .map((slot) => ({ ...slot, residenceId: request.residenceId }));
    return {
      facilityId: request.facilityId,
      timezone: facility.timezone,
      startDate: request.startDate,
      endDate: request.endDate,
      slots,
    };
  },

  async checkEligibility(request: CheckFacilityBookingEligibilityRequest): Promise<FacilityBookingEligibilityResult> {
    await this.initialize();
    await expireStaleHolds(nowIso());
    const state = facilityBookingMockStore.getState();
    const scope = scopeForResidence(request.residenceId);
    const facility = findFacility(state, request.residenceId, request.facilityId);
    const slot = request.slotId ? findSlot(state, request.facilityId, request.slotId) : null;
    return validateFacilityBookingEligibility({
      scope,
      facility,
      slot,
      existingBookings: state.bookings,
      guestCount: request.guestCount,
      consentAccepted: request.consentAccepted,
      paymentMethodAvailable: request.paymentMethodAvailable,
      nowIso: nowIso(),
    });
  },

  async holdSlot(request: HoldFacilitySlotRequest): Promise<FacilitySlotHold> {
    await this.initialize();
    const createdAt = nowIso();
    await expireStaleHolds(createdAt);
    const state = facilityBookingMockStore.getState();
    const facility = findFacility(state, request.residenceId, request.facilityId);
    if (facility.societyId !== request.societyId) {
      throw new FacilityBookingRepositoryError('WRONG_SOCIETY', 'This slot belongs to a different society.');
    }
    const slot = findSlot(state, request.facilityId, request.slotId);
    const existing = state.holds.find((hold) => hold.slotId === slot.id && hold.residenceId === request.residenceId);
    if (existing && Date.parse(existing.expiresAt) > Date.parse(createdAt)) return existing;
    if (![FacilitySlotStatus.Available, FacilitySlotStatus.Limited].includes(slot.status)) {
      throw new FacilityBookingRepositoryError('SLOT_UNAVAILABLE', 'Another resident reserved this slot. Please select a different time.');
    }
    const hold: FacilitySlotHold = {
      id: identifier('facility-hold'),
      societyId: request.societyId,
      residenceId: request.residenceId,
      unitId: request.unitId,
      facilityId: request.facilityId,
      slotId: request.slotId,
      createdAt,
      expiresAt: new Date(Date.parse(createdAt) + HOLD_DURATION_MS).toISOString(),
    };
    const otherResidenceHoldIds = new Set(
      state.holds.filter((item) => item.residenceId === request.residenceId).map((item) => item.id),
    );
    const otherResidenceSlotIds = new Set(
      state.holds.filter((item) => item.residenceId === request.residenceId).map((item) => item.slotId),
    );
    const slots = state.slots.map((item) => {
      if (item.id === request.slotId) {
        return { ...item, status: FacilitySlotStatus.Held, heldByResidenceId: request.residenceId, holdExpiresAt: hold.expiresAt };
      }
      if (otherResidenceSlotIds.has(item.id) && item.status === FacilitySlotStatus.Held) {
        return { ...item, status: FacilitySlotStatus.Available, heldByResidenceId: null, holdExpiresAt: null };
      }
      return item;
    });
    await facilityBookingMockStore.setState({
      ...state,
      slots,
      holds: [hold, ...state.holds.filter((item) => !otherResidenceHoldIds.has(item.id))],
    });
    return hold;
  },

  async releaseSlot(request: ReleaseFacilitySlotRequest): Promise<void> {
    await this.initialize();
    const state = facilityBookingMockStore.getState();
    const hold = state.holds.find((item) => item.id === request.holdId && item.residenceId === request.residenceId);
    if (!hold) return;
    const releasedAt = nowIso();
    let nextState: FacilityBookingMockState = {
      ...state,
      slots: updateSlot(state.slots, hold.slotId, (slot) => ({ ...slot, status: FacilitySlotStatus.Available, heldByResidenceId: null, holdExpiresAt: null })),
      holds: state.holds.filter((item) => item.id !== hold.id),
    };
    nextState = await offerReleasedSlotToWaitlist(nextState, hold.slotId, releasedAt);
    await facilityBookingMockStore.setState(nextState);
  },

  async getSlotHold(residenceId: string, holdId: string): Promise<FacilitySlotHold | null> {
    await this.initialize();
    await expireStaleHolds(nowIso());
    return facilityBookingMockStore.getState().holds.find((hold) => hold.id === holdId && hold.residenceId === residenceId) ?? null;
  },

  async createQuote(request: CreateFacilityBookingQuoteRequest): Promise<FacilityBookingQuote> {
    await this.initialize();
    await expireStaleHolds(nowIso());
    const state = facilityBookingMockStore.getState();
    const hold = state.holds.find((item) => item.id === request.holdId && item.residenceId === request.residenceId);
    if (!hold) {
      throw new FacilityBookingRepositoryError('HOLD_EXPIRED', 'Your selected slot is no longer reserved. Please select another available slot.');
    }
    const facility = findFacility(state, request.residenceId, request.facilityId);
    const slot = findSlot(state, request.facilityId, request.slotId);
    const createdAt = nowIso();
    const quote: FacilityBookingQuote = {
      id: identifier('facility-quote'),
      residenceId: request.residenceId,
      facilityId: request.facilityId,
      slotId: request.slotId,
      holdId: request.holdId,
      breakdown: calculateFacilityBookingPrice({
        facility,
        slot,
        guestCount: request.guestCount,
        setupSelections: request.setupSelections,
        discountInMinorUnits: request.discountInMinorUnits,
      }),
      currencyCode: facility.currencyCode,
      createdAt,
      expiresAt: new Date(Date.parse(createdAt) + QUOTE_DURATION_MS).toISOString(),
    };
    await facilityBookingMockStore.setState({ ...state, quotes: [quote, ...state.quotes] });
    return quote;
  },

  async createBooking(request: CreateFacilityBookingRequest): Promise<FacilityBooking> {
    await this.initialize();
    const existingState = facilityBookingMockStore.getState();
    const existingId = existingState.idempotencyBookingIds[request.idempotencyKey];
    if (existingId) return findBooking(existingState, request.residenceId, existingId);
    const createdAt = nowIso();
    await expireStaleHolds(createdAt);
    const state = facilityBookingMockStore.getState();
    const scope = scopeForResidence(request.residenceId);
    if (scope.userId !== request.userId || scope.societyId !== request.societyId || scope.unitId !== request.unitId) {
      throw new FacilityBookingRepositoryError('RESIDENCE_SCOPE_CHANGED', 'The active residence changed before confirmation. Review the booking again.');
    }
    const facility = findFacility(state, request.residenceId, request.facilityId);
    const slot = findSlot(state, request.facilityId, request.slotId);
    const hold = state.holds.find((item) => item.id === request.holdId && item.residenceId === request.residenceId && item.slotId === request.slotId);
    const quote = state.quotes.find((item) => item.id === request.quoteId && item.holdId === request.holdId);
    if (!hold || Date.parse(hold.expiresAt) <= Date.parse(createdAt)) {
      throw new FacilityBookingRepositoryError('HOLD_EXPIRED', 'Your selected slot is no longer reserved. Please select another available slot.');
    }
    if (!quote || Date.parse(quote.expiresAt) <= Date.parse(createdAt)) {
      throw new FacilityBookingRepositoryError('QUOTE_EXPIRED', 'The price quote expired. Review the current charges before confirming.');
    }
    const eligibility = validateFacilityBookingEligibility({
      scope,
      facility,
      slot: { ...slot, status: FacilitySlotStatus.Available },
      existingBookings: state.bookings,
      guestCount: request.guestCount,
      consentAccepted: request.consentAccepted,
      paymentMethodAvailable: true,
      nowIso: createdAt,
    });
    if (!eligibility.eligible) {
      throw new FacilityBookingRepositoryError('BOOKING_INELIGIBLE', eligibility.blockingReasons[0]?.message ?? 'This booking is not eligible for confirmation.');
    }
    const requiresPayment = quote.breakdown.totalPayableInMinorUnits > 0;
    const status = requiresPayment ? FacilityBookingStatus.PaymentPending : FacilityBookingStatus.Confirmed;
    const payment: FacilityBookingPayment = {
      status: requiresPayment ? FacilityPaymentStatus.Pending : FacilityPaymentStatus.NotRequired,
      method: null,
      transactionId: null,
      receiptNumber: null,
      paidAt: null,
      amountPaidInMinorUnits: 0,
    };
    const referenceSuffix = String(state.bookings.length + 1).padStart(3, '0');
    const bookingReference = `FB-${scope.societyId.replace('society-', '').toUpperCase()}-${referenceSuffix}`;
    const booking: FacilityBooking = {
      id: identifier('facility-booking'),
      bookingReference,
      userId: scope.userId,
      societyId: scope.societyId,
      residenceId: scope.residenceId,
      unitId: scope.unitId,
      unitLabel: scope.unitLabel,
      facilityId: facility.id,
      facilityName: facility.name,
      facilityLocation: `${facility.locationName} · ${facility.floorOrZone}`,
      residentName: scope.residentName,
      contactNumber: request.contactNumber,
      startsAt: slot.startsAt,
      endsAt: slot.endsAt,
      timezone: facility.timezone,
      status,
      guestCount: request.guestCount,
      purpose: request.purpose.trim(),
      additionalInstructions: request.additionalInstructions.trim(),
      guestDetails: request.guestDetails,
      setupSelections: request.setupSelections,
      consentAccepted: request.consentAccepted,
      acceptedRuleIds: request.acceptedRuleIds,
      quote,
      payment,
      refund: {
        status: FacilityRefundStatus.NotApplicable,
        amountInMinorUnits: 0,
        requestedAt: null,
        processedAt: null,
        referenceNumber: null,
        explanation: 'No refund is currently required.',
      },
      qrPass: requiresPayment || facility.checkInMode !== FacilityCheckInMode.Qr
        ? null
        : createQrPass(bookingReference, slot.startsAt, `${facility.locationName} desk`),
      timeline: [
        { id: identifier('timeline'), title: 'Booking submitted', description: requiresPayment ? 'Payment is required to confirm this reservation.' : 'The reservation was confirmed without payment.', occurredAt: createdAt, completed: true },
      ],
      rescheduleHistory: [],
      cancellationReason: null,
      cancellationNotes: null,
      cancelledAt: null,
      societyCancellationReason: null,
      calendarEventId: null,
      createdAt,
      updatedAt: createdAt,
    };
    const slotConsumed = !requiresPayment;
    const nextState: FacilityBookingMockState = {
      ...state,
      bookings: [booking, ...state.bookings],
      slots: slotConsumed
        ? updateSlot(state.slots, slot.id, (item) => ({ ...item, status: FacilitySlotStatus.Full, remainingCapacity: 0, heldByResidenceId: null, holdExpiresAt: null }))
        : state.slots,
      holds: slotConsumed ? state.holds.filter((item) => item.id !== hold.id) : state.holds,
      idempotencyBookingIds: { ...state.idempotencyBookingIds, [request.idempotencyKey]: booking.id },
      activities: [createActivity(scope.residenceId, requiresPayment ? 'Booking awaiting payment' : 'Booking confirmed', `${facility.name} · ${scope.unitLabel}`, createdAt), ...state.activities],
      notifications: [createNotification(scope.residenceId, requiresPayment ? 'Complete facility payment' : 'Facility booking confirmed', requiresPayment ? 'Pay before the slot hold expires to keep this reservation.' : `${facility.name} is reserved for ${scope.unitLabel}.`, createdAt, requiresPayment), ...state.notifications],
    };
    await facilityBookingMockStore.setState(nextState);
    return booking;
  },

  async payBooking(request: PayFacilityBookingRequest): Promise<FacilityBooking> {
    await this.initialize();
    const initialState = facilityBookingMockStore.getState();
    const existingId = initialState.idempotencyPaymentIds[request.idempotencyKey];
    if (existingId) return findBooking(initialState, request.residenceId, existingId);
    const paidAt = nowIso();
    await expireStaleHolds(paidAt);
    const state = facilityBookingMockStore.getState();
    const booking = findBooking(state, request.residenceId, request.bookingId);
    if (booking.status !== FacilityBookingStatus.PaymentPending) {
      throw new FacilityBookingRepositoryError('PAYMENT_NOT_ALLOWED', 'This booking is not awaiting payment.');
    }
    if (request.simulateFailure) {
      const failedBooking: FacilityBooking = {
        ...booking,
        payment: { ...booking.payment, status: FacilityPaymentStatus.Failed, method: request.paymentMethod },
        updatedAt: paidAt,
        timeline: [...booking.timeline, { id: identifier('timeline'), title: 'Payment unsuccessful', description: 'The reservation remains available while the slot hold is active.', occurredAt: paidAt, completed: true }],
      };
      await facilityBookingMockStore.setState({ ...state, bookings: replaceBooking(state.bookings, failedBooking) });
      return failedBooking;
    }
    const hold = state.holds.find((item) => item.id === booking.quote.holdId && item.residenceId === request.residenceId);
    if (!hold) {
      throw new FacilityBookingRepositoryError('HOLD_EXPIRED', 'The slot hold expired before payment completed. No booking was confirmed.');
    }
    const facility = findFacility(state, request.residenceId, booking.facilityId);
    const payment: FacilityBookingPayment = {
      status: FacilityPaymentStatus.Paid,
      method: request.paymentMethod,
      transactionId: `TXN-${Crypto.randomUUID().slice(0, 12).toUpperCase()}`,
      receiptNumber: `RCP-${Crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      paidAt,
      amountPaidInMinorUnits: booking.quote.breakdown.totalPayableInMinorUnits,
    };
    const confirmed: FacilityBooking = {
      ...booking,
      status: FacilityBookingStatus.Confirmed,
      payment,
      qrPass: facility.checkInMode === FacilityCheckInMode.Qr
        ? createQrPass(booking.bookingReference, booking.startsAt, `${facility.locationName} desk`)
        : null,
      updatedAt: paidAt,
      timeline: [...booking.timeline, { id: identifier('timeline'), title: 'Payment completed', description: 'Payment was captured and the booking is confirmed.', occurredAt: paidAt, completed: true }],
    };
    await facilityBookingMockStore.setState({
      ...state,
      bookings: replaceBooking(state.bookings, confirmed),
      slots: updateSlot(state.slots, hold.slotId, (slot) => ({ ...slot, status: FacilitySlotStatus.Full, remainingCapacity: 0, heldByResidenceId: null, holdExpiresAt: null })),
      holds: state.holds.filter((item) => item.id !== hold.id),
      idempotencyPaymentIds: { ...state.idempotencyPaymentIds, [request.idempotencyKey]: confirmed.id },
      activities: [createActivity(request.residenceId, 'Payment completed', `${booking.facilityName} is confirmed.`, paidAt), ...state.activities],
      notifications: [createNotification(request.residenceId, 'Facility booking confirmed', `${booking.facilityName} is ready.`, paidAt, false), ...state.notifications],
    });
    return confirmed;
  },

  async getBookings(request: GetFacilityBookingsRequest): Promise<PaginatedResult<FacilityBooking>> {
    await this.initialize();
    await this.synchronizeLifecycle(nowIso());
    const bookings = facilityBookingMockStore.getState().bookings
      .filter((booking) => booking.societyId === request.societyId && booking.residenceId === request.residenceId && booking.unitId === request.unitId)
      .filter((booking) => bookingFilterMatches(booking, request.filter))
      .sort((left, right) => Date.parse(right.startsAt) - Date.parse(left.startsAt));
    return paginate(bookings, request.cursor, request.pageSize);
  },

  async getBookingById(residenceId: string, bookingId: string): Promise<FacilityBooking> {
    await this.initialize();
    await this.synchronizeLifecycle(nowIso());
    return findBooking(facilityBookingMockStore.getState(), residenceId, bookingId);
  },

  async cancelBooking(request: CancelFacilityBookingRequest): Promise<CancelFacilityBookingResult> {
    await this.initialize();
    const cancelledAt = nowIso();
    const state = facilityBookingMockStore.getState();
    const booking = findBooking(state, request.residenceId, request.bookingId);
    const facility = findFacility(state, request.residenceId, booking.facilityId);
    const actions = resolveFacilityBookingActions(booking, facility, cancelledAt);
    if (!actions.canCancel) {
      throw new FacilityBookingRepositoryError('CANCELLATION_NOT_ALLOWED', 'This booking can no longer be cancelled under the facility policy.');
    }
    const refund = calculateFacilityRefund({ booking, cancellationPolicy: facility.cancellationPolicy, cancelledAt, cancelledBySociety: false });
    const nextStatus = refund.status === FacilityRefundStatus.Pending
      ? FacilityBookingStatus.RefundPending
      : FacilityBookingStatus.CancelledByResident;
    const cancelled: FacilityBooking = {
      ...booking,
      status: nextStatus,
      refund,
      qrPass: booking.qrPass ? { ...booking.qrPass, active: false } : null,
      cancellationReason: request.reason,
      cancellationNotes: request.notes.trim() || null,
      cancelledAt,
      updatedAt: cancelledAt,
      timeline: [...booking.timeline, { id: identifier('timeline'), title: 'Booking cancelled', description: refund.explanation, occurredAt: cancelledAt, completed: true }],
    };
    let nextState: FacilityBookingMockState = {
      ...state,
      bookings: replaceBooking(state.bookings, cancelled),
      slots: updateSlot(state.slots, booking.quote.slotId, (slot) => ({ ...slot, status: FacilitySlotStatus.Available, remainingCapacity: facility.capacity, heldByResidenceId: null, holdExpiresAt: null })),
      holds: state.holds.filter((hold) => hold.id !== booking.quote.holdId),
      activities: [createActivity(request.residenceId, 'Booking cancelled', refund.explanation, cancelledAt), ...state.activities],
      notifications: [createNotification(request.residenceId, 'Facility booking cancelled', refund.amountInMinorUnits > 0 ? 'Your eligible refund is being processed.' : 'The facility slot has been released.', cancelledAt, false), ...state.notifications],
    };
    nextState = await offerReleasedSlotToWaitlist(nextState, booking.quote.slotId, cancelledAt);
    await facilityBookingMockStore.setState(nextState);
    return { booking: cancelled, refund };
  },

  async rescheduleBooking(request: RescheduleFacilityBookingRequest): Promise<FacilityBooking> {
    await this.initialize();
    const changedAt = nowIso();
    await expireStaleHolds(changedAt);
    const state = facilityBookingMockStore.getState();
    const booking = findBooking(state, request.residenceId, request.bookingId);
    const facility = findFacility(state, request.residenceId, booking.facilityId);
    const actions = resolveFacilityBookingActions(booking, facility, changedAt);
    if (!actions.canReschedule) {
      throw new FacilityBookingRepositoryError('RESCHEDULE_NOT_ALLOWED', 'This booking is outside the rescheduling window.');
    }
    const hold = state.holds.find((item) => item.id === request.newHoldId && item.slotId === request.newSlotId && item.residenceId === request.residenceId);
    if (!hold) {
      throw new FacilityBookingRepositoryError('HOLD_EXPIRED', 'The new slot hold expired. Your original booking remains unchanged.');
    }
    const newSlot = findSlot(state, booking.facilityId, request.newSlotId);
    const nextBreakdown = calculateFacilityBookingPrice({
      facility,
      slot: newSlot,
      guestCount: booking.guestCount,
      setupSelections: booking.setupSelections,
      discountInMinorUnits: booking.quote.breakdown.discountInMinorUnits,
    });
    const difference = calculateQuoteDifferenceInMinorUnits(booking.quote.breakdown, nextBreakdown);
    const nextQuote: FacilityBookingQuote = {
      id: identifier('reschedule-quote'),
      residenceId: booking.residenceId,
      facilityId: booking.facilityId,
      slotId: newSlot.id,
      holdId: hold.id,
      breakdown: nextBreakdown,
      currencyCode: booking.quote.currencyCode,
      createdAt: changedAt,
      expiresAt: new Date(Date.parse(changedAt) + QUOTE_DURATION_MS).toISOString(),
    };
    const additionalPayment = difference > 0;
    const refund = difference < 0
      ? { ...booking.refund, status: FacilityRefundStatus.Pending, amountInMinorUnits: Math.abs(difference), requestedAt: changedAt, explanation: 'The lower-priced slot created a refundable difference.' }
      : booking.refund;
    const rescheduled: FacilityBooking = {
      ...booking,
      startsAt: newSlot.startsAt,
      endsAt: newSlot.endsAt,
      status: additionalPayment ? FacilityBookingStatus.PaymentPending : FacilityBookingStatus.Confirmed,
      quote: nextQuote,
      payment: additionalPayment ? { ...booking.payment, status: FacilityPaymentStatus.Pending } : booking.payment,
      refund,
      qrPass: additionalPayment || facility.checkInMode !== FacilityCheckInMode.Qr
        ? null
        : createQrPass(booking.bookingReference, newSlot.startsAt, `${facility.locationName} desk`),
      rescheduleHistory: [...booking.rescheduleHistory, {
        id: identifier('reschedule'),
        previousSlotId: booking.quote.slotId,
        nextSlotId: newSlot.id,
        previousStartsAt: booking.startsAt,
        nextStartsAt: newSlot.startsAt,
        changedAt,
        priceDifferenceInMinorUnits: difference,
      }],
      timeline: [...booking.timeline, { id: identifier('timeline'), title: 'Booking rescheduled', description: additionalPayment ? 'The new slot is held while the price difference is paid.' : 'The new facility slot is confirmed.', occurredAt: changedAt, completed: true }],
      updatedAt: changedAt,
    };
    await facilityBookingMockStore.setState({
      ...state,
      quotes: [nextQuote, ...state.quotes],
      bookings: replaceBooking(state.bookings, rescheduled),
      slots: state.slots.map((slot) => {
        if (slot.id === booking.quote.slotId) return { ...slot, status: FacilitySlotStatus.Available, remainingCapacity: facility.capacity, heldByResidenceId: null, holdExpiresAt: null };
        if (slot.id === newSlot.id && !additionalPayment) return { ...slot, status: FacilitySlotStatus.Full, remainingCapacity: 0, heldByResidenceId: null, holdExpiresAt: null };
        return slot;
      }),
      holds: additionalPayment ? state.holds : state.holds.filter((item) => item.id !== hold.id),
      activities: [createActivity(request.residenceId, 'Booking rescheduled', `${facility.name} moved to the selected time.`, changedAt), ...state.activities],
      notifications: [createNotification(request.residenceId, additionalPayment ? 'Complete reschedule payment' : 'Booking rescheduled', additionalPayment ? 'Pay the price difference before the new slot hold expires.' : 'Your booking and check-in pass were updated.', changedAt, additionalPayment), ...state.notifications],
    });
    return rescheduled;
  },

  async joinWaitlist(request: JoinFacilityWaitlistRequest): Promise<FacilityWaitlistEntry> {
    await this.initialize();
    const state = facilityBookingMockStore.getState();
    const facility = findFacility(state, request.residenceId, request.facilityId);
    const slot = findSlot(state, request.facilityId, request.slotId);
    if (!facility.waitlistEnabled || ![FacilitySlotStatus.Full, FacilitySlotStatus.Held].includes(slot.status)) {
      throw new FacilityBookingRepositoryError('WAITLIST_NOT_AVAILABLE', 'The waitlist is not available for this slot.');
    }
    const existing = state.waitlist.find((entry) => entry.residenceId === request.residenceId && entry.slotId === request.slotId);
    if (existing) return existing;
    const joinedAt = nowIso();
    const position = state.waitlist.filter((entry) => entry.slotId === request.slotId).length + 1;
    const entry: FacilityWaitlistEntry = {
      id: identifier('facility-waitlist'),
      userId: scopeForResidence(request.residenceId).userId,
      societyId: facility.societyId,
      residenceId: request.residenceId,
      unitId: request.unitId,
      facilityId: request.facilityId,
      slotId: request.slotId,
      position,
      joinedAt,
      expiresAt: new Date(Date.parse(slot.startsAt) - 60 * 60_000).toISOString(),
      offeredHoldId: null,
    };
    await facilityBookingMockStore.setState({
      ...state,
      waitlist: [...state.waitlist, entry],
      activities: [createActivity(request.residenceId, 'Joined facility waitlist', `${facility.name} · position ${position}`, joinedAt), ...state.activities],
      notifications: [createNotification(request.residenceId, 'Waitlist joined', `You are number ${position} in line for ${facility.name}.`, joinedAt, false), ...state.notifications],
    });
    return entry;
  },

  async leaveWaitlist(request: LeaveFacilityWaitlistRequest): Promise<void> {
    await this.initialize();
    const state = facilityBookingMockStore.getState();
    const entry = state.waitlist.find((item) => item.id === request.waitlistId && item.residenceId === request.residenceId);
    if (!entry) return;
    const leftAt = nowIso();
    await facilityBookingMockStore.setState({
      ...state,
      waitlist: state.waitlist
        .filter((item) => item.id !== entry.id)
        .map((item) => item.slotId === entry.slotId && item.position > entry.position ? { ...item, position: item.position - 1 } : item),
      activities: [createActivity(request.residenceId, 'Left facility waitlist', 'You will no longer receive an offer for this slot.', leftAt), ...state.activities],
    });
  },

  async getWaitlistEntry(residenceId: string, facilityId: string, slotId: string): Promise<FacilityWaitlistEntry | null> {
    await this.initialize();
    return facilityBookingMockStore.getState().waitlist.find((entry) => entry.residenceId === residenceId && entry.facilityId === facilityId && entry.slotId === slotId) ?? null;
  },

  async getWaitlistEntries(residenceId: string): Promise<readonly FacilityWaitlistEntry[]> {
    await this.initialize();
    return facilityBookingMockStore.getState().waitlist.filter((entry) => entry.residenceId === residenceId);
  },

  async checkIn(request: FacilityCheckInRequest): Promise<FacilityCheckInResult> {
    await this.initialize();
    const checkedAt = nowIso();
    const state = facilityBookingMockStore.getState();
    const booking = findBooking(state, request.residenceId, request.bookingId);
    if (booking.status !== FacilityBookingStatus.Confirmed || !booking.qrPass?.active) {
      return { code: FacilityCheckInResultCode.InvalidStatus, message: 'Check-in is not available for this booking status.', booking };
    }
    if (booking.qrPass.token !== request.token) {
      return { code: FacilityCheckInResultCode.InvalidToken, message: 'The check-in token is invalid or expired.', booking };
    }
    if (Date.parse(checkedAt) < Date.parse(booking.qrPass.validFrom)) {
      return { code: FacilityCheckInResultCode.TooEarly, message: 'Check-in is not open yet.', booking };
    }
    if (Date.parse(checkedAt) > Date.parse(booking.qrPass.validUntil)) {
      return { code: FacilityCheckInResultCode.TooLate, message: 'The digital check-in window has closed. Contact the facility desk.', booking };
    }
    const checkedIn: FacilityBooking = {
      ...booking,
      status: FacilityBookingStatus.CheckedIn,
      updatedAt: checkedAt,
      timeline: [...booking.timeline, { id: identifier('timeline'), title: 'Checked in', description: 'Facility access was recorded successfully.', occurredAt: checkedAt, completed: true }],
    };
    await facilityBookingMockStore.setState({
      ...state,
      bookings: replaceBooking(state.bookings, checkedIn),
      activities: [createActivity(request.residenceId, 'Facility check-in completed', booking.facilityName, checkedAt), ...state.activities],
    });
    return { code: FacilityCheckInResultCode.Success, message: 'Check-in completed successfully.', booking: checkedIn };
  },

  async updateCalendarLink(request: UpdateFacilityCalendarLinkRequest): Promise<FacilityBooking> {
    await this.initialize();
    const state = facilityBookingMockStore.getState();
    const booking = findBooking(state, request.residenceId, request.bookingId);
    const updated = { ...booking, calendarEventId: request.calendarEventId, updatedAt: nowIso() };
    await facilityBookingMockStore.setState({ ...state, bookings: replaceBooking(state.bookings, updated) });
    return updated;
  },

  async getDashboardSummary(residenceId: string): Promise<FacilityBookingDashboardSummary> {
    await this.initialize();
    await this.synchronizeLifecycle(nowIso());
    const state = facilityBookingMockStore.getState();
    const scopedBookings = state.bookings.filter((booking) => booking.residenceId === residenceId);
    const upcoming = scopedBookings
      .filter((booking) => activeBookingStatuses().includes(booking.status))
      .sort((left, right) => Date.parse(left.startsAt) - Date.parse(right.startsAt));
    return {
      upcomingCount: upcoming.length,
      waitlistCount: state.waitlist.filter((entry) => entry.residenceId === residenceId).length,
      refundPendingCount: scopedBookings.filter((booking) => booking.refund.status === FacilityRefundStatus.Pending || booking.refund.status === FacilityRefundStatus.Processing).length,
      nextBooking: upcoming[0] ?? null,
      recentActivity: state.activities.filter((activity) => activity.residenceId === residenceId).slice(0, 5),
      notifications: state.notifications.filter((notification) => notification.residenceId === residenceId).slice(0, 5),
    };
  },

  async cancelBySociety(request: FacilitySocietyCancellationRequest): Promise<CancelFacilityBookingResult> {
    await this.initialize();
    const cancelledAt = nowIso();
    const state = facilityBookingMockStore.getState();
    const booking = findBooking(state, request.residenceId, request.bookingId);
    const facility = findFacility(state, request.residenceId, booking.facilityId);
    const refund = calculateFacilityRefund({ booking, cancellationPolicy: facility.cancellationPolicy, cancelledAt, cancelledBySociety: true });
    const cancelled: FacilityBooking = {
      ...booking,
      status: FacilityBookingStatus.CancelledBySociety,
      refund,
      qrPass: booking.qrPass ? { ...booking.qrPass, active: false } : null,
      societyCancellationReason: request.reason,
      cancelledAt,
      updatedAt: cancelledAt,
      timeline: [...booking.timeline, { id: identifier('timeline'), title: 'Cancelled by society', description: request.reason, occurredAt: cancelledAt, completed: true }],
    };
    await facilityBookingMockStore.setState({
      ...state,
      bookings: replaceBooking(state.bookings, cancelled),
      slots: updateSlot(state.slots, booking.quote.slotId, (slot) => ({ ...slot, status: FacilitySlotStatus.Closed, remainingCapacity: 0, heldByResidenceId: null, holdExpiresAt: null })),
      activities: [createActivity(request.residenceId, 'Facility closure affected a booking', request.reason, cancelledAt), ...state.activities],
      notifications: [createNotification(request.residenceId, 'Society cancelled a facility booking', `${request.reason} Review your refund and alternate facilities.`, cancelledAt, true), ...state.notifications],
    });
    return { booking: cancelled, refund };
  },

  async synchronizeLifecycle(currentTime: string): Promise<void> {
    await this.initialize();
    await expireStaleHolds(currentTime);
    const state = facilityBookingMockStore.getState();
    let changed = false;
    const bookings = state.bookings.map((booking) => {
      if (booking.status === FacilityBookingStatus.CheckedIn && Date.parse(currentTime) > Date.parse(booking.endsAt)) {
        changed = true;
        return {
          ...booking,
          status: FacilityBookingStatus.Completed,
          qrPass: booking.qrPass ? { ...booking.qrPass, active: false } : null,
          updatedAt: currentTime,
          timeline: [...booking.timeline, { id: identifier('timeline'), title: 'Completed', description: 'The reserved facility time ended.', occurredAt: currentTime, completed: true }],
        };
      }
      if (booking.status === FacilityBookingStatus.Confirmed && booking.qrPass && Date.parse(currentTime) > Date.parse(booking.endsAt)) {
        changed = true;
        return {
          ...booking,
          status: FacilityBookingStatus.NoShow,
          qrPass: { ...booking.qrPass, active: false },
          updatedAt: currentTime,
          timeline: [...booking.timeline, { id: identifier('timeline'), title: 'No show', description: 'No valid check-in was recorded before the booking ended.', occurredAt: currentTime, completed: true }],
        };
      }
      return booking;
    });
    if (changed) await facilityBookingMockStore.setState({ ...state, bookings });
  },

  resetMockState: () => facilityBookingMockStore.reset(),
};
