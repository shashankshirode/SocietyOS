import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';

export function useIssueTypeSelection() {
  return useRepositoryResult(async () => {
    const res = await interFlatRepository.getIssueTypes();
    return { ok: true, data: res };
  }, []);
}
