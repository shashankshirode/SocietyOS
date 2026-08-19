import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';

export function useEmergencyVolunteers(filters?: Record<string, string>) {
  return useRepositoryResult(async () => {
    const res = await emergencySafetyRepository.getEmergencyVolunteers(filters);
    return { ok: true, data: res };
  }, [JSON.stringify(filters)]);
}
