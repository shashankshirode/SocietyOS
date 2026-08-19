import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from '../data/parking.repository';

export function useVisitorParkingPass() {
  const mutation = useRepositoryMutation((input: Parameters<typeof parkingRepository.createVisitorParkingPass>[0]) =>
    parkingRepository.createVisitorParkingPass(input)
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
