import * as React from 'react';
import { residentHouseholdRepository } from '../data/residentHousehold.repository';
import type { TenantEligibilityResult, TenantManagementSummary } from '../data/residentHousehold.types';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useTenantManagement() {
  const { activeContext } = useActiveResidentHome();
  const context = React.useMemo(() => ({
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  }), [activeContext]);

  const [summary, setSummary] = React.useState<TenantManagementSummary>();
  const [eligibility, setEligibility] = React.useState<TenantEligibilityResult>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const refetch = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [nextSummary, nextEligibility] = await Promise.all([
        residentHouseholdRepository.getTenantManagementSummary(context),
        residentHouseholdRepository.runTenantEligibilityCheck(),
      ]);
      setSummary(nextSummary);
      setEligibility(nextEligibility);
      setError(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError : new Error('resident.household.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [context]);

  const initiateTenantExit = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await residentHouseholdRepository.initiateTenantExit();
      await refetch();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError : new Error('resident.household.errors.actionFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [refetch]);

  const completeTenantExit = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await residentHouseholdRepository.completeTenantExit();
      await refetch();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError : new Error('resident.household.errors.actionFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [refetch]);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return { summary, eligibility, isLoading, error, refetch, initiateTenantExit, completeTenantExit };
}
export default useTenantManagement;
