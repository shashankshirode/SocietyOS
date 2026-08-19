import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';

export function useAddVehicle() {
  return useRepositoryMutation(parkingRepository.addVehicle);
}
