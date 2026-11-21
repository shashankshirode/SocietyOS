import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { documentRepository } from './document.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useDocuments() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryResult(() => documentRepository.allDocuments(context), [context.dataScopeKey]);
}

export function useResidentDocuments() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryResult(() => documentRepository.residentDocuments(context), [context.dataScopeKey]);
}

export function useSocietyDocuments() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  const result = useRepositoryResult(() => documentRepository.societyDocuments(context), [context.dataScopeKey]);
  return result;
}
