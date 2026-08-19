import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { gateRepository } from './gate.repository';

export function useGuardPassDetail(passCode?: string) {
  return useRepositoryResult(() => gateRepository.passDetail(passCode), [passCode]);
}

