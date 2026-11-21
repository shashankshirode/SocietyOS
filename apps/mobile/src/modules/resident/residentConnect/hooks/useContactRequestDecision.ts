import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { residentConnectRepository } from '../data/residentConnect.repository';

export function useContactRequestDecision() {
  const mutation = useRepositoryMutation((input: { requestId: string }) =>
    residentConnectRepository.acceptContactRequest(input.requestId)
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
