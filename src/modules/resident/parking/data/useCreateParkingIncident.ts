import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';

export function useCreateParkingIncident() {
  return useRepositoryMutation(parkingRepository.createParkingIncident);
}
