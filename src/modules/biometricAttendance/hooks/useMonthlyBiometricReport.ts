import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { biometricRepository } from '../data/biometricAttendance.repository';

export function useMonthlyBiometricReport() {
  return useRepositoryResult(() => biometricRepository.getMonthlyBiometricReport(), []);
}
