import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';

export function useEmergencyHome() {
  return useRepositoryResult(async () => {
    const res = await emergencySafetyRepository.getEmergencyHome();
    return { ok: true, data: res };
  }, []);
}
