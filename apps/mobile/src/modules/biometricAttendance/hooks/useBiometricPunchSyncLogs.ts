import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { biometricRepository } from '../data/biometricAttendance.repository';

export function useBiometricPunchSyncLogs() {
  return useRepositoryResult(() => biometricRepository.listBiometricPunchSyncLogs(), []);
}
