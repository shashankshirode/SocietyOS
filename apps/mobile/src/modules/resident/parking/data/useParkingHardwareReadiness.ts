import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';

export function useParkingHardwareReadiness(societyId: string) {
  return useRepositoryResult(
    () => parkingRepository.getHardwareReadiness(societyId),
    [societyId]
  );
}
