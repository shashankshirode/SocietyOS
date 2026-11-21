import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import type { OpsListParams } from './facilityOps.dto';
import { facilityOpsRepository } from './facilityOps.repository';

export function useInventory(params: OpsListParams = {}) {
  return useRepositoryResult(() => facilityOpsRepository.getInventoryItems(params), [params.query, params.filter]);
}
