import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { gateRepository } from './gate.repository';

export function useShiftSummary() {
  return useRepositoryResult(() => gateRepository.shiftSummary(), []);
}

