import { useRepositoryMutation, useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import type { EmergencyAlertRequest } from './gate.dto';
import { gateRepository } from './gate.repository';

export function useEmergencyTypes() {
  return useRepositoryResult(() => gateRepository.emergencyTypes(), []);
}

export function useEmergencyAlert() {
  return useRepositoryMutation((payload: EmergencyAlertRequest) => gateRepository.sendEmergencyAlert(payload));
}

