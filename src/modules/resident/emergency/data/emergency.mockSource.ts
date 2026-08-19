import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import { mockEmergencyContacts } from '../../../../shared/mock/emergency.mock';
import type { EmergencyContact } from '../../../../shared/types/emergency.types';

export const emergencyMockSource = {
  async contacts(): Promise<RepositoryResult<EmergencyContact[]>> {
    await withMockDelay();
    return repositorySuccess(mockEmergencyContacts);
  },

  async triggerSosAlert(params?: JsonValue) {
    return [{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE'
    }];
  },

  async triggerMedicalEmergency(params?: JsonValue) {
    return [{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE'
    }];
  },

  async triggerFireAlert(params?: JsonValue) {
    return [{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE'
    }];
  },

  async triggerLiftStuckAlert(params?: JsonValue) {
    return [{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE'
    }];
  },

  async acknowledgeEmergencyAlert(params?: JsonValue) {
    return [{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE'
    }];
  },

  async getIncidentTimeline(params?: JsonValue) {
    return [{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE'
    }];
  },

  async submitSeniorDailyCheckIn(params?: JsonValue) {
    return [{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE'
    }];
  },

  async listEmergencyVolunteers(params?: JsonValue) {
    return [{
      id: 'mock-1',
      name: 'Mock Item 1',
      status: 'ACTIVE'
    }];
  },
};

