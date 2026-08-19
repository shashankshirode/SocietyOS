import { useRepositoryMutation, useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { biometricRepository } from '../data/biometricAttendance.repository';

type ResolveUnknownEmployeeInput = { unknownCodeId: string; staffName: string };

export function useUnknownEmployeeCodeReview() {
  const result = useRepositoryResult(() => biometricRepository.listUnknownEmployeeCodes(), []);
  const resolution = useRepositoryMutation((input: ResolveUnknownEmployeeInput) => biometricRepository.resolveUnknownEmployeeCode(input));
  return { ...result, resolveUnknownEmployeeCode: resolution.submit, isResolving: resolution.isSubmitting };
}
