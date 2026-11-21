import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { reportsRepository } from '../data/reports.repository';

export function useVendorPerformanceReport() {
  return useRepositoryResult(() => reportsRepository.getVendorPerformanceReport(), []);
}
