import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { documentRepository } from './document.repository';
import { useMockStore } from '../../../../core/mockStore/useMockStore';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useDocuments() {
  const { state } = useMockStore();
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  const result = useRepositoryResult(() => documentRepository.allDocuments(context), [context.dataScopeKey]);

  const scopedResDocs = state.documents.filter(
    (d) => d.flatNumber === activeContext.flatNumber
  );

  return {
    ...result,
    data: [...scopedResDocs, ...(result.data || []).filter(d => d.isSocietyDoc)],
  };
}

export function useResidentDocuments() {
  const { state } = useMockStore();
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  const result = useRepositoryResult(() => documentRepository.residentDocuments(context), [context.dataScopeKey]);

  const scopedResDocs = state.documents.filter(
    (d) => d.flatNumber === activeContext.flatNumber
  );

  return {
    ...result,
    data: scopedResDocs,
  };
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
