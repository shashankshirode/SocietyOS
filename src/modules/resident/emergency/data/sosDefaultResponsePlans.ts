






import type {
  SosType,
  SosResponsePlan,
  SosRecipientRule,
  SosFallbackPolicy,
  SosResidenceContext,
} from './sosResponsePlan.types';
import { DEFAULT_FALLBACK_POLICY } from './sosResponsePlan.types';
import { ALL_SOS_TYPES } from './sosTypeDefinitions';




function createSecurityGateRule(escalationOrder: number): SosRecipientRule {
  return {
    recipientId: 'society-security-gate',
    recipientType: 'societyRole',
    recipientDisplayName: 'Security Gate',
    source: 'societyDefault',
    mandatory: true,
    enabled: true,
    escalationOrder,
    notifyImmediately: true,
    escalationDelaySeconds: 0,
    notificationChannels: ['push', 'inAppAlert'],
  };
}


function createSocietyAdminRule(escalationOrder: number): SosRecipientRule {
  return {
    recipientId: 'society-admin',
    recipientType: 'societyRole',
    recipientDisplayName: 'Society Admin',
    source: 'societyDefault',
    mandatory: true,
    enabled: true,
    escalationOrder,
    notifyImmediately: false,
    escalationDelaySeconds: 30,
    notificationChannels: ['push', 'sms'],
  };
}


function createFacilityManagerRule(escalationOrder: number): SosRecipientRule {
  return {
    recipientId: 'society-facility-manager',
    recipientType: 'societyRole',
    recipientDisplayName: 'Facility Manager',
    source: 'societyDefault',
    mandatory: true,
    enabled: true,
    escalationOrder,
    notifyImmediately: false,
    escalationDelaySeconds: 15,
    notificationChannels: ['push', 'sms'],
  };
}


function createVolunteerGroupRule(escalationOrder: number): SosRecipientRule {
  return {
    recipientId: 'society-emergency-volunteers',
    recipientType: 'emergencyVolunteerGroup',
    recipientDisplayName: 'Emergency Volunteers',
    source: 'societyDefault',
    mandatory: false,
    enabled: true,
    escalationOrder,
    notifyImmediately: false,
    escalationDelaySeconds: 60,
    notificationChannels: ['push'],
  };
}




function getDefaultRecipientRules(sosType: SosType): SosRecipientRule[] {
  switch (sosType) {
    case 'medical':
      return [
        createSecurityGateRule(1),
        createSocietyAdminRule(2),
        createVolunteerGroupRule(3),
      ];

    case 'fire':
      return [
        createSecurityGateRule(1),
        createFacilityManagerRule(2),
        createSocietyAdminRule(3),
        createVolunteerGroupRule(4),
      ];

    case 'liftStuck':
      return [
        createSecurityGateRule(1),
        createFacilityManagerRule(2),
        createSocietyAdminRule(3),
      ];

    case 'securityThreat':
      return [
        createSecurityGateRule(1),
        createSocietyAdminRule(2),
      ];

    case 'seniorHelp':
      return [
        createSecurityGateRule(1),
        createSocietyAdminRule(2),
        createVolunteerGroupRule(3),
      ];

    case 'generalEmergency':
      return [
        createSecurityGateRule(1),
        createSocietyAdminRule(2),
        createVolunteerGroupRule(3),
      ];
  }
}


function getFallbackPolicy(_sosType: SosType): SosFallbackPolicy {
  return { ...DEFAULT_FALLBACK_POLICY };
}



let planCounter = 0;


export function createDefaultResponsePlan(
  sosType: SosType,
  context: SosResidenceContext
): SosResponsePlan {
  planCounter += 1;
  const now = new Date().toISOString();

  return {
    id: `default-plan-${context.residenceId}-${sosType}-${planCounter}`,
    societyId: context.societyId,
    residenceId: context.residenceId,
    unitId: context.unitId,
    sosType,
    mode: 'recommended',
    recipientRules: getDefaultRecipientRules(sosType),
    fallbackPolicy: getFallbackPolicy(sosType),
    version: 1,
    createdAt: now,
    updatedAt: now,
  };
}

export function createAllDefaultResponsePlans(
  context: SosResidenceContext
): SosResponsePlan[] {
  return ALL_SOS_TYPES.map((sosType) => createDefaultResponsePlan(sosType, context));
}

export function getMandatoryRecipientIds(sosType: SosType): string[] {
  return getDefaultRecipientRules(sosType)
    .filter((rule) => rule.mandatory)
    .map((rule) => rule.recipientId);
}

export function findMissingMandatoryRecipients(plan: SosResponsePlan): string[] {
  const mandatoryIds = getMandatoryRecipientIds(plan.sosType);
  const planRecipientIds = new Set(plan.recipientRules.map((r) => r.recipientId));

  return mandatoryIds.filter((id) => !planRecipientIds.has(id));
}
