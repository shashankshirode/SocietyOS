import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { gateRepository } from './gate.repository';

export function useGateActivity() {
  return useRepositoryResult(() => gateRepository.gateActivity(), []);
}

