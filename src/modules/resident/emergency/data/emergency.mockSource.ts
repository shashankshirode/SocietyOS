import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import { mockEmergencyContacts } from '../../../../shared/mock/emergency.mock';
import type { EmergencyContact } from '../../../../shared/types/emergency.types';
import { emergencyRoutingService, type EmergencyCategory, type EmergencyIncident } from '../../../../core/emergency/EmergencyRoutingService';
import { getCurrentSession } from '../../../../core/auth/sessionStore';
import { MOCK_PERSONAS } from '../../../../core/identity/personaRegistry';

function getActivePersonaContext() {
  const session = getCurrentSession();
  const personaKey = (session?.personaKey ?? 'rohan') as keyof typeof MOCK_PERSONAS;
  return MOCK_PERSONAS[personaKey] ?? MOCK_PERSONAS.rohan;
}

export const emergencyMockSource = {
  async contacts(): Promise<RepositoryResult<EmergencyContact[]>> {
    await withMockDelay();
    return repositorySuccess(mockEmergencyContacts);
  },

  async triggerSosAlert(params?: any): Promise<RepositoryResult<EmergencyIncident>> {
    await withMockDelay(300);
    const context = getActivePersonaContext();
    const location = typeof params === 'object' && params?.location ? String(params.location) : undefined;
    const incident = await emergencyRoutingService.triggerEmergency(context, 'GENERIC_SOS', location);
    return repositorySuccess(incident);
  },

  async triggerMedicalEmergency(params?: any): Promise<RepositoryResult<EmergencyIncident>> {
    await withMockDelay(300);
    const context = getActivePersonaContext();
    const incident = await emergencyRoutingService.triggerEmergency(context, 'MEDICAL', 'Medical Assistance Required');
    return repositorySuccess(incident);
  },

  async triggerFireAlert(params?: any): Promise<RepositoryResult<EmergencyIncident>> {
    await withMockDelay(300);
    const context = getActivePersonaContext();
    const incident = await emergencyRoutingService.triggerEmergency(context, 'FIRE', 'Fire Alert Reported');
    return repositorySuccess(incident);
  },

  async triggerLiftStuckAlert(params?: any): Promise<RepositoryResult<EmergencyIncident>> {
    await withMockDelay(300);
    const context = getActivePersonaContext();
    const incident = await emergencyRoutingService.triggerEmergency(context, 'LIFT', 'Passenger Trapped in Lift');
    return repositorySuccess(incident);
  },

  async acknowledgeEmergencyAlert(params?: any): Promise<RepositoryResult<EmergencyIncident | null>> {
    await withMockDelay(300);
    const context = getActivePersonaContext();
    const incidentId = typeof params === 'string' ? params : params?.incidentId ?? params?.id;
    const updated = await emergencyRoutingService.acknowledgeEmergency(context, incidentId);
    return repositorySuccess(updated);
  },

  async getIncidentTimeline(params?: any): Promise<RepositoryResult<readonly EmergencyIncident[]>> {
    await withMockDelay();
    return repositorySuccess(emergencyRoutingService.getActiveIncidents());
  },

  async listEmergencyVolunteers(params?: any): Promise<RepositoryResult<any[]>> {
    await withMockDelay();
    return repositorySuccess([
      {
        id: 'vol-01',
        name: 'Dr. Ramesh Kulkarni',
        unit: 'A-201',
        phone: '+919876543220',
        skills: ['Doctor', 'CPR Certified'],
        isAvailable: true,
      },
    ]);
  },

  async submitSeniorDailyCheckIn(params?: any) {
    return [{
      id: 'checkin-1',
      status: 'CONFIRMED',
      timestamp: new Date().toISOString(),
    }];
  },
};
