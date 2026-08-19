import type { EmergencyType } from '../../../../shared/types/emergency.types';
import type { Absent } from "../../../../shared/types/absence.types";
export type SosType = 'medical' | 'fire' | 'liftStuck' | 'securityThreat' | 'seniorHelp' | 'generalEmergency';
export const SOS_TYPE_TO_EMERGENCY_TYPE: Record<SosType, EmergencyType> = {
    medical: 'MEDICAL',
    fire: 'FIRE',
    liftStuck: 'LIFT_STUCK',
    securityThreat: 'SECURITY_THREAT',
    seniorHelp: 'SENIOR_HELP',
    generalEmergency: 'SOS',
};
export const EMERGENCY_TYPE_TO_SOS_TYPE: Partial<Record<EmergencyType, SosType>> = {
    MEDICAL: 'medical',
    FIRE: 'fire',
    LIFT_STUCK: 'liftStuck',
    SECURITY_THREAT: 'securityThreat',
    SENIOR_HELP: 'seniorHelp',
    SOS: 'generalEmergency',
};
export type SosSeverity = 'critical' | 'high' | 'medium' | 'low';
export interface SosTypeDefinition {
    readonly sosType: SosType;
    readonly titleKey: string;
    readonly descriptionKey: string;
    readonly icon: string;
    readonly color: string;
    readonly severity: SosSeverity;
    readonly requiresHoldConfirm: boolean;
    readonly defaultEscalationDelaySec: number;
}
export type SosRecipientType = 'residentOwner' | 'familyMember' | 'externalEmergencyContact' | 'trustedResident' | 'societyRole' | 'societyChannel' | 'emergencyVolunteerGroup' | 'serviceProvider';
export type SosRecipientSource = 'societyDefault' | 'ownerConfigured' | 'autoDetected';
export interface SosRecipientRule {
    readonly recipientId: string;
    readonly recipientType: SosRecipientType;
    readonly recipientDisplayName: string;
    readonly source: SosRecipientSource;
    readonly mandatory: boolean;
    readonly enabled: boolean;
    readonly escalationOrder: number;
    readonly notifyImmediately: boolean;
    readonly escalationDelaySeconds: number;
    readonly notificationChannels: EmergencyNotificationChannel[];
}
export type EmergencyNotificationChannel = 'push' | 'sms' | 'call' | 'whatsapp' | 'inAppAlert';
export interface SosFallbackPolicy {
    readonly notifySecurityGate: boolean;
    readonly notifySocietyAdmin: boolean;
    readonly notifyResidentOwner: boolean;
    readonly continueWhenPersonalRecipientsUnavailable: boolean;
}
export const DEFAULT_FALLBACK_POLICY: SosFallbackPolicy = {
    notifySecurityGate: true,
    notifySocietyAdmin: true,
    notifyResidentOwner: true,
    continueWhenPersonalRecipientsUnavailable: true,
};
export type SosPlanMode = 'recommended' | 'custom';
export interface SosResponsePlan {
    readonly id: string;
    readonly societyId: string;
    readonly residenceId: string;
    readonly unitId: string;
    readonly sosType: SosType;
    readonly mode: SosPlanMode;
    readonly recipientRules: SosRecipientRule[];
    readonly fallbackPolicy: SosFallbackPolicy;
    readonly version: number;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly lastTestedAt?: string;
}
export type SosResolutionWarningCode = 'noPersonalContacts' | 'someContactsInactive' | 'pendingInvitationsExcluded' | 'fallbackActivated' | 'planUnconfigured' | 'duplicatesRemoved';
export interface SosResolutionWarning {
    readonly code: SosResolutionWarningCode;
    readonly messageKey: string;
    readonly affectedRecipientIds?: string[];
}
export interface SosRecipientResolutionResult {
    readonly sosType: SosType;
    readonly residenceId: string;
    readonly planId: string | Absent;
    readonly planMode: SosPlanMode | 'default';
    readonly resolvedRecipients: SosResolvedRecipient[];
    readonly warnings: SosResolutionWarning[];
    readonly isComplete: boolean;
    readonly fallbackActivated: boolean;
    readonly resolvedAt: string;
}
export interface SosResolvedRecipient {
    readonly recipientId: string;
    readonly recipientType: SosRecipientType;
    readonly displayName: string;
    readonly source: SosRecipientSource;
    readonly mandatory: boolean;
    readonly escalationOrder: number;
    readonly notifyImmediately: boolean;
    readonly escalationDelaySeconds: number;
    readonly channels: EmergencyNotificationChannel[];
}
export type SosEventStatus = 'initiated' | 'recipientsNotified' | 'acknowledged' | 'responderDispatched' | 'responderReached' | 'escalated' | 'underControl' | 'resolved' | 'cancelled' | 'testCompleted';
export type SosRecipientDeliveryStatus = 'pending' | 'delivered' | 'acknowledged' | 'failed' | 'unavailable';
export interface SosRecipientDelivery {
    readonly recipientId: string;
    readonly displayName: string;
    readonly recipientType: SosRecipientType;
    readonly deliveryStatus: SosRecipientDeliveryStatus;
    readonly deliveredAt?: string;
    readonly acknowledgedAt?: string;
    readonly failureReason?: string;
    readonly channel: EmergencyNotificationChannel;
}
export interface SosEvent {
    readonly id: string;
    readonly sosType: SosType;
    readonly residenceId: string;
    readonly societyId: string;
    readonly unitId: string;
    readonly flatNumber: string;
    readonly tower: string;
    readonly triggeredByUserId: string;
    readonly triggeredByUserName: string;
    readonly status: SosEventStatus;
    readonly isTestMode: boolean;
    readonly recipientDeliveries: SosRecipientDelivery[];
    readonly planId: string | Absent;
    readonly planMode: SosPlanMode | 'default';
    readonly note?: string;
    readonly triggeredAt: string;
    readonly acknowledgedAt?: string;
    readonly resolvedAt?: string;
    readonly cancelledAt?: string;
    readonly linkedIncidentId?: string;
}
export interface SosResidenceContext {
    readonly societyId: string;
    readonly residenceId: string;
    readonly unitId: string;
    readonly flatNumber: string;
    readonly tower: string;
    readonly residentRole: 'owner' | 'coOwner' | 'tenant' | 'familyMember' | 'authorizedOccupant';
}
export type SosPermission = 'viewResponsePlans' | 'editResponsePlans' | 'manageEmergencyContacts' | 'manageTrustedResidents' | 'editEmergencyProfile' | 'triggerSos' | 'triggerTestSos' | 'viewSosHistory';
export const SOS_PERMISSIONS_BY_ROLE: Record<SosResidenceContext['residentRole'], SosPermission[]> = {
    owner: [
        'viewResponsePlans',
        'editResponsePlans',
        'manageEmergencyContacts',
        'manageTrustedResidents',
        'editEmergencyProfile',
        'triggerSos',
        'triggerTestSos',
        'viewSosHistory',
    ],
    coOwner: [
        'viewResponsePlans',
        'editResponsePlans',
        'manageEmergencyContacts',
        'manageTrustedResidents',
        'editEmergencyProfile',
        'triggerSos',
        'triggerTestSos',
        'viewSosHistory',
    ],
    tenant: [
        'viewResponsePlans',
        'manageEmergencyContacts',
        'editEmergencyProfile',
        'triggerSos',
        'triggerTestSos',
        'viewSosHistory',
    ],
    familyMember: [
        'viewResponsePlans',
        'triggerSos',
        'viewSosHistory',
    ],
    authorizedOccupant: [
        'viewResponsePlans',
        'triggerSos',
        'viewSosHistory',
    ],
};

