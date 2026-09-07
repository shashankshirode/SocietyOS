import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import { mockEmergencyContacts } from '../../../../shared/mock/emergency.mock';
import type { EmergencyContact } from '../../../../shared/types/emergency.types';
import { emergencyRoutingService, type EmergencyCategory, type EmergencyIncident } from '../../../../core/emergency/EmergencyRoutingService';
import { getCurrentSession } from '../../../../core/auth/sessionStore';
import { MOCK_PERSONAS } from '../../../../core/identity/personaRegistry';

interface SosParams {
  location?: string;
}

interface MedicalEmergencyParams {
  location?: string;
}

interface FireAlertParams {
  location?: string;
}

interface LiftStuckAlertParams {
  location?: string;
}

interface AcknowledgeParams {
  incidentId: string;
}

interface TimelineParams {
  limit?: number;
}

interface VolunteerParams {
  limit?: number;
}

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

  async triggerSosAlert(params?: SosParams): Promise<RepositoryResult<EmergencyIncident>> {
    await withMockDelay(300);
    const context = getActivePersonaContext();
    const location = params?.location;
    const incident = await emergencyRoutingService.triggerEmergency(context, 'GENERIC_SOS', location);
    return repositorySuccess(incident);
  },

  async triggerMedicalEmergency(params?: MedicalEmergencyParams): Promise<RepositoryResult<EmergencyIncident>> {
    await withMockDelay(300);
    const context = getActivePersonaContext();
    const location = params?.location ?? 'Medical Assistance Required';
    const incident = await emergencyRoutingService.triggerEmergency(context, 'MEDICAL', location);
    return repositorySuccess(incident);
  },

  async triggerFireAlert(params?: FireAlertParams): Promise<RepositoryResult<EmergencyIncident>> {
    await withMockDelay(300);
    const context = getActivePersonaContext();
    const location = params?.location ?? 'Fire Alert Reported';
    const incident = await emergencyRoutingService.triggerEmergency(context, 'FIRE', location);
    return repositorySuccess(incident);
  },

  async triggerLiftStuckAlert(params?: LiftStuckAlertParams): Promise<RepositoryResult<EmergencyIncident>> {
    await withMockDelay(300);
    const context = getActivePersonaContext();
    const location = params?.location ?? 'Passenger Trapped in Lift';
    const incident = await emergencyRoutingService.triggerEmergency(context, 'LIFT', location);
    return repositorySuccess(incident);
  },

  async acknowledgeEmergencyAlert(params?: AcknowledgeParams): Promise<RepositoryResult<EmergencyIncident | null>> {
    await withMockDelay(300);
    const context = getActivePersonaContext();
    const incidentId = params?.incidentId ?? '';
    const updated = await emergencyRoutingService.acknowledgeEmergency(context, incidentId);
    return repositorySuccess(updated);
  },

  async getIncidentTimeline(params?: TimelineParams): Promise<RepositoryResult<readonly EmergencyIncident[]>> {
    await withMockDelay();
    return repositorySuccess(emergencyRoutingService.getActiveIncidents());
  },

  async listEmergencyVolunteers(params?: VolunteerParams): Promise<RepositoryResult<readonly { id: string; name: string; unit: string; phone: string; skills: string[]; isAvailable: boolean }[]>> {
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

  async submitSeniorDailyCheckIn(): Promise<readonly { id: string; status: string; timestamp: string }[]> {
    return [{
      id: 'checkin-1',
      status: 'CONFIRMED',
      timestamp: new Date().toISOString(),
    }];
  },
};
