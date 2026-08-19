import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { documentRepository } from './document.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useDocumentAccessLogs(documentId?: string) {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryResult(
    () => documentRepository.accessLogs(
      { activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey },
      documentId
    ),
    [documentId, activeContext.dataScopeKey]
  );
}
