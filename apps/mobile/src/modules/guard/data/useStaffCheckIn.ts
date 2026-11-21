import { useRepositoryMutation, useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { gateRepository } from './gate.repository';

export function useStaffToday() {
  return useRepositoryResult(() => gateRepository.staffToday(), []);
}

export function useStaffCheckIn() {
  return useRepositoryMutation((staffId: string) => gateRepository.checkInStaff(staffId));
}

