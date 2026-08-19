import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { accountingRepository } from './accounting.repository';

export function useTreasurerDashboard() {
  return useRepositoryResult(() => accountingRepository.getDashboard(), []);
}
