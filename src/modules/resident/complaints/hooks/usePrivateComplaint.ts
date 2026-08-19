import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { ComplaintsRepository } from '../data/complaints.repository';

export function usePrivateComplaint() {
  const mutation = useRepositoryMutation((input: Parameters<typeof ComplaintsRepository.createPrivateComplaint>[0]) =>
    ComplaintsRepository.createPrivateComplaint(input)
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
