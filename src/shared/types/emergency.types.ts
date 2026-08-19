export type EmergencyType =
  | 'SOS'
  | 'MEDICAL'
  | 'FIRE'
  | 'LIFT_STUCK'
  | 'SECURITY_THREAT'
  | 'ACCIDENT'
  | 'SENIOR_HELP'
  | 'CHILD_SAFETY'
  | 'PET_EMERGENCY'
  | 'OTHER';

export type EmergencySeverity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export type EmergencyStatus =
  | 'CREATED'
  | 'NOTIFIED'
  | 'ACKNOWLEDGED'
  | 'RESPONDER_ASSIGNED'
  | 'RESPONDER_ON_THE_WAY'
  | 'RESPONDER_REACHED'
  | 'ESCALATED'
  | 'UNDER_CONTROL'
  | 'CLOSED'
  | 'CANCELLED'
  | 'FALSE_ALARM';

export type EmergencyResponderRole =
  | 'GUARD'
  | 'FACILITY_MANAGER'
  | 'VOLUNTEER'
  | 'COMMITTEE'
  | 'ADMIN'
  | 'FAMILY_CONTACT';

export type ResponderStatus =
  | 'NOTIFIED'
  | 'ACKNOWLEDGED'
  | 'ON_THE_WAY'
  | 'REACHED'
  | 'UNAVAILABLE'
  | 'COMPLETED';

export type FireAlertType =
  | 'SMOKE_SEEN'
  | 'FIRE_SEEN'
  | 'BURNING_SMELL'
  | 'ELECTRICAL_SPARK'
  | 'GAS_LEAK_SUSPECTED'
  | 'OTHER';

export type SecurityThreatType =
  | 'SUSPICIOUS_PERSON'
  | 'UNAUTHORIZED_ENTRY'
  | 'FIGHT_OR_VIOLENCE'
  | 'THEFT_SUSPECTED'
  | 'HARASSMENT'
  | 'UNKNOWN_VEHICLE'
  | 'OTHER';

export type EmergencyContactRelationship =
  | 'FAMILY'
  | 'FRIEND'
  | 'NEIGHBOUR'
  | 'DOCTOR'
  | 'CARETAKER'
  | 'SECURITY'
  | 'FIRE_STATION'
  | 'HOSPITAL'
  | 'POLICE'
  | 'OTHER';

export interface EmergencyContact {
  id: string;
  name: string;
  relationship?: EmergencyContactRelationship;
  mobileNumber?: string;
  mobileMasked?: string;
  priority?: number; 
  notifyForAll?: boolean;
  notifyForSeniorOnly?: boolean;
  consentConfirmed?: boolean;
  createdAt?: string;
  
  phone?: string;
  role?: string;
  iconName?: string;
  available24x7?: boolean;
}

export interface EmergencyResponder {
  id: string;
  name: string;
  role: EmergencyResponderRole;
  mobileMasked?: string;
  status: ResponderStatus;
  etaMinutes?: number;
  assignedAt: string;
  acknowledgedAt?: string;
  reachedAt?: string;
}

export interface EmergencyIncident {
  id: string;
  incidentNumber: string;
  emergencyType: EmergencyType;
  severity: EmergencySeverity;
  status: EmergencyStatus;
  reportedByUserId: string;
  reportedByUserName: string;
  reportedByUserMobileMasked: string;
  unitId: string;
  flatNumber: string;
  tower: string;
  location: string; 
  description?: string;
  isSeniorCitizen: boolean;
  needAmbulance: boolean;
  needVolunteer: boolean;
  notifyFamily: boolean;
  isPrivate: boolean; 
  fireType?: FireAlertType;
  isPeopleTrapped?: boolean;
  liftNumber?: string;
  numberOfPeopleStuck?: number;
  threatType?: SecurityThreatType;
  responders: EmergencyResponder[];
  createdAt: string;
  resolvedAt?: string;
  closedAt?: string;
  closureSummary?: string;
}

export interface EmergencyTimelineEvent {
  id: string;
  incidentId: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  eventType: string; 
  note?: string;
  source: 'SYSTEM' | 'GUARD_CONSOLE' | 'VOLUNTEER_APP' | 'RESIDENT_APP' | 'FACILITY_CONSOLE';
}

export interface EmergencyDashboardSummary {
  societyName: string;
  activeCount: number;
  medicalCount: number;
  fireCount: number;
  liftCount: number;
  securityCount: number;
  recentIncidents: EmergencyIncident[];
}

export interface CreateSosInput {
  unitId: string;
  flatNumber: string;
  tower: string;
  note?: string;
}

export interface CreateEmergencyIncidentInput {
  emergencyType: EmergencyType;
  severity: EmergencySeverity;
  location: string;
  description?: string;
  isSeniorCitizen?: boolean;
  needAmbulance?: boolean;
  needVolunteer?: boolean;
  notifyFamily?: boolean;
  isPrivate?: boolean;
  fireType?: FireAlertType;
  isPeopleTrapped?: boolean;
  liftNumber?: string;
  numberOfPeopleStuck?: number;
  threatType?: SecurityThreatType;
  personNeedingHelp?: string;
}

export interface UpdateIncidentInput {
  status?: EmergencyStatus;
  closureSummary?: string;
}
