import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { reportsRepository } from '../data/reports.repository';

export function useSocietyHealthScoreDimension(id: string) {
  return useRepositoryResult(() => reportsRepository.getSocietyHealthScoreDimension(id), [id]);
}
