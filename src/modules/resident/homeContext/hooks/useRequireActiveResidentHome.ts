import { useActiveResidentHome } from './useActiveResidentHome';
import type { ActiveResidentHomeContext } from '../data/residentHomeContext.types';

export function useRequireActiveResidentHome(): ActiveResidentHomeContext {
  const { activeContext } = useActiveResidentHome();
  if (!activeContext) {
    throw new Error('Active residence context is required but not found.');
  }
  return activeContext;
}
export default useRequireActiveResidentHome;
