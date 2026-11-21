import { emergencySafetyRepository } from './emergencySafety.repository';
import type { EmergencyVolunteer, VolunteerAlert, VolunteerType, VolunteerAvailability, VolunteerVerificationStatus, VolunteerAlertStatus, RegisterVolunteerInput } from '../../../../shared/types/volunteer.types';
import type { EmergencyIncident } from '../../../../shared/types/emergency.types';
import { generateClientOperationId } from './emergencySafety.types';

class VolunteerNetworkService {
  private static instance: VolunteerNetworkService;

  static getInstance(): VolunteerNetworkService {
    if (!VolunteerNetworkService.instance) {
      VolunteerNetworkService.instance = new VolunteerNetworkService();
    }
    return VolunteerNetworkService.instance;
  }

  async getVolunteers(filters?: Record<string, string>): Promise<EmergencyVolunteer[]> {
    return emergencySafetyRepository.getEmergencyVolunteers(filters);
  }

  async registerVolunteer(
    input: RegisterVolunteerInput & { clientOperationId?: string }
  ): Promise<EmergencyVolunteer> {
    const clientOperationId = input.clientOperationId ?? generateClientOperationId('vol-reg');
    return emergencySafetyRepository.registerEmergencyVolunteer({
      ...input,
      clientOperationId,
    });
  }

  async getVolunteerAlertDetail(alertId: string): Promise<VolunteerAlert | null> {
    const result = await emergencySafetyRepository.getVolunteerAlertDetail(alertId);
    return result ?? null;
  }

  async acceptVolunteerAlert(
    alertId: string,
    input: { note?: string; clientOperationId?: string }
  ): Promise<VolunteerAlert> {
    const clientOperationId = input.clientOperationId ?? generateClientOperationId('vol-accept');
    return emergencySafetyRepository.acceptVolunteerAlert(alertId, {
      ...input,
      clientOperationId,
    });
  }

  async declineVolunteerAlert(
    alertId: string,
    input: { note?: string; clientOperationId?: string }
  ): Promise<VolunteerAlert> {
    const clientOperationId = input.clientOperationId ?? generateClientOperationId('vol-decline');
    return emergencySafetyRepository.declineVolunteerAlert(alertId, {
      ...input,
      clientOperationId,
    });
  }

  async getEligibleVolunteers(
    incident: EmergencyIncident,
    radiusMeters: number = 500
  ): Promise<EmergencyVolunteer[]> {
    const allVolunteers = await this.getVolunteers({ type: 'ALL' });
    
    return allVolunteers.filter(volunteer => {
      if (volunteer.availability === 'NOT_AVAILABLE') return false;
      if (volunteer.verificationStatus === 'REJECTED' || volunteer.verificationStatus === 'EXPIRED') return false;
      
      const relevantTypes = this.getRelevantVolunteerTypes(incident.emergencyType);
      if (!relevantTypes.includes(volunteer.volunteerType) && volunteer.volunteerType !== 'OTHER') {
        return false;
      }
      
      return true;
    });
  }

  private getRelevantVolunteerTypes(emergencyType: string): VolunteerType[] {
    const typeMap: Record<string, VolunteerType[]> = {
      MEDICAL: ['DOCTOR', 'NURSE', 'FIRST_AID', 'BLOOD_DONOR'],
      FIRE: ['FIRE_SAFETY_TRAINED', 'DISASTER_VOLUNTEER'],
      LIFT_STUCK: ['ELDER_SUPPORT'],
      SECURITY_THREAT: ['DISASTER_VOLUNTEER'],
      WATER: ['DISASTER_VOLUNTEER'],
      ELECTRICAL: ['DISASTER_VOLUNTEER'],
      SENIOR_HELP: ['ELDER_SUPPORT', 'DOCTOR', 'NURSE', 'FIRST_AID'],
      ACCIDENT: ['FIRST_AID', 'DOCTOR', 'NURSE'],
      CHILD_SAFETY: ['ELDER_SUPPORT'],
      PET_EMERGENCY: ['PET_RESCUE'],
    };
    return typeMap[emergencyType] ?? [];
  }

  async dispatchVolunteerAlerts(
    incident: EmergencyIncident,
    volunteers: EmergencyVolunteer[]
  ): Promise<VolunteerAlert[]> {
    const alerts: VolunteerAlert[] = [];
    
    for (const volunteer of volunteers) {
      const alert: VolunteerAlert = {
        id: `valert-${generateClientOperationId('valert')}`,
        incidentId: incident.id,
        emergencyType: incident.emergencyType,
        location: incident.location,
        severity: incident.severity,
        volunteerId: volunteer.id,
        volunteerName: volunteer.name,
        status: 'PENDING',
        alertedAt: new Date().toISOString(),
      };
      alerts.push(alert);
    }
    
    return alerts;
  }

  async updateVerificationStatus(
    volunteerId: string,
    status: VolunteerVerificationStatus,
    verifiedBy: string
  ): Promise<void> {
    // In real implementation, this would update the backend
  }

  async updateAvailability(
    volunteerId: string,
    availability: VolunteerAvailability
  ): Promise<void> {
    // In real implementation, this would update the backend
  }
}

export const volunteerNetworkService = VolunteerNetworkService.getInstance();