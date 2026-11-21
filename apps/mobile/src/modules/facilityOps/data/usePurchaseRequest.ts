import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function usePurchaseRequest() {
  return useRepositoryMutation(facilityOpsRepository.createPurchaseRequest);
}
