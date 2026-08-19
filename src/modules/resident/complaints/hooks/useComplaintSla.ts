import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { ComplaintsRepository } from '../data/complaints.repository';

export function useComplaintSla() {
  const mutation = useRepositoryMutation((input: Parameters<typeof ComplaintsRepository.getComplaintSlaSummary>[0]) =>
    ComplaintsRepository.getComplaintSlaSummary(input)
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
