import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { DocumentsRepository } from '../data/documents.repository';
import { repositorySuccess } from '../../../../core/repositories/repository.types';

export function useDocumentsByCategory() {
  const mutation = useRepositoryMutation(async (input: Parameters<typeof DocumentsRepository.listDocumentsByCategory>[0]) =>
    repositorySuccess(await DocumentsRepository.listDocumentsByCategory(input))
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
