import { useMemo, useState } from 'react';

export type SearchFilterState<TItem> = {
  query: string;
  setQuery: (query: string) => void;
  filteredItems: TItem[];
};

export function useSearchFilter<TItem>(
  items: TItem[],
  predicate: (item: TItem, normalizedQuery: string) => boolean
): SearchFilterState<TItem> {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.length === 0) {
      return items;
    }

    return items.filter((item) => predicate(item, normalizedQuery));
  }, [items, predicate, query]);

  return { query, setQuery, filteredItems };
}

