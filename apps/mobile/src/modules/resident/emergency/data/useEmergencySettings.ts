import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';

export function useEmergencySettings() {
  return useRepositoryResult(async () => {
    const res = await emergencySafetyRepository.getEmergencySettings();
    return { ok: true, data: res };
  }, []);
}
