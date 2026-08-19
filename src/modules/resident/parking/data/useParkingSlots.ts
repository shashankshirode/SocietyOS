import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';

export function useParkingSlots(unitId: string) {
  return useRepositoryResult(
    () => parkingRepository.getParkingSlots(unitId),
    [unitId]
  );
}
