import { useRepositoryResult, useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { parcelRepository } from '../data/parcelHandover.repository';

export function useParcelHandover() {
  return useRepositoryResult(() => parcelRepository.getParcels(), []);
}

export function useConfirmPickup() {
  return useRepositoryMutation(({ id, otp }: { id: string; otp: string }) =>
    parcelRepository.confirmPickup(id, otp)
  );
}
