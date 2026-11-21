import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';

export function useInterFlatHome() {
  return useRepositoryResult(() => interFlatRepository.getInterFlatHome(), []);
}
