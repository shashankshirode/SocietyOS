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
    const matchesScope = (entity: { homeContextId?: string | undefined; societyId?: string | undefined; flatNumber?: string | undefined }) => {
      if (entity.homeContextId !== undefined) {
        return entity.homeContextId === activeContext.homeContextId;
      }
      if (entity.societyId !== undefined) {
        return entity.societyId === activeContext.societyId;
      }
      return activeContext.homeContextId === 'context-001' && entity.flatNumber !== undefined && entity.flatNumber === flatNumber;
    };

    return {
      ...state,
      bills: state.bills.filter((bill) => matchesScope(bill as { homeContextId?: string | undefined; societyId?: string | undefined; flatNumber?: string | undefined })),
      notices: state.notices.filter((notice) => matchesScope(notice as { homeContextId?: string | undefined; societyId?: string | undefined; flatNumber?: string | undefined })),
      complaints: state.complaints.filter((complaint) => matchesScope(complaint as { homeContextId?: string | undefined; societyId?: string | undefined; flatNumber?: string | undefined })),
      visitors: state.visitors.filter((visitor) => matchesScope(visitor as { homeContextId?: string | undefined; societyId?: string | undefined; flatNumber?: string | undefined })),
      nocs: state.nocs.filter((noc) => matchesScope(noc as { homeContextId?: string | undefined; societyId?: string | undefined; flatNumber?: string | undefined })),
      documents: state.documents.filter((d) => d.flatNumber !== undefined && d.flatNumber === flatNumber),
    };
  }, [context.state, activeContext]);

  return {
    ...context,
    state: filteredState,
  };
}
export default useMockStore;
