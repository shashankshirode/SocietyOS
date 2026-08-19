import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { reportsRepository } from '../data/reports.repository';

export function useSocietyHealthScore() {
  return useRepositoryResult(() => reportsRepository.getSocietyHealthScore(), []);
}
