import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';

export function useRequestParkingSlotChange() {
  return useRepositoryMutation(parkingRepository.requestParkingSlotChange);
}

export function useCancelVisitorParkingPass() {
  return useRepositoryMutation((passId: string) => parkingRepository.cancelVisitorParkingPass(passId));
}

export function useExtendVisitorParkingPass() {
  return useRepositoryMutation(parkingRepository.extendVisitorParkingPass);
}

export function useUpdateParkingHardware() {
  return useRepositoryMutation(parkingRepository.updateParkingHardware);
}
