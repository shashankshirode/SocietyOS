import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';

export function useVehicleDetail(vehicleId: string) {
  return useRepositoryResult(
    () => parkingRepository.getVehicleDetail(vehicleId),
    [vehicleId]
  );
}
