import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';

export function useGuardEmergencyConsole() {
  return useRepositoryResult(async () => {
    const res = await emergencySafetyRepository.getGuardEmergencyConsole();
    return { ok: true, data: res };
  }, []);
}
