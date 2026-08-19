import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';

export function useVisitorParking(unitId: string) {
  return useRepositoryResult(
    () => parkingRepository.getVisitorParkingPasses(unitId),
    [unitId]
  );
}
