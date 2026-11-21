import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { reportsRepository } from '../data/reports.repository';

export function useCollectionReport() {
  return useRepositoryResult(() => reportsRepository.getCollectionReport(), []);
}
