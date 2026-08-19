import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';

export function useEmergencyTimeline(incidentId: string) {
  return useRepositoryResult(async () => {
    const res = await emergencySafetyRepository.getEmergencyTimeline(incidentId);
    return { ok: true, data: res };
  }, [incidentId]);
}
