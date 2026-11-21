import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';

export function useInterFlatSettings() {
  return useRepositoryResult(() => interFlatRepository.getInterFlatSettings(), []);
}
