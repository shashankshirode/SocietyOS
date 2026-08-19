import { useContext, useMemo, useSyncExternalStore } from 'react';
import { MockStoreContext } from './mockStoreProvider';
import { activeHomeStore } from '../../modules/resident/homeContext/data/activeHomeStore';
import { mockResidentHomeContexts } from '../../modules/resident/homeContext/data/residentHomeContext.mockData';

export function useMockStore() {
  const context = useContext(MockStoreContext);
  if (!context) {
    throw new Error('useMockStore must be used within a MockStoreProvider');
  }

  const activeId = useSyncExternalStore(
    activeHomeStore.subscribe,
    activeHomeStore.getActiveContextId,
    activeHomeStore.getActiveContextId
  );

  const activeContext = useMemo(() => {
    return mockResidentHomeContexts.find((ctx) => ctx.homeContextId === activeId) || mockResidentHomeContexts[0];
  }, [activeId]);

  const filteredState = useMemo(() => {
    const state = context.state;
    if (!activeContext) return state;

    const flatNumber = activeContext.flatNumber;
    const matchesScope = (entity: { homeContextId?: string; societyId?: string; flatNumber?: string }) => {
      if (entity.homeContextId) return entity.homeContextId === activeContext.homeContextId;
      if (entity.societyId) return entity.societyId === activeContext.societyId;
      return activeContext.homeContextId === 'context-001' && entity.flatNumber === flatNumber;
    };

    return {
      ...state,
      bills: state.bills.filter(matchesScope),
      notices: state.notices.filter(matchesScope),
      complaints: state.complaints.filter(matchesScope),
      visitors: state.visitors.filter(matchesScope),
      nocs: state.nocs.filter(matchesScope),
      documents: state.documents.filter((d) => d.flatNumber === flatNumber),
    };
  }, [context.state, activeContext]);

  return {
    ...context,
    state: filteredState,
  };
}
export default useMockStore;
