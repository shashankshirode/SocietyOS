import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { documentRepository } from './document.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useDocumentDetail(documentId: string) {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryResult(() => documentRepository.detail(context, documentId), [documentId, context.dataScopeKey]);
}
export default useDocumentDetail;
