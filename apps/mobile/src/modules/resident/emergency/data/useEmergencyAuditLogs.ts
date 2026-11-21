import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';

export function useEmergencyAuditLogs(filters?: Record<string, string>) {
  return useRepositoryResult(async () => {
    const res = await emergencySafetyRepository.getEmergencyAuditLogs(filters);
    return { ok: true, data: res };
  }, [JSON.stringify(filters)]);
}
