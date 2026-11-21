import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { DocumentsRepository } from '../data/documents.repository';
import { repositorySuccess } from '../../../../core/repositories/repository.types';

export function useRestrictedDocumentAccess() {
  const mutation = useRepositoryMutation(async (input: Parameters<typeof DocumentsRepository.requestDocumentAccess>[0]) =>
    repositorySuccess(await DocumentsRepository.requestDocumentAccess(input))
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
