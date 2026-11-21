import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';

export function useParkingStickerRfid(unitId: string) {
  return useRepositoryResult(
    () => parkingRepository.getStickerRfidStatus(unitId),
    [unitId]
  );
}
