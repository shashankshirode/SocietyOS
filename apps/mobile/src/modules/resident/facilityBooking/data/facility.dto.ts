import type { Facility, FacilityBlockedSlot, FacilityCalendarDay, FacilityRules, FacilitySlot } from '../../../../shared/types/facility.types';
import type {
  CancelFacilityBookingInput,
  CreateFacilityBookingInput,
  FacilityBooking,
  FacilityCheckInPass,
  FacilityDepositRefund,
  FacilityHome,
  FacilityUsageHistory,
  GuestRoomBookingInput,
  RescheduleFacilityBookingInput,
} from '../../../../shared/types/facilityBooking.types';
import { D, type Decoder } from '../../../../core/api/decoders';

export type FacilityDto = Facility;
export type FacilitySlotDto = FacilitySlot;
export type FacilityBookingDto = FacilityBooking;
export type FacilityHomeDto = FacilityHome;
export type FacilityRulesDto = FacilityRules;
export type FacilityBlockedSlotDto = FacilityBlockedSlot;
export type FacilityDepositRefundDto = FacilityDepositRefund;
export type FacilityCheckInPassDto = FacilityCheckInPass;
export type FacilityCalendarDayDto = FacilityCalendarDay;
export type FacilityUsageHistoryDto = FacilityUsageHistory;
export type CreateFacilityBookingRequestDto = CreateFacilityBookingInput;
export type CancelFacilityBookingRequestDto = CancelFacilityBookingInput;
export type RescheduleFacilityBookingRequestDto = RescheduleFacilityBookingInput;
export type GuestRoomBookingRequestDto = GuestRoomBookingInput;

export type FacilityListParams = {
  query?: string;
  filter?: string;
};

export type FacilityBookingListParams = {
  unitId?: string;
  status?: string;
  query?: string;
};

export const facilityDtoDecoder: Decoder<FacilityDto> = D.object({
  id: D.string,
  name: D.string,
  category: D.optional(D.string),
  status: D.optional(D.string),
  operatingHours: D.optional(D.string),
  societyId: D.optional(D.string),
  location: D.optional(D.string),
  capacity: D.optional(D.number),
  bookingType: D.optional(D.string),
  chargeAmount: D.optional(D.number),
  depositAmount: D.optional(D.number),
  approvalRequired: D.optional(D.boolean),
  durationOptions: D.optional(D.array(D.string)),
  cancellationPolicySummary: D.optional(D.string),
  rulesSummary: D.optional(D.string),
  amenitiesIncluded: D.optional(D.array(D.string)),
  allowedUserRoles: D.optional(D.array(D.string)),
  todayAvailabilityPreview: D.optional(D.string),
}) as unknown as Decoder<FacilityDto>;

export const facilityBookingDtoDecoder: Decoder<FacilityBookingDto> = D.object({
  id: D.string,
  bookingNumber: D.optional(D.string),
  facilityId: D.optional(D.string),
  facilityName: D.optional(D.string),
  date: D.optional(D.string),
  slot: D.optional(D.string),
  status: D.optional(D.string),
  unitId: D.optional(D.string),
  flatNumber: D.optional(D.string),
  residentName: D.optional(D.string),
  residentRole: D.optional(D.string),
  bookingType: D.optional(D.string),
  purpose: D.optional(D.string),
  guestCount: D.optional(D.number),
  chargeAmount: D.optional(D.number),
  depositAmount: D.optional(D.number),
  approvalRequired: D.optional(D.boolean),
  createdAt: D.optional(D.string),
}) as unknown as Decoder<FacilityBookingDto>;

export const facilityDtoListDecoder: Decoder<FacilityDto[]> = D.array(facilityDtoDecoder);
export const facilityBookingDtoListDecoder: Decoder<FacilityBookingDto[]> = D.array(facilityBookingDtoDecoder);
