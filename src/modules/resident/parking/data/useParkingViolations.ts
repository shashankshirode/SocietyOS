import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';

export function useParkingViolations(unitId: string) {
  return useRepositoryResult(
    () => parkingRepository.getParkingViolationHistory(unitId),
    [unitId]
  );
}
