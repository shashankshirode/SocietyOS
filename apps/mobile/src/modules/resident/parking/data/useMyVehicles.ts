import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useMyVehicles(unitId: string) {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryResult(
    () => parkingRepository.getMyVehicles(activeContext.flatNumber),
    [unitId, activeContext.dataScopeKey]
  );
}
export default useMyVehicles;
