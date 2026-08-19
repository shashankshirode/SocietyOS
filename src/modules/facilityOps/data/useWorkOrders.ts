import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import type { OpsListParams } from './facilityOps.dto';
import { facilityOpsRepository } from './facilityOps.repository';

export function useWorkOrders(params: OpsListParams = {}) {
  return useRepositoryResult(() => facilityOpsRepository.getWorkOrders(params), [params.query, params.filter]);
}
