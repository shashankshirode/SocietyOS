import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { residentHomeContextRepository } from '../data/residentHomeContext.repository';
import { sortHomeContexts } from '../utils/residentHomeContextSorter';
import * as React from 'react';
import { activeHomeStore } from '../data/activeHomeStore';

export function useResidentHomeContexts() {
  const activeHomeContextId = React.useSyncExternalStore(
    activeHomeStore.subscribe,
    activeHomeStore.getActiveContextId,
    activeHomeStore.getActiveContextId
  );
  const result = useRepositoryResult(
    () => residentHomeContextRepository.getHomeContexts(),
    [activeHomeContextId]
  );

  const sortedData = React.useMemo(() => {
    const contexts = result.data?.map((context) => ({
      ...context,
      isCurrent: context.homeContextId === activeHomeContextId,
    })) ?? [];
    return sortHomeContexts(contexts);
  }, [activeHomeContextId, result.data]);

  return {
    ...result,
    data: sortedData,
  };
}
export default useResidentHomeContexts;
