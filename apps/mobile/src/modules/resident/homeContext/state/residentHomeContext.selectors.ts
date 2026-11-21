import { residentHomeContextStore } from './residentHomeContext.store';
import type { ActiveResidentHomeContext } from '../data/residentHomeContext.types';

export const residentHomeContextSelectors = {
  getActiveContext(): ActiveResidentHomeContext {
    return residentHomeContextStore.getActiveContext();
  },
  
  getScopeKey(): string {
    return residentHomeContextStore.getActiveContext().dataScopeKey;
  },
};
export default residentHomeContextSelectors;
