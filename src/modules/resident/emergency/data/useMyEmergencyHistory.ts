import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';

export function useMyEmergencyHistory(filters?: Record<string, string>) {
  return useRepositoryResult(async () => {
    const res = await emergencySafetyRepository.getMyEmergencyHistory(filters);
    return { ok: true, data: res };
  }, [JSON.stringify(filters)]);
}
