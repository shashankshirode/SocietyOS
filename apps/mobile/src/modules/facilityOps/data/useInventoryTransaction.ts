import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function useInventoryTransaction() {
  return useRepositoryMutation(facilityOpsRepository.createInventoryTransaction);
}
