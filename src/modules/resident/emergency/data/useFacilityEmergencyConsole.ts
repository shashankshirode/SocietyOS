import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';

export function useFacilityEmergencyConsole() {
  return useRepositoryResult(async () => {
    const res = await emergencySafetyRepository.getFacilityEmergencyConsole();
    return { ok: true, data: res };
  }, []);
}
