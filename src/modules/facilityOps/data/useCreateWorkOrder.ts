import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function useCreateWorkOrder() {
  return useRepositoryMutation(facilityOpsRepository.createWorkOrder);
}
