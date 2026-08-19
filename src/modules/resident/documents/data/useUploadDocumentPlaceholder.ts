import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import type { UploadDocumentPlaceholderInput } from './document.dto';
import { documentRepository } from './document.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useUploadDocumentPlaceholder() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryMutation((input: UploadDocumentPlaceholderInput) =>
    documentRepository.uploadPlaceholder(context, input)
  );
}
export default useUploadDocumentPlaceholder;
