import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { gateRepository } from './gate.repository';

export function useOfflineQueue() {
  return useRepositoryResult(() => gateRepository.offlineQueue(), []);
}

