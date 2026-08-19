import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import type { OpsListParams } from './facilityOps.dto';
import { facilityOpsRepository } from './facilityOps.repository';

export function useAmcContracts(params: OpsListParams = {}) {
  return useRepositoryResult(() => facilityOpsRepository.getAmcContracts(params), [params.query, params.filter]);
}
