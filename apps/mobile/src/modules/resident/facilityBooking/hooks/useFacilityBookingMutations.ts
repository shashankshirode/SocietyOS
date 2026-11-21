import { useCallback } from 'react';
import { facilityBookingRepository } from '../data/facilityBooking.repository';
import type {
  CancelFacilityBookingRequest,
  CreateFacilityBookingQuoteRequest,
  CreateFacilityBookingRequest,
  FacilityCheckInRequest,
  HoldFacilitySlotRequest,
  JoinFacilityWaitlistRequest,
  LeaveFacilityWaitlistRequest,
  PayFacilityBookingRequest,
  ReleaseFacilitySlotRequest,
  RescheduleFacilityBookingRequest,
  UpdateFacilityCalendarLinkRequest,
} from '../models/facilityBooking.requests';
import { useFacilityBookingMutation } from './useFacilityBookingMutation';

export function useHoldFacilitySlot() {
  const operation = useCallback(
    (request: HoldFacilitySlotRequest) => facilityBookingRepository.holdSlot(request),
    [],
  );
  return useFacilityBookingMutation(operation);
}

export function useReleaseFacilitySlot() {
  const operation = useCallback(async (request: ReleaseFacilitySlotRequest) => {
    await facilityBookingRepository.releaseSlot(request);
    return true;
  }, []);
  return useFacilityBookingMutation(operation);
}

export function useCreateFacilityQuote() {
  const operation = useCallback(
    (request: CreateFacilityBookingQuoteRequest) => facilityBookingRepository.createQuote(request),
    [],
  );
  return useFacilityBookingMutation(operation);
}

export function useSubmitFacilityBooking() {
  const operation = useCallback(
    (request: CreateFacilityBookingRequest) => facilityBookingRepository.createBooking(request),
    [],
  );
  return useFacilityBookingMutation(operation);
}

export function usePayFacilityBooking() {
  const operation = useCallback(
    (request: PayFacilityBookingRequest) => facilityBookingRepository.payBooking(request),
    [],
  );
  return useFacilityBookingMutation(operation);
}

export function useCancelFacilityReservation() {
  const operation = useCallback(
    (request: CancelFacilityBookingRequest) => facilityBookingRepository.cancelBooking(request),
    [],
  );
  return useFacilityBookingMutation(operation);
}

export function useRescheduleFacilityReservation() {
  const operation = useCallback(
    (request: RescheduleFacilityBookingRequest) => facilityBookingRepository.rescheduleBooking(request),
    [],
  );
  return useFacilityBookingMutation(operation);
}

export function useJoinFacilityWaitlist() {
  const operation = useCallback(
    (request: JoinFacilityWaitlistRequest) => facilityBookingRepository.joinWaitlist(request),
    [],
  );
  return useFacilityBookingMutation(operation);
}

export function useLeaveFacilityWaitlist() {
  const operation = useCallback(async (request: LeaveFacilityWaitlistRequest) => {
    await facilityBookingRepository.leaveWaitlist(request);
    return true;
  }, []);
  return useFacilityBookingMutation(operation);
}

export function useFacilityCheckInMutation() {
  const operation = useCallback(
    (request: FacilityCheckInRequest) => facilityBookingRepository.checkIn(request),
    [],
  );
  return useFacilityBookingMutation(operation);
}

export function useUpdateFacilityCalendarLink() {
  const operation = useCallback(
    (request: UpdateFacilityCalendarLinkRequest) => facilityBookingRepository.updateCalendarLink(request),
    [],
  );
  return useFacilityBookingMutation(operation);
}
