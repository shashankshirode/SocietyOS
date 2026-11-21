import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { reportsRepository } from '../data/reports.repository';

export function useSecurityReports() {
  return useRepositoryResult(() => reportsRepository.getSecurityReports(), []);
}
