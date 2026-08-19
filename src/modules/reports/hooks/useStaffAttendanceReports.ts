import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { reportsRepository } from '../data/reports.repository';

export function useStaffAttendanceReports() {
  return useRepositoryResult(() => reportsRepository.getStaffAttendanceReports(), []);
}
