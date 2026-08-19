import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { accountingRepository } from './accounting.repository';

export function useChargeHeads() {
  return useRepositoryResult(() => accountingRepository.getChargeHeads(), []);
}
