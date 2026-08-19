import { useMemo, useState } from 'react';
import { paginateMockList, type MockPaginatedResult } from '../mock/mockPagination';

export type PaginatedMockListState<TItem> = MockPaginatedResult<TItem> & {
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  previousPage: () => void;
};

export function usePaginatedMockList<TItem>(
  items: TItem[],
  initialPageSize = 10
): PaginatedMockListState<TItem> {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const result = useMemo(
    () => paginateMockList(items, { page, pageSize }),
    [items, page, pageSize]
  );

  return {
    ...result,
    setPage,
    setPageSize,
    nextPage: () => setPage((currentPage) => currentPage + 1),
    previousPage: () => setPage((currentPage) => Math.max(currentPage - 1, 1)),
  };
}

