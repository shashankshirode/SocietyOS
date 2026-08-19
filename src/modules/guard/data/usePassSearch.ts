import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { gateRepository } from './gate.repository';

export function usePassSearch() {
  return useRepositoryMutation((query: string) => gateRepository.searchPass(query));
}

