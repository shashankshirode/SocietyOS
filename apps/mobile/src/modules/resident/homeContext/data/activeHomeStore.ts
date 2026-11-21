import { residentHomeContextStore } from '../state/residentHomeContext.store';

export const activeHomeStore = {
  getActiveContextId(): string {
    return residentHomeContextStore.getActiveContext().homeContextId;
  },

  setActiveContextId(id: string): boolean {
    return residentHomeContextStore.setActiveContextById(id);
  },

  subscribe(listener: () => void): () => void {
    return residentHomeContextStore.subscribe(listener);
  },
};
export default activeHomeStore;
