import type { SosType, SosResponsePlan, SosRecipientRule, SosRecipientResolutionResult, SosResolvedRecipient, SosResolutionWarning, SosResidenceContext, } from './sosResponsePlan.types';
import { DEFAULT_FALLBACK_POLICY } from './sosResponsePlan.types';
import type { SosEmergencyContact, TrustedContactInvitation } from './sosEmergencyContact.types';
import { createDefaultResponsePlan, getMandatoryRecipientIds } from './sosDefaultResponsePlans';
import type { Absent } from "../../../../shared/types/absence.types";
export interface RecipientResolverInput {
    readonly sosType: SosType;
    readonly context: SosResidenceContext;
    readonly plan: SosResponsePlan | Absent;
    readonly contacts: SosEmergencyContact[];
    readonly invitations: TrustedContactInvitation[];
}
export function resolveRecipients(input: RecipientResolverInput): SosRecipientResolutionResult {
    const { sosType, context, contacts, invitations } = input;
    const warnings: SosResolutionWarning[] = [];
    let fallbackActivated = false;
    let activePlan = input.plan;
    if (!activePlan) {
        activePlan = createDefaultResponsePlan(sosType, context);
        fallbackActivated = true;
        warnings.push({
            code: 'planUnconfigured',
            messageKey: 'resident.emergency.sosSettings.warnings.planUnconfigured',
        });
    }
    const rules = [...activePlan.recipientRules];
    const validRules: SosRecipientRule[] = [];
    const excludedIds: string[] = [];
    for (const rule of rules) {
        if (!rule.enabled)
            continue;
        if (rule.recipientType === 'trustedResident') {
            const invitation = invitations.find((inv) => inv.recipientResidentId === rule.recipientId);
            if (invitation && invitation.status === 'pending') {
                excludedIds.push(rule.recipientId);
                continue;
            }
            if (invitation && invitation.status === 'declined') {
                excludedIds.push(rule.recipientId);
                continue;
            }
        }
        if (rule.recipientType === 'externalEmergencyContact' ||
            rule.recipientType === 'familyMember') {
            const contact = contacts.find((c) => c.id === rule.recipientId);
            if (contact) {
                if (!contact.active) {
                    excludedIds.push(rule.recipientId);
                    continue;
                }
                if (!contact.availableForSosTypes.includes(sosType)) {
                    excludedIds.push(rule.recipientId);
                    continue;
                }
            }
        }
        validRules.push(rule);
    }
    if (excludedIds.length > 0) {
        const hasInactiveContacts = excludedIds.some((id) => {
            const contact = contacts.find((c) => c.id === id);
            return contact && !contact.active;
        });
        const hasPendingInvitations = excludedIds.some((id) => invitations.some((inv) => inv.recipientResidentId === id && inv.status === 'pending'));
        if (hasInactiveContacts) {
            warnings.push({
                code: 'someContactsInactive',
                messageKey: 'resident.emergency.sosSettings.warnings.someContactsInactive',
                affectedRecipientIds: excludedIds,
            });
        }
        if (hasPendingInvitations) {
            warnings.push({
                code: 'pendingInvitationsExcluded',
                messageKey: 'resident.emergency.sosSettings.warnings.pendingInvitationsExcluded',
                affectedRecipientIds: excludedIds,
            });
        }
    }
    const mandatoryIds = getMandatoryRecipientIds(sosType);
    const presentMandatory = new Set(validRules.filter((r) => r.mandatory).map((r) => r.recipientId));
    for (const mId of mandatoryIds) {
        if (!presentMandatory.has(mId)) {
            const defaultPlan = createDefaultResponsePlan(sosType, context);
            const missingRule = defaultPlan.recipientRules.find((r) => r.recipientId === mId);
            if (missingRule) {
                validRules.unshift(missingRule);
                fallbackActivated = true;
            }
        }
    }
    const hasPersonalContacts = validRules.some((r) => r.recipientType === 'familyMember' ||
        r.recipientType === 'externalEmergencyContact' ||
        r.recipientType === 'trustedResident');
    if (!hasPersonalContacts) {
        warnings.push({
            code: 'noPersonalContacts',
            messageKey: 'resident.emergency.sosSettings.warnings.noPersonalContacts',
        });
    }
    const fallbackPolicy = activePlan.fallbackPolicy ?? DEFAULT_FALLBACK_POLICY;
    if (fallbackPolicy.continueWhenPersonalRecipientsUnavailable &&
        !hasPersonalContacts &&
        !fallbackActivated) {
        fallbackActivated = true;
        warnings.push({
            code: 'fallbackActivated',
            messageKey: 'resident.emergency.sosSettings.warnings.fallbackActivated',
        });
    }
    const seen = new Set<string>();
    const deduped: SosRecipientRule[] = [];
    let duplicatesRemoved = 0;
    for (const rule of validRules) {
        if (seen.has(rule.recipientId)) {
            duplicatesRemoved += 1;
            continue;
        }
        seen.add(rule.recipientId);
        deduped.push(rule);
    }
    if (duplicatesRemoved > 0) {
        warnings.push({
            code: 'duplicatesRemoved',
            messageKey: 'resident.emergency.sosSettings.warnings.duplicatesRemoved',
        });
    }
    const sorted = [...deduped].sort((a, b) => a.escalationOrder - b.escalationOrder);
    const resolvedRecipients: SosResolvedRecipient[] = sorted.map((rule) => ({
        recipientId: rule.recipientId,
        recipientType: rule.recipientType,
        displayName: rule.recipientDisplayName,
        source: rule.source,
        mandatory: rule.mandatory,
        escalationOrder: rule.escalationOrder,
        notifyImmediately: rule.notifyImmediately,
        escalationDelaySeconds: rule.escalationDelaySeconds,
        channels: rule.notificationChannels,
    }));
    return {
        sosType,
        residenceId: context.residenceId,
        planId: activePlan.id,
        planMode: input.plan ? activePlan.mode : 'default',
        resolvedRecipients,
        warnings,
        isComplete: resolvedRecipients.length > 0 && warnings.filter((w) => w.code === 'planUnconfigured').length === 0,
        fallbackActivated,
        resolvedAt: new Date().toISOString(),
    };
}
export function isResolutionSafe(result: SosRecipientResolutionResult): boolean {
    return result.resolvedRecipients.length > 0;
}
export function getRecipientSummary(result: SosRecipientResolutionResult): {
    mandatoryCount: number;
    personalCount: number;
    totalCount: number;
    mandatoryNames: string[];
} {
    const mandatory = result.resolvedRecipients.filter((r) => r.mandatory);
    const personal = result.resolvedRecipients.filter((r) => !r.mandatory);
    return {
        mandatoryCount: mandatory.length,
        personalCount: personal.length,
        totalCount: result.resolvedRecipients.length,
        mandatoryNames: mandatory.map((r) => r.displayName),
    };
}

