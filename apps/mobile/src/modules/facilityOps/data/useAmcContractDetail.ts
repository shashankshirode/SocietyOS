import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function useAmcContractDetail(contractId: string) {
  return useRepositoryResult(() => facilityOpsRepository.getAmcContractDetail(contractId), [contractId]);
}
