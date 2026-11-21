import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { biometricRepository } from '../data/biometricAttendance.repository';

export function useVendorBillingAttendanceSupport() {
  return useRepositoryResult(() => biometricRepository.getVendorBillingAttendanceSummary(), []);
}
