import { useMemo, useState, useEffect } from 'react';
import { MOCK_SOCIETIES } from '../data/residentOnboarding.mockData';
import type { OnboardingSociety } from '../data/residentOnboarding.types';
import { dataSourceConfig } from '../../../../core/dataSource/dataSource.config';
import { apiClient } from '../../../../core/api/apiClient';

interface ApiSocietyItem {
  id: string;
  name: string;
  city: string;
  state: string;
  category: string;
  totalUnits: number;
  imageUrl?: string;
  isVerified: boolean;
}

interface PagedSocietyResponse {
  items: ApiSocietyItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

function mapApiSociety(item: ApiSocietyItem): OnboardingSociety {
  return {
    id: item.id,
    name: item.name,
    city: item.city,
    state: item.state,
    category: item.category,
    totalUnits: item.totalUnits,
    ...(item.imageUrl != null ? { imageUrl: item.imageUrl } : {}),
    isVerified: item.isVerified,
  };
}

export function useOnboardingSocietiesApi(searchQuery = ''): {
  societies: OnboardingSociety[];
  isLoading: boolean;
  error: string | null;
  isMockMode: boolean;
} {
  const isMockMode = dataSourceConfig.globalMode !== 'api';

  const mockFiltered = useMemo(() => {
    if (!isMockMode) return [];
    if (!searchQuery.trim()) return MOCK_SOCIETIES;
    const q = searchQuery.toLowerCase().trim();
    return MOCK_SOCIETIES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q),
    );
  }, [isMockMode, searchQuery]);

  const [apiSocieties, setApiSocieties] = useState<OnboardingSociety[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isMockMode) return;

    let cancelled = false;
    const controller = new AbortController();

    const query = searchQuery.trim() || undefined;
    const timer = setTimeout(() => {
      setIsLoading(true);
      setError(null);

      apiClient
        .get<PagedSocietyResponse>('/api/v1/public/societies', {
          query: {
            ...(query != null ? { query } : {}),
            page: 0,
            size: 20,
          },
          signal: controller.signal,
        })
        .then((data) => {
          if (!cancelled) {
            setApiSocieties(data.items.map(mapApiSociety));
            setIsLoading(false);
          }
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            if (err instanceof Error && err.name === 'AbortError') {
              setIsLoading(false);
              return;
            }
            setError('Could not load societies. Please check your connection.');
            setIsLoading(false);
          }
        });
    }, 300);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [isMockMode, searchQuery]);

  if (isMockMode) {
    return { societies: mockFiltered, isLoading: false, error: null, isMockMode: true };
  }

  return { societies: apiSocieties, isLoading, error, isMockMode: false };
}
