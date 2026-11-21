import { useSyncExternalStore } from 'react';
import { residentHomeContextStore } from '../state/residentHomeContext.store';

export function useActiveResidentHome() {
  const activeContext = useSyncExternalStore(
    residentHomeContextStore.subscribe,
    residentHomeContextStore.getActiveContext,
    residentHomeContextStore.getActiveContext
  );

  return {
    activeId: activeContext.homeContextId,
    activeContext,
    isLoading: false,
    error: null,
  };
}
export default useActiveResidentHome;
