import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import type { ParkingIncidentListParams } from './parking.dto';
import { parkingRepository } from './parking.repository';

export function useParkingIncidents(params: ParkingIncidentListParams = {}) {
  return useRepositoryResult(
    () => parkingRepository.getParkingIncidents(params),
    [params.unitId, params.status, params.query]
  );
}
