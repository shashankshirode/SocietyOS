import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { reportsRepository } from '../data/reports.repository';

export function useCommunityReports() {
  return useRepositoryResult(() => reportsRepository.getCommunityReports(), []);
}
