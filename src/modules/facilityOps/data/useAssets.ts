import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import type { OpsListParams } from './facilityOps.dto';
import { facilityOpsRepository } from './facilityOps.repository';

export function useAssets(params: OpsListParams = {}) {
  return useRepositoryResult(() => facilityOpsRepository.getAssets(params), [params.query, params.filter]);
}
