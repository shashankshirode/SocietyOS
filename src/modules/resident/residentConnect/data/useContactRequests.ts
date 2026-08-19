import { useCallback } from 'react';
import { residentConnectRepository } from './residentConnect.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useCursorPagination, type CursorPage } from '../../../../shared/hooks/useCursorPagination';
import type { ContactRequest } from '../../../../shared/types/residentConnect.types';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function useIncomingRequests() {
    const { activeContext } = useActiveResidentHome();
    const fetchPage = useCallback(async (cursor?: string): Promise<CursorPage<ContactRequest>> => {
        const context = {
            activeHome: activeContext,
            dataScopeKey: activeContext.dataScopeKey
        };
        const params = {
            ...includeWhenPresent("cursor", cursor),
            limit: 20
        };
        const res = await residentConnectRepository.getIncomingRequests(params, context);
        if (!res.ok) {
            throw new Error(res.error?.message || 'Failed to fetch incoming requests');
        }
        return {
            items: res.data,
            ...includeWhenPresent("nextCursor", res.data.nextCursor),
            hasMore: res.data.hasMore
        };
    }, [activeContext]);
    return useCursorPagination(fetchPage, [activeContext]);
}
export function useOutgoingRequests() {
    const { activeContext } = useActiveResidentHome();
    const fetchPage = useCallback(async (cursor?: string): Promise<CursorPage<ContactRequest>> => {
        const context = {
            activeHome: activeContext,
            dataScopeKey: activeContext.dataScopeKey
        };
        const params = {
            ...includeWhenPresent("cursor", cursor),
            limit: 20
        };
        const res = await residentConnectRepository.getOutgoingRequests(params, context);
        if (!res.ok) {
            throw new Error(res.error?.message || 'Failed to fetch outgoing requests');
        }
        return {
            items: res.data,
            ...includeWhenPresent("nextCursor", res.data.nextCursor),
            hasMore: res.data.hasMore
        };
    }, [activeContext]);
    return useCursorPagination(fetchPage, [activeContext]);
}

