import { useCallback, useEffect, useState } from 'react';
import { facilityBookingRepository } from '../data/facilityBooking.repository';
import { FacilityDiscoveryFilter } from '../models/facilityBooking.enums';
import type { Facility } from '../models/facilityBooking.models';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useFacilityBookingResource } from './useFacilityBookingResource';

export interface UseFacilitiesOptions {
  readonly query: string;
  readonly filter: FacilityDiscoveryFilter;
  readonly pageSize?: number;
}

export interface UseFacilitiesResult {
  readonly facilities: readonly Facility[];
  readonly isLoading: boolean;
  readonly isRefreshing: boolean;
  readonly isLoadingMore: boolean;
  readonly hasMore: boolean;
  readonly error: Error | null;
  readonly nextPageError: Error | null;
  readonly refresh: () => Promise<void>;
  readonly loadMore: () => Promise<void>;
}

export function useFacilities({
  query,
  filter,
  pageSize = 8,
}: UseFacilitiesOptions): UseFacilitiesResult {
  const { activeContext } = useActiveResidentHome();
  const [facilities, setFacilities] = useState<readonly Facility[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPageError, setNextPageError] = useState<Error | null>(null);
  const loadFirstPage = useCallback(() => facilityBookingRepository.getFacilities({
    societyId: activeContext.societyId,
    residenceId: activeContext.homeContextId,
    query,
    filter,
    cursor: null,
    pageSize,
  }), [activeContext.homeContextId, activeContext.societyId, filter, pageSize, query]);
  const resource = useFacilityBookingResource(loadFirstPage, facilityBookingRepository.subscribe);

  useEffect(() => {
    if (!resource.data) return;
    setFacilities(resource.data.items);
    setNextCursor(resource.data.nextCursor);
    setNextPageError(null);
  }, [resource.data]);

  useEffect(() => {
    setFacilities([]);
    setNextCursor(null);
  }, [activeContext.homeContextId, filter, query]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    setNextPageError(null);
    try {
      const page = await facilityBookingRepository.getFacilities({
        societyId: activeContext.societyId,
        residenceId: activeContext.homeContextId,
        query,
        filter,
        cursor: nextCursor,
        pageSize,
      });
      setFacilities((current) => {
        const existingIds = new Set(current.map((item) => item.id));
        return [...current, ...page.items.filter((item) => !existingIds.has(item.id))];
      });
      setNextCursor(page.nextCursor);
    } catch (caught) {
      setNextPageError(caught instanceof Error ? caught : new Error('More facilities could not be loaded.'));
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeContext.homeContextId, activeContext.societyId, filter, isLoadingMore, nextCursor, pageSize, query]);

  return {
    facilities,
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

export { FacilityDiscoveryFilter };
