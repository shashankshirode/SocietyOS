import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';

export function useParkingSlotDetail(slotId: string) {
  return useRepositoryResult(
    () => parkingRepository.getParkingSlotDetail(slotId),
    [slotId]
  );
}
