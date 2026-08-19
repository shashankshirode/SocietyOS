import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { gateRepository } from './gate.repository';

export function useExpectedVisitors() {
  return useRepositoryResult(() => gateRepository.expectedVisitors(), []);
}

