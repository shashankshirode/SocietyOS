import { useCallback, useEffect, useState } from 'react';
import { facilityBookingRepository } from '../data/facilityBooking.repository';
import { FacilityBookingFilter } from '../models/facilityBooking.enums';
import type { FacilityBooking, FacilityWaitlistEntry } from '../models/facilityBooking.models';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilityBookingResource } from './useFacilityBookingResource';

export interface UseFacilityBookingsResult {
  readonly bookings: readonly FacilityBooking[];
  readonly waitlistEntries: readonly FacilityWaitlistEntry[];
  readonly isLoading: boolean;
  readonly isRefreshing: boolean;
  readonly isLoadingMore: boolean;
  readonly hasMore: boolean;
  readonly error: Error | null;
  readonly nextPageError: Error | null;
  readonly refresh: () => Promise<void>;
  readonly loadMore: () => Promise<void>;
}

export function useFacilityBookings(
  filter: FacilityBookingFilter,
  pageSize = 6,
): UseFacilityBookingsResult {
  const { activeContext } = useActiveResidentHome();
  const [bookings, setBookings] = useState<readonly FacilityBooking[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPageError, setNextPageError] = useState<Error | null>(null);
  const loadFirstPage = useCallback(async () => {
    const page = await facilityBookingRepository.getBookings({
      societyId: activeContext.societyId,
      residenceId: activeContext.homeContextId,
      unitId: activeContext.unitId,
      filter,
      cursor: null,
      pageSize,
    });
    const waitlistEntries = filter === FacilityBookingFilter.Waitlisted
      ? await facilityBookingRepository.getWaitlistEntries(activeContext.homeContextId)
      : [];
    return { page, waitlistEntries };
  }, [activeContext.homeContextId, activeContext.societyId, activeContext.unitId, filter, pageSize]);
  const resource = useFacilityBookingResource(loadFirstPage, facilityBookingRepository.subscribe);

  useEffect(() => {
    if (!resource.data) return;
    setBookings(resource.data.page.items);
    setNextCursor(resource.data.page.nextCursor);
    setNextPageError(null);
  }, [resource.data]);

  useEffect(() => {
    setBookings([]);
    setNextCursor(null);
  }, [activeContext.homeContextId, filter]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore || filter === FacilityBookingFilter.Waitlisted) return;
    setIsLoadingMore(true);
    setNextPageError(null);
    try {
      const page = await facilityBookingRepository.getBookings({
        societyId: activeContext.societyId,
        residenceId: activeContext.homeContextId,
        unitId: activeContext.unitId,
        filter,
        cursor: nextCursor,
        pageSize,
      });
      setBookings((current) => {
        const existingIds = new Set(current.map((booking) => booking.id));
        return [...current, ...page.items.filter((booking) => !existingIds.has(booking.id))];
      });
      setNextCursor(page.nextCursor);
    } catch (caught) {
      setNextPageError(caught instanceof Error ? caught : new Error('More bookings could not be loaded.'));
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeContext.homeContextId, activeContext.societyId, activeContext.unitId, filter, isLoadingMore, nextCursor, pageSize]);

  return {
    bookings,
    waitlistEntries: resource.data?.waitlistEntries ?? [],
    isLoading: resource.isLoading,
    isRefreshing: resource.isRefreshing,
    isLoadingMore,
    hasMore: nextCursor !== null,
    error: resource.error,
    nextPageError,
    refresh: resource.refresh,
    loadMore,
  };
}

export { FacilityBookingFilter };
