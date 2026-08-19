import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { gateRepository } from './gate.repository';

export function useGuardDashboard() {
  return useRepositoryResult(() => gateRepository.getDashboard(), []);
}

