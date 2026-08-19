import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { EmergencyContact } from '../../../../shared/types/emergency.types';
import type { EmergencyContactDto } from './emergency.dto';
import { mapEmergencyContactDtoToDomain } from './emergency.mapper';

export const emergencyApiSource = {
  async contacts(): Promise<RepositoryResult<EmergencyContact[]>> {
    try {
      const dtos = await apiClient.get<EmergencyContactDto[]>(apiEndpoints.emergencies.active);
      return repositorySuccess(dtos.map(mapEmergencyContactDtoToDomain));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async triggerSosAlert(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async triggerMedicalEmergency(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async triggerFireAlert(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async triggerLiftStuckAlert(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async acknowledgeEmergencyAlert(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async getIncidentTimeline(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async submitSeniorDailyCheckIn(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },

  async listEmergencyVolunteers(params?: JsonValue) {
    throw new Error('Backend Integration required');
  },
};

