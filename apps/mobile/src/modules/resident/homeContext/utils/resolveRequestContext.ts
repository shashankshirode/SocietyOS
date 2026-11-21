import { residentHomeContextStore } from '../state/residentHomeContext.store';
import type { ResidentRepositoryRequestContext } from '../data/residentHomeContext.types';

export function resolveRequestContext(context?: ResidentRepositoryRequestContext): ResidentRepositoryRequestContext {
  if (context) return context;
  const active = residentHomeContextStore.getActiveContext();
  return {
    activeHome: active,
    dataScopeKey: active.dataScopeKey,
  };
}
export default resolveRequestContext;
