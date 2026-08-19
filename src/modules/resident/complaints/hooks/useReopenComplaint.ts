import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { ComplaintsRepository } from '../data/complaints.repository';

export function useReopenComplaint() {
  const mutation = useRepositoryMutation((input: Parameters<typeof ComplaintsRepository.reopenComplaint>[0]) =>
    ComplaintsRepository.reopenComplaint(input)
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
