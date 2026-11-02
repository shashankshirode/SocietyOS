import { useMemo } from 'react';
import { MOCK_SOCIETIES } from '../data/residentOnboarding.mockData';
import type { OnboardingSociety } from '../data/residentOnboarding.types';
import { isDevelopmentMode } from '../../../../shared/utils/isDevelopmentMode';

export function useOnboardingSocieties(searchQuery = ''): OnboardingSociety[] {
  return useMemo(() => {
    if (!isDevelopmentMode()) {
      throw new Error('Society search requires backend API - not implemented for production');
    }
    if (!searchQuery.trim()) return MOCK_SOCIETIES;
    const q = searchQuery.toLowerCase().trim();
    return MOCK_SOCIETIES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q),
    );
  }, [searchQuery]);
}
