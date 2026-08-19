import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { ComplaintsRepository } from '../data/complaints.repository';

export function useComplaintFeedback() {
  const mutation = useRepositoryMutation((input: Parameters<typeof ComplaintsRepository.submitComplaintFeedback>[0]) =>
    ComplaintsRepository.submitComplaintFeedback(input)
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
