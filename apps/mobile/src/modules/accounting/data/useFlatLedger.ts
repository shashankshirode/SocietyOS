import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { accountingRepository } from './accounting.repository';

export function useFlatLedger(unitId: string) {
  return useRepositoryResult(() => accountingRepository.getFlatLedger(unitId), [unitId]);
}
