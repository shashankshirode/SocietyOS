import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function useRegisterVendor() {
  return useRepositoryMutation(facilityOpsRepository.registerVendor);
}
