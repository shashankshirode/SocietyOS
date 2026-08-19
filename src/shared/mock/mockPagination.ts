export type MockPaginationInput = {
  page?: number;
  pageSize?: number;
};

export type MockPaginatedResult<TItem> = {
  items: TItem[];
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
};

export function paginateMockList<TItem>(
  items: TItem[],
  input: MockPaginationInput = {}
): MockPaginatedResult<TItem> {
  const page = Math.max(input.page ?? 1, 1);
  const pageSize = Math.max(input.pageSize ?? 10, 1);
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return {
    items: pageItems,
    page,
    pageSize,
    total: items.length,
    hasNextPage: start + pageSize < items.length,
  };
}

