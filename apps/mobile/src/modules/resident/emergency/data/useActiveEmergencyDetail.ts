import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';

export function useActiveEmergencyDetail(incidentId: string) {
  return useRepositoryResult(async () => {
    const res = await emergencySafetyRepository.getActiveEmergencyDetail(incidentId);
    return { ok: true, data: res };
  }, [incidentId]);
}
