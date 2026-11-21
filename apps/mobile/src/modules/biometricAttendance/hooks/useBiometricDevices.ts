import { useRepositoryMutation, useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { biometricRepository } from '../data/biometricAttendance.repository';

type RegisterBiometricDeviceInput = { deviceName: string; location: string; vendorName: string };

export function useBiometricDevices() {
  const result = useRepositoryResult(() => biometricRepository.listBiometricDevices(), []);
  const registration = useRepositoryMutation((input: RegisterBiometricDeviceInput) => biometricRepository.registerBiometricDevice(input));
  return { ...result, registerDevice: registration.submit, isRegistering: registration.isSubmitting };
}
