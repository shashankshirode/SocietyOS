import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { ComplaintsRepository } from '../data/complaints.repository';

export function useAssignComplaint() {
  const mutation = useRepositoryMutation((input: Parameters<typeof ComplaintsRepository.assignComplaint>[0]) =>
    ComplaintsRepository.assignComplaint(input)
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
