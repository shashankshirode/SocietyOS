import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { reportsRepository } from '../data/reports.repository';

export function useComplianceReports() {
  return useRepositoryResult(() => reportsRepository.getComplianceReports(), []);
}
