import type { EmergencyIncident, EmergencyTimelineEvent, EmergencyStatus, EmergencyType, EmergencySeverity, EmergencyTimelineEventType } from '../../../../shared/types/emergency.types';
import type { EmergencyContact } from '../../../../shared/types/emergency.types';
import type { EmergencyVolunteer, VolunteerAlert } from '../../../../shared/types/volunteer.types';
import type { EmergencyBroadcast, SafetyInstruction, SafetyDrillRecord, PostIncidentReview } from '../../../../shared/types/safety.types';
import type { SeniorCareProfile, SeniorDailyCheckIn, SeniorInactivityAlert } from '../../../../shared/types/seniorCare.types';
import type { ClientOperationId, ClientIncidentRequestId, ClientAcknowledgementId, ClientCheckInId } from './emergencySafety.types';

export type AffectedZone = {
  id: string;
  incidentId: string;
  zoneId: string;
  zoneName: string;
  zoneType: 'TOWER' | 'FLOOR' | 'UNIT' | 'FACILITY' | 'PARKING_AREA' | 'COMMON_AREA' | 'GATE' | 'BASEMENT';
  status: 'UNKNOWN' | 'AFFECTED' | 'EVACUATING' | 'EVACUATED' | 'CONTROLLED' | 'SAFE';
  affectedAt: string;
  controlledAt?: string;
  notes?: string;
};

export type EmergencyTask = {
  id: string;
  incidentId: string;
  taskType: 'CLOSE_GATE' | 'ISOLATE_AREA' | 'CALL_AMBULANCE' | 'INSPECT_ELECTRICAL' | 'SHUT_WATER_VALVE' | 'INSPECT_LIFT' | 'DEPLOY_PUMP' | 'CHECK_RESIDENT' | 'CONTACT_VENDOR' | 'EVACUATE_ZONE' | 'OTHER';
  title: string;
  description?: string;
  assigneeRole?: 'GUARD' | 'FACILITY_MANAGER' | 'VOLUNTEER' | 'COMMITTEE' | 'VENDOR';
  assigneeId?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';
  dueAt?: string;
  startedAt?: string;
  completedAt?: string;
  evidence?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type EmergencyInstruction = {
  id: string;
  incidentId: string;
  version: number;
  content: string;
  audience: string;
  affectedAreas?: string[];
  priority: 'INFO' | 'WARNING' | 'CRITICAL';
  supersededAt?: string;
  publishedAt: string;
  publishedBy: string;
};

export type EvacuationSession = {
  id: string;
  incidentId: string;
  name: string;
  affectedZones: string[];
  audience: 'ALL_RESIDENTS' | 'SPECIFIC_ZONES' | 'SPECIFIC_UNITS';
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  instructions: EmergencyInstruction[];
  checkInStatus: Record<string, 'UNKNOWN' | 'CHECK_IN_REQUESTED' | 'SELF_REPORTED_SAFE' | 'ASSISTANCE_REQUESTED' | 'UNREACHABLE' | 'VERIFIED_SAFE'>;
  startedAt: string;
  completedAt?: string;
  initiatedBy: string;
};

export type SafetyCheckIn = {
  id: string;
  evacuationSessionId: string;
  incidentId: string;
  unitId: string;
  flatNumber: string;
  tower: string;
  status: 'UNKNOWN' | 'CHECK_IN_REQUESTED' | 'SELF_REPORTED_SAFE' | 'ASSISTANCE_REQUESTED' | 'UNREACHABLE' | 'VERIFIED_SAFE';
  checkedAt?: string;
  checkedBy?: string;
  notes?: string;
  householdMembers?: string[];
};

export type ResponderAssignment = {
  id: string;
  incidentId: string;
  responderId: string;
  responderName: string;
  responderRole: 'GUARD' | 'FACILITY_MANAGER' | 'VOLUNTEER' | 'COMMITTEE' | 'ADMIN' | 'FAMILY_CONTACT' | 'EXTERNAL_EMERGENCY_SERVICE';
  assignedBy: string;
  assignedAt: string;
  status: 'NOTIFIED' | 'ACKNOWLEDGED' | 'ON_THE_WAY' | 'REACHED' | 'UNAVAILABLE' | 'COMPLETED';
  priority: number;
  scope?: string;
  acknowledgedAt?: string;
  reachedAt?: string;
};

export type ResponsePlan = {
  id: string;
  societyId: string;
  emergencyType: EmergencyType;
  severity: EmergencySeverity;
  version: number;
  initialRecipients: string[];
  escalationTiers: EscalationTier[];
  acknowledgementTimeoutMinutes: number;
  fallbackChannels: string[];
  familyNotificationRule: 'IMMEDIATE' | 'AFTER_ACKNOWLEDGEMENT' | 'AFTER_REACHED' | 'NEVER';
  volunteerUse: boolean;
  facilityTasks: string[];
  securityTasks: string[];
  criticalOverrideBehavior: 'ALWAYS' | 'SEVERITY_BASED' | 'ROLE_BASED';
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
  updatedAt: string;
};

export type EscalationTier = {
  tier: number;
  recipients: string[];
  delayMinutes: number;
  channels: string[];
};

export type EmergencyAuditEvent = 
  | 'SOS_CREATED'
  | 'INCIDENT_DECLARED'
  | 'INCIDENT_CLASSIFIED'
  | 'SEVERITY_CHANGED'
  | 'RESPONDER_ASSIGNED'
  | 'RESPONDER_ACKNOWLEDGED'
  | 'RESPONDER_REACHED'
  | 'INCIDENT_ESCALATED'
  | 'CRITICAL_BROADCAST_PUBLISHED'
  | 'CRITICAL_OVERRIDE_USED'
  | 'EVACUATION_STARTED'
  | 'SAFETY_STATUS_UPDATED'
  | 'EMERGENCY_BYPASS_USED'
  | 'INCIDENT_MARKED_UNDER_CONTROL'
  | 'INCIDENT_RESOLVED'
  | 'INCIDENT_CLOSED'
  | 'FALSE_ALARM_RECORDED'
  | 'POST_INCIDENT_REVIEW_CREATED'
  | 'CORRECTIVE_ACTION_CREATED'
  | 'SENIOR_SUPPORT_ENABLED'
  | 'SENIOR_SUPPORT_DISABLED'
  | 'SENIOR_ALERT_ESCALATED'
  | 'VOLUNTEER_VERIFIED'
  | 'VOLUNTEER_DISPATCHED';

export type EmergencyErrorCode =
  | 'EMERGENCY_CONTEXT_UNAVAILABLE'
  | 'EMERGENCY_FEATURE_DISABLED'
  | 'SOS_ALREADY_ACCEPTED'
  | 'INCIDENT_NOT_FOUND'
  | 'INCIDENT_ALREADY_CLOSED'
  | 'INCIDENT_NOT_ACTIONABLE'
  | 'INVALID_INCIDENT_TRANSITION'
  | 'RESPONDER_NOT_ASSIGNED'
  | 'RESPONDER_ALREADY_ACKNOWLEDGED'
  | 'RESPONDER_UNAVAILABLE'
  | 'ESCALATION_NOT_ALLOWED'
  | 'RESPONSE_PLAN_NOT_CONFIGURED'
  | 'CRITICAL_BROADCAST_NOT_ALLOWED'
  | 'EVACUATION_NOT_ALLOWED'
  | 'INVALID_AFFECTED_AREA'
  | 'SENIOR_SUPPORT_NOT_ENABLED'
  | 'SENIOR_CONSENT_REQUIRED'
  | 'CHECKIN_NOT_DUE'
  | 'CHECKIN_ALREADY_COMPLETED'
  | 'CHECKIN_OCCURRENCE_EXPIRED'
  | 'INACTIVITY_ALERT_NOT_FOUND'
  | 'VOLUNTEER_NOT_ELIGIBLE'
  | 'VOLUNTEER_NOT_AVAILABLE'
  | 'EMERGENCY_CONTACT_NOT_FOUND'
  | 'STALE_INCIDENT_VERSION'
  | 'DUPLICATE_OPERATION'
  | 'ACCESS_DENIED'
  | 'INTEGRATION_UNAVAILABLE';

export type IncidentTransition = 
  | { from: 'CREATED'; to: 'NOTIFIED' | 'ACKNOWLEDGED' | 'CANCELLED' | 'FALSE_ALARM' }
  | { from: 'NOTIFIED'; to: 'ACKNOWLEDGED' | 'ESCALATED' | 'CANCELLED' | 'FALSE_ALARM' }
  | { from: 'ACKNOWLEDGED'; to: 'RESPONDER_ASSIGNED' | 'RESPONDER_ON_THE_WAY' | 'ESCALATED' | 'UNDER_CONTROL' }
  | { from: 'RESPONDER_ASSIGNED'; to: 'RESPONDER_ON_THE_WAY' | 'ESCALATED' }
  | { from: 'RESPONDER_ON_THE_WAY'; to: 'RESPONDER_REACHED' | 'ESCALATED' }
  | { from: 'RESPONDER_REACHED'; to: 'UNDER_CONTROL' | 'ESCALATED' }
  | { from: 'ESCALATED'; to: 'ACKNOWLEDGED' | 'RESPONDER_ON_THE_WAY' | 'UNDER_CONTROL' }
  | { from: 'UNDER_CONTROL'; to: 'RESOLVED' | 'CLOSED' | 'ESCALATED' }
  | { from: 'RESOLVED'; to: 'CLOSED' }
  | { from: 'CANCELLED'; to: 'FALSE_ALARM' }
  | { from: 'FALSE_ALARM'; to: 'CLOSED' }
  | { from: 'CLOSED'; to: never };

export function isValidIncidentTransition(from: EmergencyStatus, to: EmergencyStatus): boolean {
  const validTransitions: Record<EmergencyStatus, EmergencyStatus[]> = {
    CREATED: ['NOTIFIED', 'ACKNOWLEDGED', 'CANCELLED', 'FALSE_ALARM'],
    NOTIFIED: ['ACKNOWLEDGED', 'ESCALATED', 'CANCELLED', 'FALSE_ALARM'],
    ACKNOWLEDGED: ['RESPONDER_ASSIGNED', 'RESPONDER_ON_THE_WAY', 'ESCALATED', 'UNDER_CONTROL'],
    RESPONDER_ASSIGNED: ['RESPONDER_ON_THE_WAY', 'ESCALATED'],
    RESPONDER_ON_THE_WAY: ['RESPONDER_REACHED', 'ESCALATED'],
    RESPONDER_REACHED: ['UNDER_CONTROL', 'ESCALATED'],
    ESCALATED: ['ACKNOWLEDGED', 'RESPONDER_ON_THE_WAY', 'UNDER_CONTROL'],
    UNDER_CONTROL: ['RESOLVED', 'CLOSED', 'ESCALATED'],
    RESOLVED: ['CLOSED'],
    CANCELLED: ['FALSE_ALARM'],
    FALSE_ALARM: ['CLOSED'],
    CLOSED: [],
  };
  return validTransitions[from]?.includes(to) ?? false;
}

export function getAllowedTransitions(from: EmergencyStatus): EmergencyStatus[] {
  const validTransitions: Record<EmergencyStatus, EmergencyStatus[]> = {
    CREATED: ['NOTIFIED', 'ACKNOWLEDGED', 'CANCELLED', 'FALSE_ALARM'],
    NOTIFIED: ['ACKNOWLEDGED', 'ESCALATED', 'CANCELLED', 'FALSE_ALARM'],
    ACKNOWLEDGED: ['RESPONDER_ASSIGNED', 'RESPONDER_ON_THE_WAY', 'ESCALATED', 'UNDER_CONTROL'],
    RESPONDER_ASSIGNED: ['RESPONDER_ON_THE_WAY', 'ESCALATED'],
    RESPONDER_ON_THE_WAY: ['RESPONDER_REACHED', 'ESCALATED'],
    RESPONDER_REACHED: ['UNDER_CONTROL', 'ESCALATED'],
    ESCALATED: ['ACKNOWLEDGED', 'RESPONDER_ON_THE_WAY', 'UNDER_CONTROL'],
    UNDER_CONTROL: ['RESOLVED', 'CLOSED', 'ESCALATED'],
    RESOLVED: ['CLOSED'],
    CANCELLED: ['FALSE_ALARM'],
    FALSE_ALARM: ['CLOSED'],
    CLOSED: [],
  };
  return validTransitions[from] ?? [];
}