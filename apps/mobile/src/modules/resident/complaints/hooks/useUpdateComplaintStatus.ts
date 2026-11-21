import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { ComplaintsRepository } from '../data/complaints.repository';

export function useUpdateComplaintStatus() {
  const mutation = useRepositoryMutation((input: Parameters<typeof ComplaintsRepository.updateComplaintStatus>[0]) =>
    ComplaintsRepository.updateComplaintStatus(input)
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
