import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { facilityOpsRepository } from './facilityOps.repository';

export function usePreventiveMaintenance() {
  return useRepositoryResult(() => facilityOpsRepository.getPreventiveMaintenanceSchedule(), []);
}
