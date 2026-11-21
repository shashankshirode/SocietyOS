import type { ResidentHomeRole } from '../../homeContext/data/residentHomeContext.types';
import type { Absent } from '../../../../shared/types/absence.types';

export type EmergencyActorRole = 
  | 'RESIDENT_OWNER'
  | 'RESIDENT_CO_OWNER'
  | 'RESIDENT_TENANT'
  | 'RESIDENT_FAMILY_MEMBER'
  | 'RESIDENT_AUTHORIZED_OCCUPANT'
  | 'GUARD'
  | 'FACILITY_MANAGER'
  | 'COMMITTEE_MEMBER'
  | 'SOCIETY_ADMIN'
  | 'PLATFORM_ADMIN'
  | 'EMERGENCY_VOLUNTEER'
  | 'EXTERNAL_EMERGENCY_SERVICE';

export interface EmergencyActorContext {
  actorId: string;
  actorName: string;
  actorRole: EmergencyActorRole;
  sessionId: string;
  societyId: string;
  societyName: string;
  residenceId: string;
  unitId: string;
  flatNumber: string;
  tower: string;
  residentRole: ResidentHomeRole;
  emergencyPermissions: EmergencyPermission[];
  deviceContext: DeviceContext;
  isTestMode: boolean;
}

export type EmergencyPermission = 
  | 'TRIGGER_SOS'
  | 'TRIGGER_TEST_SOS'
  | 'DECLARE_INCIDENT'
  | 'ACKNOWLEDGE_INCIDENT'
  | 'ASSIGN_RESPONDER'
  | 'MARK_RESPONDER_ON_THE_WAY'
  | 'MARK_RESPONDER_REACHED'
  | 'ESCALATE_INCIDENT'
  | 'PUBLISH_EMERGENCY_INSTRUCTION'
  | 'PUBLISH_CRITICAL_BROADCAST'
  | 'START_EVACUATION'
  | 'MARK_RESIDENT_SAFE'
  | 'CLOSE_INCIDENT'
  | 'MANAGE_EMERGENCY_CONTACTS'
  | 'MANAGE_SENIOR_PROFILE'
  | 'VIEW_EMERGENCY_CONSOLE'
  | 'MANAGE_VOLUNTEERS'
  | 'MANAGE_RESPONSE_PLANS';

export interface DeviceContext {
  deviceId: string;
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
  hasLocationPermission: boolean;
  isOnline: boolean;
  lastSyncAt?: string;
}

export interface SosRequestContext {
  clientOperationId: string;
  emergencyType: 'SOS' | 'MEDICAL' | 'FIRE' | 'LIFT_STUCK' | 'SECURITY_THREAT' | 'WATER' | 'ELECTRICAL' | 'SENIOR_HELP' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  description?: string;
  isSeniorCitizen: boolean;
  needAmbulance: boolean;
  needVolunteer: boolean;
  notifyFamily: boolean;
  isPrivate: boolean;
  fireType?: 'SMOKE_SEEN' | 'FIRE_SEEN' | 'BURNING_SMELL' | 'ELECTRICAL_SPARK' | 'GAS_LEAK_SUSPECTED' | 'OTHER';
  isPeopleTrapped?: boolean;
  liftNumber?: string;
  numberOfPeopleStuck?: number;
  threatType?: 'SUSPICIOUS_PERSON' | 'UNAUTHORIZED_ENTRY' | 'FIGHT_OR_VIOLENCE' | 'THEFT_SUSPECTED' | 'HARASSMENT' | 'UNKNOWN_VEHICLE' | 'OTHER';
  personNeedingHelp?: string;
  actorContext: EmergencyActorContext;
}

export function mapResidentRoleToEmergencyRole(role: ResidentHomeRole): EmergencyActorRole {
  switch (role) {
    case 'owner': return 'RESIDENT_OWNER';
    case 'coOwner': return 'RESIDENT_CO_OWNER';
    case 'tenant': return 'RESIDENT_TENANT';
    case 'familyMember': return 'RESIDENT_FAMILY_MEMBER';
    case 'authorizedOccupant': return 'RESIDENT_AUTHORIZED_OCCUPANT';
    default: return 'RESIDENT_OWNER';
  }
}

export function getEmergencyPermissionsForRole(role: EmergencyActorRole): EmergencyPermission[] {
  const basePermissions: EmergencyPermission[] = ['TRIGGER_SOS', 'TRIGGER_TEST_SOS'];
  
  switch (role) {
    case 'RESIDENT_OWNER':
    case 'RESIDENT_CO_OWNER':
      return [
        ...basePermissions,
        'DECLARE_INCIDENT',
        'MANAGE_EMERGENCY_CONTACTS',
        'MANAGE_SENIOR_PROFILE',
        'VIEW_EMERGENCY_CONSOLE',
      ];
    case 'RESIDENT_TENANT':
    case 'RESIDENT_FAMILY_MEMBER':
    case 'RESIDENT_AUTHORIZED_OCCUPANT':
      return [
        ...basePermissions,
        'DECLARE_INCIDENT',
        'MANAGE_EMERGENCY_CONTACTS',
      ];
    case 'GUARD':
      return [
        'DECLARE_INCIDENT',
        'ACKNOWLEDGE_INCIDENT',
        'MARK_RESPONDER_ON_THE_WAY',
        'MARK_RESPONDER_REACHED',
        'ESCALATE_INCIDENT',
        'PUBLISH_EMERGENCY_INSTRUCTION',
        'START_EVACUATION',
        'MARK_RESIDENT_SAFE',
        'VIEW_EMERGENCY_CONSOLE',
      ];
    case 'FACILITY_MANAGER':
      return [
        'DECLARE_INCIDENT',
        'ACKNOWLEDGE_INCIDENT',
        'ASSIGN_RESPONDER',
        'MARK_RESPONDER_ON_THE_WAY',
        'MARK_RESPONDER_REACHED',
        'ESCALATE_INCIDENT',
        'PUBLISH_EMERGENCY_INSTRUCTION',
        'PUBLISH_CRITICAL_BROADCAST',
        'START_EVACUATION',
        'MARK_RESIDENT_SAFE',
        'CLOSE_INCIDENT',
        'VIEW_EMERGENCY_CONSOLE',
      ];
    case 'COMMITTEE_MEMBER':
    case 'SOCIETY_ADMIN':
      return [
        'DECLARE_INCIDENT',
        'ACKNOWLEDGE_INCIDENT',
        'ASSIGN_RESPONDER',
        'ESCALATE_INCIDENT',
        'PUBLISH_EMERGENCY_INSTRUCTION',
        'PUBLISH_CRITICAL_BROADCAST',
        'START_EVACUATION',
        'CLOSE_INCIDENT',
        'VIEW_EMERGENCY_CONSOLE',
        'MANAGE_RESPONSE_PLANS',
        'MANAGE_VOLUNTEERS',
      ];
    case 'PLATFORM_ADMIN':
      return [
        'DECLARE_INCIDENT',
        'ACKNOWLEDGE_INCIDENT',
        'ASSIGN_RESPONDER',
        'ESCALATE_INCIDENT',
        'PUBLISH_EMERGENCY_INSTRUCTION',
        'PUBLISH_CRITICAL_BROADCAST',
        'START_EVACUATION',
        'CLOSE_INCIDENT',
        'VIEW_EMERGENCY_CONSOLE',
        'MANAGE_RESPONSE_PLANS',
        'MANAGE_VOLUNTEERS',
      ];
    case 'EMERGENCY_VOLUNTEER':
      return [
        'TRIGGER_SOS',
        'TRIGGER_TEST_SOS',
        'DECLARE_INCIDENT',
        'ACKNOWLEDGE_INCIDENT',
        'MARK_RESPONDER_ON_THE_WAY',
        'MARK_RESPONDER_REACHED',
      ];
    case 'EXTERNAL_EMERGENCY_SERVICE':
      return [
        'DECLARE_INCIDENT',
        'ACKNOWLEDGE_INCIDENT',
        'MARK_RESPONDER_ON_THE_WAY',
        'MARK_RESPONDER_REACHED',
      ];
    default:
      return basePermissions;
  }
}

export function hasEmergencyPermission(actorContext: EmergencyActorContext, permission: EmergencyPermission): boolean {
  return actorContext.emergencyPermissions.includes(permission);
}