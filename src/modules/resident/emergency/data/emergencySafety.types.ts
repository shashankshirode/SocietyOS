import type { EmergencyIncident, EmergencyResponder } from '../../../../shared/types/emergency.types';

export type EmergencyQueryFilters = Record<string, string>;

export type GuardEmergencyConsoleData = {
  activeCount: number;
  acknowledgedCount: number;
  unacknowledgedCount: number;
  emergencies: EmergencyIncident[];
};

export type FacilityEmergencyConsoleData = {
  activeCount: number;
  escalatedCount: number;
  needsPostReviewCount: number;
  emergencies: EmergencyIncident[];
};

export type ResponderAcknowledgementInput = {
  incidentId: string;
  status: EmergencyResponder['status'];
  note?: string;
};

export type EmergencySettingsData = {
  sosRecipients: string[];
  guardEscalationMinutes: number;
  facilityEscalationMinutes: number;
  volunteerAlertRadiusMeters: number;
  seniorCheckInHour: number;
  missedCheckInEscalationMinutes: number;
};
