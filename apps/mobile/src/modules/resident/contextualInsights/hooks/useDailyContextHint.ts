import { useResidentContextualInsights } from './useResidentContextualInsights';

export function useDailyContextHint(societyId: string, unitId: string) {
  const { data, isLoading, error, refetch, dismissSuggestion, enabled } = useResidentContextualInsights(
    societyId,
    unitId
  );

  return {
    topSuggestion: data?.topSuggestion ?? null,
    isLoading,
    error,
    refetch,
    dismissSuggestion,
    enabled,
  };
}
export default useDailyContextHint;
