import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { accountingRepository } from './accounting.repository';

export function useDefaulterReport() {
  return useRepositoryResult(() => accountingRepository.getDefaulters(), []);
}
