import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useParkingHome(unitId: string) {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryResult(
    () => parkingRepository.getParkingHome(activeContext.flatNumber),
    [unitId, activeContext.dataScopeKey]
  );
}
export default useParkingHome;
