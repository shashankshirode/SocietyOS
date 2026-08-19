import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';

export function useCreateVisitorParkingPass() {
  return useRepositoryMutation(parkingRepository.createVisitorParkingPass);
}
