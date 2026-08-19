import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { ComplaintsRepository } from '../data/complaints.repository';

export function useCreateComplaint() {
  const mutation = useRepositoryMutation((input: Parameters<typeof ComplaintsRepository.createComplaint>[0]) =>
    ComplaintsRepository.createComplaint(input)
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
