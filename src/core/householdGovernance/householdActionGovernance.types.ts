export type HouseholdActorRelationship =
  | 'OWNER'
  | 'CO_OWNER'
  | 'TENANT'
  | 'FAMILY_MEMBER'
  | 'AUTHORIZED_OCCUPANT'
  | 'SOCIETY_STAFF';

export type HouseholdActionClass =
  | 'CRITICAL_SAFETY'
  | 'SECURITY_ACCESS'
  | 'FINANCIAL'
  | 'RESERVATION'
  | 'PROPERTY_OPERATION'
  | 'HOUSEHOLD_ADMINISTRATION'
  | 'INFORMATIONAL'
  | 'COMMUNITY'
  | 'PRIVATE'
  | 'GOVERNANCE_PRIVATE';

export type HouseholdPrivacyClass = 'STANDARD' | 'PRIVATE' | 'SENSITIVE' | 'GOVERNANCE_PRIVATE';

export type HouseholdActionDecision =
  | 'ALLOW_SILENTLY'
  | 'ALLOW_AND_NOTIFY'
  | 'ALLOW_AND_AUDIT'
  | 'ALLOW_NOTIFY_AND_AUDIT'
  | 'REQUIRE_OWNER_APPROVAL'
  | 'REQUIRE_ADMIN_APPROVAL'
  | 'DENY'
  | 'CRITICAL_OVERRIDE';

export type HouseholdNotificationMode = 'INSTANT' | 'DIGEST' | 'OFF';

export type HouseholdActionEvent = {
  eventId: string;
  correlationId: string;
  societyId: string;
  unitId: string;
  actorUserId: string;
  actorMembershipId: string;
  actorPersonId: string;
  actorDisplayName: string;
  actorRelationship: HouseholdActorRelationship;
  actorRole: string;
  actionType: string;
  domain: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  actionClass: HouseholdActionClass;
  privacyClass: HouseholdPrivacyClass;
  financialImpact: number;
  securityImpact: boolean;
  metadata: Record<string, string | number | boolean>;
  deepLink?: string;
  result: 'SUCCEEDED' | 'PENDING_APPROVAL' | 'DENIED' | 'FAILED';
};

export type HouseholdActionPolicyInput = {
  actorRelationship: HouseholdActorRelationship;
  actionClass: HouseholdActionClass;
  privacyClass: HouseholdPrivacyClass;
  financialImpact?: number;
  securityImpact?: boolean;
  permissionGranted: boolean;
  societyAllowsAction: boolean;
  requiresApproval?: boolean;
  approvalThreshold?: number;
  notificationMode?: HouseholdNotificationMode;
  auditRequired?: boolean;
};

export type HouseholdActionPolicyDecision = {
  decision: HouseholdActionDecision;
  notificationMode: HouseholdNotificationMode;
  audit: boolean;
  reason: string;
};

export type HouseholdSponsor = {
  userId: string;
  displayName: string;
  relationship: 'OWNER' | 'CO_OWNER' | 'TENANT';
  eligibleForApproval: boolean;
};

export type HouseholdNotificationRecipient = {
  userId: string;
  displayName: string;
  reason: 'HOUSEHOLD_SPONSOR' | 'CO_OWNER' | 'SOCIETY_RESPONDER' | 'CONFIGURED_CONTACT';
  mode: HouseholdNotificationMode;
};

export type NotificationRecipientResolverInput = {
  event: HouseholdActionEvent;
  householdSponsor?: HouseholdSponsor;
  coOwners?: HouseholdSponsor[];
  configuredRecipients?: HouseholdNotificationRecipient[];
  societyResponders?: HouseholdNotificationRecipient[];
  sponsorMode?: HouseholdNotificationMode;
  notifyCoOwners?: boolean;
};