import { useCallback } from 'react';
import { residentConnectRepository } from './residentConnect.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useCursorPagination, type CursorPage } from '../../../../shared/hooks/useCursorPagination';
import type { ResidentDirectoryEntry } from '../../../../shared/types/residentConnect.types';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function useResidentDirectory(params?: {
    residentType?: string;
    tower?: string;
    onlyAvailable?: boolean;
    search?: string;
}) {
    const { activeContext } = useActiveResidentHome();
    const fetchPage = useCallback(async (cursor?: string): Promise<CursorPage<ResidentDirectoryEntry>> => {
        const context = {
            activeHome: activeContext,
            dataScopeKey: activeContext.dataScopeKey
        };
        const queryParams = {
            ...params,
            ...includeWhenPresent("cursor", cursor),
            limit: 20
        };
        const res = await residentConnectRepository.getResidentDirectory(queryParams, context);
        if (!res.ok) {
            throw new Error(res.error?.message || 'Failed to fetch directory');
        }
        return {
            items: res.data,
            ...includeWhenPresent("nextCursor", res.data.nextCursor),
            hasMore: res.data.hasMore
        };
    }, [activeContext, params]);
    return useCursorPagination(fetchPage, [activeContext, params?.residentType, params?.tower, params?.onlyAvailable, params?.search]);
}
export default useResidentDirectory;

