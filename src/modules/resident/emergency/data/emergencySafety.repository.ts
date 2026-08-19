import { resolveDataSource } from '../../../../core/dataSource/dataSourceResolver';
import { emergencySafetyMockSource } from './emergencySafety.mockSource';
import { emergencySafetyApiSource } from './emergencySafety.apiSource';
import type { CreateSosInput, CreateEmergencyIncidentInput, EmergencyContact, EmergencyTimelineEvent } from '../../../../shared/types/emergency.types';
import type { SeniorCareProfile, SubmitSeniorCheckInInput } from '../../../../shared/types/seniorCare.types';
import type { RegisterVolunteerInput } from '../../../../shared/types/volunteer.types';
import type { CreateBroadcastInput, CreateSafetyDrillInput, CreatePostIncidentReviewInput } from '../../../../shared/types/safety.types';
import type { ResponderAcknowledgementInput } from './emergencySafety.types';

const isMock = !resolveDataSource('residentEmergency').isApi;

export const emergencySafetyRepository = {
  getEmergencyHome: () => {
    return isMock
      ? emergencySafetyMockSource.getEmergencyHome()
      : emergencySafetyApiSource.getEmergencyHome();
  },

  createSos: (input: CreateSosInput) => {
    return isMock
      ? emergencySafetyMockSource.createSos(input)
      : emergencySafetyApiSource.createSos(input);
  },

  createEmergencyIncident: (input: CreateEmergencyIncidentInput) => {
    return isMock
      ? emergencySafetyMockSource.createEmergencyIncident(input)
      : emergencySafetyApiSource.createEmergencyIncident(input);
  },

  getActiveEmergencyDetail: (incidentId: string) => {
    return isMock
      ? emergencySafetyMockSource.getActiveEmergencyDetail(incidentId)
      : emergencySafetyApiSource.getActiveEmergencyDetail(incidentId);
  },

  getEmergencyTimeline: (incidentId: string) => {
    return isMock
      ? emergencySafetyMockSource.getEmergencyTimeline(incidentId)
      : emergencySafetyApiSource.getEmergencyTimeline(incidentId);
  },

  addEmergencyTimelineEvent: (incidentId: string, input: { eventType: string; note?: string; source: EmergencyTimelineEvent['source'] }) => {
    return isMock
      ? emergencySafetyMockSource.addEmergencyTimelineEvent(incidentId, input)
      : emergencySafetyApiSource.addEmergencyTimelineEvent(incidentId, input);
  },

  acknowledgeIncident: (incidentId: string, input: { note?: string } = {}) => {
    return isMock
      ? emergencySafetyMockSource.acknowledgeIncident(incidentId, input)
      : emergencySafetyApiSource.acknowledgeIncident(incidentId, input);
  },

  markResponderReached: (incidentId: string, input: { note?: string } = {}) => {
    return isMock
      ? emergencySafetyMockSource.markResponderReached(incidentId, input)
      : emergencySafetyApiSource.markResponderReached(incidentId, input);
  },

  escalateIncident: (incidentId: string, input: { note: string }) => {
    return isMock
      ? emergencySafetyMockSource.escalateIncident(incidentId, input)
      : emergencySafetyApiSource.escalateIncident(incidentId, input);
  },

  markResidentSafe: (incidentId: string, input: { note?: string } = {}) => {
    return isMock
      ? emergencySafetyMockSource.markResidentSafe(incidentId, input)
      : emergencySafetyApiSource.markResidentSafe(incidentId, input);
  },

  closeIncident: (incidentId: string, input: { closureSummary: string }) => {
    return isMock
      ? emergencySafetyMockSource.closeIncident(incidentId, input)
      : emergencySafetyApiSource.closeIncident(incidentId, input);
  },

  getMyEmergencyHistory: (filters?: Record<string, string>) => {
    return isMock
      ? emergencySafetyMockSource.getMyEmergencyHistory(filters)
      : emergencySafetyApiSource.getMyEmergencyHistory(filters);
  },

  getEmergencyContacts: () => {
    return isMock
      ? emergencySafetyMockSource.getEmergencyContacts()
      : emergencySafetyApiSource.getEmergencyContacts();
  },

  createEmergencyContact: (input: Omit<EmergencyContact, 'id' | 'mobileMasked' | 'createdAt'>) => {
    return isMock
      ? emergencySafetyMockSource.createEmergencyContact(input)
      : emergencySafetyApiSource.createEmergencyContact(input);
  },

  updateEmergencyContact: (contactId: string, input: Partial<EmergencyContact>) => {
    return isMock
      ? emergencySafetyMockSource.updateEmergencyContact(contactId, input)
      : emergencySafetyApiSource.updateEmergencyContact(contactId, input);
  },

  deleteEmergencyContact: (contactId: string) => {
    return isMock
      ? emergencySafetyMockSource.deleteEmergencyContact(contactId)
      : emergencySafetyApiSource.deleteEmergencyContact(contactId);
  },

  getFamilyConnect: () => {
    return isMock
      ? emergencySafetyMockSource.getFamilyConnect()
      : emergencySafetyApiSource.getFamilyConnect();
  },

  updateFamilyConnect: (input: { enabled: boolean }) => {
    return isMock
      ? emergencySafetyMockSource.updateFamilyConnect(input)
      : emergencySafetyApiSource.updateFamilyConnect(input);
  },

  getSeniorCareProfile: () => {
    return isMock
      ? emergencySafetyMockSource.getSeniorCareProfile()
      : emergencySafetyApiSource.getSeniorCareProfile();
  },

  updateSeniorCareProfile: (input: Partial<SeniorCareProfile>) => {
    return isMock
      ? emergencySafetyMockSource.updateSeniorCareProfile(input)
      : emergencySafetyApiSource.updateSeniorCareProfile(input);
  },

  submitSeniorCheckIn: (input: SubmitSeniorCheckInInput) => {
    return isMock
      ? emergencySafetyMockSource.submitSeniorCheckIn(input)
      : emergencySafetyApiSource.submitSeniorCheckIn(input);
  },

  getSeniorCheckIns: (filters?: Record<string, string>) => {
    return isMock
      ? emergencySafetyMockSource.getSeniorCheckIns(filters)
      : emergencySafetyApiSource.getSeniorCheckIns(filters);
  },

  getSeniorInactivityAlerts: (filters?: Record<string, string>) => {
    return isMock
      ? emergencySafetyMockSource.getSeniorInactivityAlerts(filters)
      : emergencySafetyApiSource.getSeniorInactivityAlerts(filters);
  },

  acknowledgeSeniorInactivityAlert: (alertId: string, input: { notes?: string }) => {
    return isMock
      ? emergencySafetyMockSource.acknowledgeSeniorInactivityAlert(alertId, input)
      : emergencySafetyApiSource.acknowledgeSeniorInactivityAlert(alertId, input);
  },

  escalateSeniorInactivityAlert: (alertId: string, input: { notes?: string }) => {
    return isMock
      ? emergencySafetyMockSource.escalateSeniorInactivityAlert(alertId, input)
      : emergencySafetyApiSource.escalateSeniorInactivityAlert(alertId, input);
  },

  getEmergencyVolunteers: (filters?: Record<string, string>) => {
    return isMock
      ? emergencySafetyMockSource.getEmergencyVolunteers(filters)
      : emergencySafetyApiSource.getEmergencyVolunteers(filters);
  },

  registerEmergencyVolunteer: (input: RegisterVolunteerInput) => {
    return isMock
      ? emergencySafetyMockSource.registerEmergencyVolunteer(input)
      : emergencySafetyApiSource.registerEmergencyVolunteer(input);
  },

  getVolunteerAlertDetail: (alertId: string) => {
    return isMock
      ? emergencySafetyMockSource.getVolunteerAlertDetail(alertId)
      : emergencySafetyApiSource.getVolunteerAlertDetail(alertId);
  },

  acceptVolunteerAlert: (alertId: string, input: { note?: string }) => {
    return isMock
      ? emergencySafetyMockSource.acceptVolunteerAlert(alertId, input)
      : emergencySafetyApiSource.acceptVolunteerAlert(alertId, input);
  },

  declineVolunteerAlert: (alertId: string, input: { note?: string }) => {
    return isMock
      ? emergencySafetyMockSource.declineVolunteerAlert(alertId, input)
      : emergencySafetyApiSource.declineVolunteerAlert(alertId, input);
  },

  getGuardEmergencyConsole: () => {
    return isMock
      ? emergencySafetyMockSource.getGuardEmergencyConsole()
      : emergencySafetyApiSource.getGuardEmergencyConsole();
  },

  getFacilityEmergencyConsole: () => {
    return isMock
      ? emergencySafetyMockSource.getFacilityEmergencyConsole()
      : emergencySafetyApiSource.getFacilityEmergencyConsole();
  },

  submitResponderAcknowledgement: (input: ResponderAcknowledgementInput) => {
    return isMock
      ? emergencySafetyMockSource.submitResponderAcknowledgement(input)
      : emergencySafetyApiSource.submitResponderAcknowledgement(input);
  },

  createEmergencyBroadcast: (input: CreateBroadcastInput) => {
    return isMock
      ? emergencySafetyMockSource.createEmergencyBroadcast(input)
      : emergencySafetyApiSource.createEmergencyBroadcast(input);
  },

  getSafetyInstructions: (filters?: Record<string, string>) => {
    return isMock
      ? emergencySafetyMockSource.getSafetyInstructions(filters)
      : emergencySafetyApiSource.getSafetyInstructions(filters);
  },

  getSafetyDrills: (filters?: Record<string, string>) => {
    return isMock
      ? emergencySafetyMockSource.getSafetyDrills(filters)
      : emergencySafetyApiSource.getSafetyDrills(filters);
  },

  createSafetyDrill: (input: CreateSafetyDrillInput) => {
    return isMock
      ? emergencySafetyMockSource.createSafetyDrill(input)
      : emergencySafetyApiSource.createSafetyDrill(input);
  },

  createPostIncidentReview: (input: CreatePostIncidentReviewInput) => {
    return isMock
      ? emergencySafetyMockSource.createPostIncidentReview(input)
      : emergencySafetyApiSource.createPostIncidentReview(input);
  },

  getEmergencySettings: () => {
    return isMock
      ? emergencySafetyMockSource.getEmergencySettings()
      : emergencySafetyApiSource.getEmergencySettings();
  },

  getEmergencyAuditLogs: (filters?: Record<string, string>) => {
    return isMock
      ? emergencySafetyMockSource.getEmergencyAuditLogs(filters)
      : emergencySafetyApiSource.getEmergencyAuditLogs(filters);
  },
};
