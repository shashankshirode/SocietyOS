import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { reportsRepository } from '../data/reports.repository';

export function useComplaintSlaReport() {
  return useRepositoryResult(() => reportsRepository.getComplaintSlaReport(), []);
}
