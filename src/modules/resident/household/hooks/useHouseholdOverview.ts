import * as React from 'react';
import { residentHouseholdRepository } from '../data/residentHousehold.repository';
import type { HouseholdOverview } from '../data/residentHousehold.types';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useHouseholdOverview() {
  const { activeContext } = useActiveResidentHome();
  const context = React.useMemo(() => ({
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  }), [activeContext]);

  const [data, setData] = React.useState<HouseholdOverview>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const refetch = React.useCallback(async () => {
    setIsLoading(true);
    try {
      setData(await residentHouseholdRepository.getHouseholdOverview(context));
      setError(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError : new Error('resident.household.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [context]);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}
export default useHouseholdOverview;
