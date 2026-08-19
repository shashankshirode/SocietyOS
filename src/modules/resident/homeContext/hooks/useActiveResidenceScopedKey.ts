import { useActiveResidentHome } from './useActiveResidentHome';

export function useActiveResidenceScopedKey(): string {
  const { activeContext } = useActiveResidentHome();
  return activeContext.dataScopeKey;
}
export default useActiveResidenceScopedKey;
