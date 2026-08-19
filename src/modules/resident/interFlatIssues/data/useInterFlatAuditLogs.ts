import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';
import type { InterFlatQuery } from './interFlat.dto';

export function useInterFlatAuditLogs(params?: InterFlatQuery) {
  return useRepositoryResult(() => interFlatRepository.getInterFlatAuditLogs(params), [JSON.stringify(params)]);
}
