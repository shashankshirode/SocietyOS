import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';

export function useParkingRules() {
  return useRepositoryResult(
    () => parkingRepository.getParkingRules(),
    []
  );
}
