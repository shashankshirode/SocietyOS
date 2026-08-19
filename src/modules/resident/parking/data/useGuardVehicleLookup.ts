import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';

export function useGuardVehicleLookup(query: string) {
  return useRepositoryResult(
    () => parkingRepository.lookupVehicleForGuard(query),
    [query]
  );
}
