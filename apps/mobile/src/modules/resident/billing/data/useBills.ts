import { useResidentBills } from '../hooks/useResidentBills';

export function useBills() {
  const result = useResidentBills('all', 50);
  return {
    data: result.bills,
    isLoading: result.isInitialLoading,
    error: result.error,
    refetch: result.refresh,
  };
}
export default useBills;
