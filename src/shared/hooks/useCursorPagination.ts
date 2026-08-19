import { useState, useCallback, useEffect } from 'react';
import { useLatestValue } from './useLatestValue';
import { includeWhenPresent } from "../utils/presentProperty";
import type { Absent } from "../types/absence.types";
export type CursorPage<T> = {
    items: T[];
    nextCursor?: string;
    previousCursor?: string;
    hasMore: boolean;
};
export type CursorPaginationState<T> = {
    items: T[];
    isInitialLoading: boolean;
    isRefreshing: boolean;
    isLoadingMore: boolean;
    errorMessage?: string;
    hasMore: boolean;
    refresh: () => Promise<void>;
    loadMore: () => Promise<void>;
    retry: () => Promise<void>;
};
type CursorIdentifiable = {
    id?: string;
    conversationId?: string;
    messageId?: string;
    requestId?: string;
    residentProfileId?: string;
};
type PaginationDependency = JsonValue | Absent;
export function useCursorPagination<T extends CursorIdentifiable>(fetchPage: (cursor?: string) => Promise<CursorPage<T>>, dependencies: PaginationDependency[] = []): CursorPaginationState<T> {
    const [items, setItems] = useState<T[]>([]);
    const [nextCursor, setNextCursor] = useState<string | Absent>(undefined);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | Absent>(undefined);
    const dependencySignature = JSON.stringify(dependencies);
    const fetchPageHandle = useLatestValue(fetchPage, dependencySignature);
    const loadInitial = useCallback(async (isRef: boolean = false) => {
        if (isRef) {
            setIsRefreshing(true);
        }
        else {
            setIsInitialLoading(true);
        }
        setErrorMessage(undefined);
        try {
            const page = await fetchPageHandle.valueRef.current(undefined);
            setItems(page.items);
            setNextCursor(page.nextCursor);
            setHasMore(page.hasMore);
        }
        catch (err) {
            const error = err as {
                message?: string;
            };
            setErrorMessage(error?.message || 'Failed to load items.');
            setItems([]);
        }
        finally {
            setIsInitialLoading(false);
            setIsRefreshing(false);
        }
    }, [fetchPageHandle]);
    const loadMore = useCallback(async () => {
        if (isLoadingMore || !hasMore || isInitialLoading || isRefreshing) {
            return;
        }
        setIsLoadingMore(true);
        setErrorMessage(undefined);
        try {
            const page = await fetchPageHandle.valueRef.current(nextCursor);
            setItems((prev) => {
                const combined = [...prev, ...page.items];
                const seen = new Set();
                return combined.filter((item) => {
                    const obj = item;
                    const id = obj.id || obj.conversationId || obj.messageId || obj.requestId || obj.residentProfileId || JSON.stringify(item);
                    if (seen.has(id)) {
                        return false;
                    }
                    seen.add(id);
                    return true;
                });
            });
            setNextCursor(page.nextCursor);
            setHasMore(page.hasMore);
        }
        catch (err) {
            const error = err as {
                message?: string;
            };
            setErrorMessage(error?.message || 'Failed to load more items.');
        }
        finally {
            setIsLoadingMore(false);
        }
    }, [fetchPageHandle, nextCursor, hasMore, isInitialLoading, isRefreshing, isLoadingMore]);
    useEffect(() => {
        void loadInitial();
    }, [loadInitial]);
    return {
        items,
        isInitialLoading,
        isRefreshing,
        isLoadingMore,
        ...includeWhenPresent("errorMessage", errorMessage),
        hasMore,
        refresh: () => loadInitial(true),
        loadMore,
        retry: () => nextCursor ? loadMore() : loadInitial()
    };
}
