import { useState, useCallback, useEffect } from 'react';
import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import type { FacilityBookingListParams } from './facility.dto';
import { facilityRepository } from './facility.repository';
import { useMockStore } from '../../../../core/mockStore/useMockStore';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
export function useMyFacilityBookings(params: FacilityBookingListParams = {}) {
    const { state } = useMockStore();
    const { activeContext } = useActiveResidentHome();
    const effectiveUnitId = params.unitId || activeContext.flatNumber;
    const result = useRepositoryResult(() => facilityRepository.getMyBookings({ ...params, unitId: effectiveUnitId }), [effectiveUnitId, params.status, params.query, activeContext.dataScopeKey]);
    const scopedBookings = state.facilityBookings.filter((fb) => fb.unitId === effectiveUnitId || fb.flatNumber === activeContext.flatNumber);
    const isPaginatedScenario = effectiveUnitId === 'unit-gv-c-307';
    const [limit, setLimit] = useState(isPaginatedScenario ? 3 : scopedBookings.length);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    useEffect(() => {
        setLimit(isPaginatedScenario ? 3 : scopedBookings.length);
    }, [effectiveUnitId, isPaginatedScenario, scopedBookings.length]);
    const hasMore = isPaginatedScenario && limit < scopedBookings.length;
    const loadMore = useCallback(async () => {
        if (!hasMore || isLoadingMore)
            return;
        setIsLoadingMore(true);
        await new Promise((resolve) => setTimeout(resolve, 600));
        setLimit((prev) => Math.min(prev + 2, scopedBookings.length));
        setIsLoadingMore(false);
    }, [hasMore, isLoadingMore, scopedBookings.length]);
    const visibleBookings = result.error ? [] : scopedBookings.slice(0, limit);
    return {
        ...result,
        data: visibleBookings,
        isLoadingMore,
        hasMore,
        loadMore,
    };
}
export default useMyFacilityBookings;

