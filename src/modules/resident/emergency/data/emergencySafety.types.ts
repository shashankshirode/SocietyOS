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

export type ClientOperationId = string;
export type ClientIncidentRequestId = string;
export type ClientAcknowledgementId = string;
export type ClientCheckInId = string;

export function generateClientOperationId(prefix = 'op'): ClientOperationId {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generateClientIncidentRequestId(): ClientIncidentRequestId {
  return generateClientOperationId('inc-req');
}

export function generateClientAcknowledgementId(): ClientAcknowledgementId {
  return generateClientOperationId('ack');
}

export function generateClientCheckInId(): ClientCheckInId {
  return generateClientOperationId('chk');
}
