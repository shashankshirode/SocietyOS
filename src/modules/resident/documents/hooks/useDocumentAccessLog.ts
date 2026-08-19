import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { DocumentsRepository } from '../data/documents.repository';
import { repositorySuccess } from '../../../../core/repositories/repository.types';

export function useDocumentAccessLog() {
  const mutation = useRepositoryMutation(async (input: Parameters<typeof DocumentsRepository.listDocumentAccessLogs>[0]) =>
    repositorySuccess(await DocumentsRepository.listDocumentAccessLogs(input))
  );

  return {
    data: [] as const,
    submit: mutation.submit,
    isSubmitting: mutation.isSubmitting,
    error: mutation.error,
  };
}
