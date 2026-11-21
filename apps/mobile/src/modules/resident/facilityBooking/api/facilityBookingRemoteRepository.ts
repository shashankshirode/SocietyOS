import { apiClient } from '../../../../core/api/apiClient';
import type { JsonObject, JsonValue } from '../../../../core/api/api.types';
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
  FacilityAvailabilityResult,
  FacilityBooking,
  FacilityBookingDashboardSummary,
  FacilityBookingEligibilityResult,
  FacilityBookingQuote,
  FacilityCheckInResult,
  FacilitySlotHold,
  FacilityWaitlistEntry,
  PaginatedResult,
} from '../models/facilityBooking.models';
import {
  FacilityBookingRepositoryError,
  type FacilityBookingRepository,
  type FacilitySocietyCancellationRequest,
} from '../data/facilityBooking.repositoryContract';
import { facilityBookingEndpoints } from './facilityBookingEndpoints';

type RemoteRequest =
  | CancelFacilityBookingRequest
  | CheckFacilityBookingEligibilityRequest
  | CreateFacilityBookingQuoteRequest
  | CreateFacilityBookingRequest
  | FacilityCheckInRequest
  | HoldFacilitySlotRequest
  | JoinFacilityWaitlistRequest
  | LeaveFacilityWaitlistRequest
  | PayFacilityBookingRequest
  | ReleaseFacilitySlotRequest
  | RescheduleFacilityBookingRequest
  | UpdateFacilityCalendarLinkRequest;

function serializeRequest(request: RemoteRequest): JsonObject {
  const value: JsonValue = JSON.parse(JSON.stringify(request));
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    throw new FacilityBookingRepositoryError('INVALID_REQUEST', 'The booking request could not be prepared.');
  }
  return value;
}

export const facilityBookingRemoteRepository: FacilityBookingRepository = {
  async initialize(): Promise<void> {},
  subscribe(): () => void {
    return () => {};
  },
  async getFacilities(request: GetFacilitiesRequest): Promise<PaginatedResult<Facility>> {
    return apiClient.get(facilityBookingEndpoints.facilities(request.residenceId), {
      query: {
        societyId: request.societyId,
        query: request.query,
        filter: request.filter,
        cursor: request.cursor ?? undefined,
        pageSize: request.pageSize,
      },
    });
  },
  async getFacilityById(residenceId: string, facilityId: string): Promise<Facility> {
    return apiClient.get(facilityBookingEndpoints.facility(residenceId, facilityId));
  },
  async getAvailability(request: GetFacilityAvailabilityRequest): Promise<FacilityAvailabilityResult> {
    return apiClient.get(facilityBookingEndpoints.availability(request.residenceId, request.facilityId), {
      query: { startDate: request.startDate, endDate: request.endDate },
    });
  },
  async checkEligibility(request: CheckFacilityBookingEligibilityRequest): Promise<FacilityBookingEligibilityResult> {
    return apiClient.post(facilityBookingEndpoints.eligibility(request.residenceId, request.facilityId), serializeRequest(request));
  },
  async holdSlot(request: HoldFacilitySlotRequest): Promise<FacilitySlotHold> {
    return apiClient.post(facilityBookingEndpoints.slotHolds(request.residenceId, request.facilityId), serializeRequest(request));
  },
  async releaseSlot(request: ReleaseFacilitySlotRequest): Promise<void> {
    await apiClient.delete(facilityBookingEndpoints.slotHold(request.residenceId, request.holdId));
  },
  async getSlotHold(residenceId: string, holdId: string): Promise<FacilitySlotHold | null> {
    return apiClient.get(facilityBookingEndpoints.slotHold(residenceId, holdId));
  },
  async createQuote(request: CreateFacilityBookingQuoteRequest): Promise<FacilityBookingQuote> {
    return apiClient.post(facilityBookingEndpoints.quotes(request.residenceId), serializeRequest(request));
  },
  async createBooking(request: CreateFacilityBookingRequest): Promise<FacilityBooking> {
    return apiClient.post(facilityBookingEndpoints.bookings(request.residenceId), serializeRequest(request), { idempotencyKey: request.idempotencyKey });
  },
  async payBooking(request: PayFacilityBookingRequest): Promise<FacilityBooking> {
    return apiClient.post(facilityBookingEndpoints.payment(request.residenceId, request.bookingId), serializeRequest(request), { idempotencyKey: request.idempotencyKey });
  },
  async getBookings(request: GetFacilityBookingsRequest): Promise<PaginatedResult<FacilityBooking>> {
    return apiClient.get(facilityBookingEndpoints.bookings(request.residenceId), {
      query: {
        societyId: request.societyId,
        unitId: request.unitId,
        filter: request.filter,
        cursor: request.cursor ?? undefined,
        pageSize: request.pageSize,
      },
    });
  },
  async getBookingById(residenceId: string, bookingId: string): Promise<FacilityBooking> {
    return apiClient.get(facilityBookingEndpoints.booking(residenceId, bookingId));
  },
  async cancelBooking(request: CancelFacilityBookingRequest): Promise<CancelFacilityBookingResult> {
    return apiClient.post(facilityBookingEndpoints.cancel(request.residenceId, request.bookingId), serializeRequest(request), { idempotencyKey: request.idempotencyKey });
  },
  async rescheduleBooking(request: RescheduleFacilityBookingRequest): Promise<FacilityBooking> {
    return apiClient.post(facilityBookingEndpoints.reschedule(request.residenceId, request.bookingId), serializeRequest(request), { idempotencyKey: request.idempotencyKey });
  },
  async joinWaitlist(request: JoinFacilityWaitlistRequest): Promise<FacilityWaitlistEntry> {
    return apiClient.post(facilityBookingEndpoints.waitlist(request.residenceId, request.facilityId), serializeRequest(request));
  },
  async leaveWaitlist(request: LeaveFacilityWaitlistRequest): Promise<void> {
    await apiClient.delete(facilityBookingEndpoints.waitlistEntry(request.residenceId, request.waitlistId));
  },
  async getWaitlistEntry(residenceId: string, facilityId: string, slotId: string): Promise<FacilityWaitlistEntry | null> {
    const result = await apiClient.get<PaginatedResult<FacilityWaitlistEntry>>(facilityBookingEndpoints.waitlistEntries(residenceId), {
      query: { facilityId, slotId, pageSize: 1 },
    });
    return result.items[0] ?? null;
  },
  async getWaitlistEntries(residenceId: string): Promise<readonly FacilityWaitlistEntry[]> {
    const result = await apiClient.get<PaginatedResult<FacilityWaitlistEntry>>(facilityBookingEndpoints.waitlistEntries(residenceId), {
      query: { pageSize: 50 },
    });
    return result.items;
  },
  async checkIn(request: FacilityCheckInRequest): Promise<FacilityCheckInResult> {
    return apiClient.post(facilityBookingEndpoints.checkIn(request.residenceId, request.bookingId), serializeRequest(request), { idempotencyKey: request.idempotencyKey });
  },
  async updateCalendarLink(request: UpdateFacilityCalendarLinkRequest): Promise<FacilityBooking> {
    return apiClient.post(facilityBookingEndpoints.calendarLink(request.residenceId, request.bookingId), serializeRequest(request));
  },
  async getDashboardSummary(residenceId: string): Promise<FacilityBookingDashboardSummary> {
    return apiClient.get(facilityBookingEndpoints.dashboard(residenceId));
  },
  async cancelBySociety(request: FacilitySocietyCancellationRequest): Promise<CancelFacilityBookingResult> {
    throw new FacilityBookingRepositoryError('SOCIETY_ACTION_REQUIRED', `${request.bookingId}:${request.reason}`);
  },
  async synchronizeLifecycle(): Promise<void> {},
  async resetMockState(): Promise<void> {},
};
