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

export interface FacilitySocietyCancellationRequest {
  readonly residenceId: string;
  readonly bookingId: string;
  readonly reason: string;
}

export interface FacilityBookingRepository {
  initialize(): Promise<void>;
  subscribe(listener: () => void): () => void;
  getFacilities(request: GetFacilitiesRequest): Promise<PaginatedResult<Facility>>;
  getFacilityById(residenceId: string, facilityId: string): Promise<Facility>;
  getAvailability(request: GetFacilityAvailabilityRequest): Promise<FacilityAvailabilityResult>;
  checkEligibility(request: CheckFacilityBookingEligibilityRequest): Promise<FacilityBookingEligibilityResult>;
  holdSlot(request: HoldFacilitySlotRequest): Promise<FacilitySlotHold>;
  releaseSlot(request: ReleaseFacilitySlotRequest): Promise<void>;
  getSlotHold(residenceId: string, holdId: string): Promise<FacilitySlotHold | null>;
  createQuote(request: CreateFacilityBookingQuoteRequest): Promise<FacilityBookingQuote>;
  createBooking(request: CreateFacilityBookingRequest): Promise<FacilityBooking>;
  payBooking(request: PayFacilityBookingRequest): Promise<FacilityBooking>;
  getBookings(request: GetFacilityBookingsRequest): Promise<PaginatedResult<FacilityBooking>>;
  getBookingById(residenceId: string, bookingId: string): Promise<FacilityBooking>;
  cancelBooking(request: CancelFacilityBookingRequest): Promise<CancelFacilityBookingResult>;
  rescheduleBooking(request: RescheduleFacilityBookingRequest): Promise<FacilityBooking>;
  joinWaitlist(request: JoinFacilityWaitlistRequest): Promise<FacilityWaitlistEntry>;
  leaveWaitlist(request: LeaveFacilityWaitlistRequest): Promise<void>;
  getWaitlistEntry(residenceId: string, facilityId: string, slotId: string): Promise<FacilityWaitlistEntry | null>;
  getWaitlistEntries(residenceId: string): Promise<readonly FacilityWaitlistEntry[]>;
  checkIn(request: FacilityCheckInRequest): Promise<FacilityCheckInResult>;
  updateCalendarLink(request: UpdateFacilityCalendarLinkRequest): Promise<FacilityBooking>;
  getDashboardSummary(residenceId: string): Promise<FacilityBookingDashboardSummary>;
  cancelBySociety(request: FacilitySocietyCancellationRequest): Promise<CancelFacilityBookingResult>;
  synchronizeLifecycle(nowIso: string): Promise<void>;
  resetMockState(): Promise<void>;
}

export class FacilityBookingRepositoryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'FacilityBookingRepositoryError';
    this.code = code;
  }
}
