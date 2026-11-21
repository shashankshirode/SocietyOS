import { useRepositoryResult, useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { biometricRepository } from '../data/biometricAttendance.repository';

export function useBiometricReadiness() {
  return useRepositoryResult(() => biometricRepository.getBiometricDevices(), []);
}

export function useSyncBiometricData() {
  return useRepositoryMutation(({ id }: { id: string }) =>
    biometricRepository.syncBiometricData(id)
  );
}
