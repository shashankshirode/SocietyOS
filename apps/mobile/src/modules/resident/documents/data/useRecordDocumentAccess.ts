import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { documentRepository } from './document.repository';
import type { RecordDocumentAccessInput } from './document.dto';

export function useRecordDocumentAccess() {
  const { activeContext } = useActiveResidentHome();
  return useRepositoryMutation((input: RecordDocumentAccessInput) =>
    documentRepository.recordAccess(
      { activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey },
      input
    )
  );
}
