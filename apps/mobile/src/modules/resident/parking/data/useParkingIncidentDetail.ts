import { useRepositoryMutation, useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { parkingRepository } from './parking.repository';

export function useParkingIncidentDetail(incidentId: string) {
  return useRepositoryResult(
    () => parkingRepository.getParkingIncidentDetail(incidentId),
    [incidentId]
  );
}

export function useResolveParkingIncident() {
  return useRepositoryMutation((incidentId: string) =>
    parkingRepository.resolveParkingIncident(incidentId)
  );
}

export function useEscalateParkingIncident() {
  return useRepositoryMutation((incidentId: string) =>
    parkingRepository.escalateParkingIncident(incidentId)
  );
}

export function useReportFalseParkingResolution() {
  return useRepositoryMutation((incidentId: string) =>
    parkingRepository.reportFalseParkingResolution(incidentId)
  );
}
