import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { facilityRepository } from './facility.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useFacilityHome(unitId: string) {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryResult(
    () => facilityRepository.getFacilityHome(activeContext.flatNumber),
    [unitId, activeContext.dataScopeKey]
  );
}
export default useFacilityHome;
