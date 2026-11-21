import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from '../data/interFlat.repository';

export function useInterFlatDisputes() {
  return useRepositoryResult(async () => {
    const data = await interFlatRepository.getMyInterFlatIssues();
    return { ok: true, data };
  }, []);
}
