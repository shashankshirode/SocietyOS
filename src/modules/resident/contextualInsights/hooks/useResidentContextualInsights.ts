import { useCallback, useState, useEffect } from 'react';
import { residentContextualInsightsRepository } from '../data/residentContextualInsights.repository';
import type { ResidentContextualInsightsResult } from '../data/residentContextualInsights.types';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useMessages } from '../../../../messages/useMessages';

export const FEATURE_FLAGS = {
  residentContextualInsights: true,
  areaWeatherInsights: true,
  localAreaAdvisories: true,
  weatherProviderIntegration: false,
};

export function useResidentContextualInsights(societyId: string, unitId: string) {
  const { activeContext } = useActiveResidentHome();
  const messages = useMessages();
  const [data, setData] = useState<ResidentContextualInsightsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInsights = useCallback(async () => {
    if (!FEATURE_FLAGS.residentContextualInsights) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await residentContextualInsightsRepository.getContextualInsights({
        userId: activeContext.residentId,
        societyId: activeContext.societyId,
        unitId: activeContext.unitId,
      });
      setData(result);
    } catch {
      setError(new Error(messages.resident.contextualInsights.error.unavailable));
    } finally {
      setIsLoading(false);
    }
  }, [activeContext, messages]);

  useEffect(() => {
    fetchInsights();
  }, [societyId, unitId, activeContext.dataScopeKey, fetchInsights]);

  const dismissSuggestion = async (suggestionId: string) => {
    if (!data) return;
    try {
      const updated = await residentContextualInsightsRepository.dismissSuggestion({
        userId: activeContext.residentId,
        societyId: activeContext.societyId,
        unitId: activeContext.unitId,
        suggestionId,
      });
      setData(updated);
    } catch {
      return;
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchInsights,
    dismissSuggestion,
    enabled: FEATURE_FLAGS.residentContextualInsights,
  };
}
export default useResidentContextualInsights;
