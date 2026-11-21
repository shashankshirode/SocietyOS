import type { ResidentHomeRole } from '../../homeContext/data/residentHomeContext.types';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
export interface SupportedCountry {
    readonly isoCode: string;
    readonly displayName: string;
    readonly flag: string;
    readonly callingCode: SupportedCallingCode;
    readonly phoneNumberMinLength: number;
    readonly phoneNumberMaxLength: number;
    readonly phoneNumberExample: string;
    readonly defaultTimeZone: string;
    readonly defaultLocale: string;
}
export type SupportedCallingCode = '+91' | '+1' | '+44' | '+61' | '+65' | '+971';
export const supportedCountries: readonly SupportedCountry[] = [
    { isoCode: 'IN', displayName: 'India', flag: '🇮🇳', callingCode: '+91', phoneNumberMinLength: 10, phoneNumberMaxLength: 10, phoneNumberExample: '98765 43210', defaultTimeZone: 'Asia/Kolkata', defaultLocale: 'en-IN' },
    { isoCode: 'US', displayName: 'United States', flag: '🇺🇸', callingCode: '+1', phoneNumberMinLength: 10, phoneNumberMaxLength: 10, phoneNumberExample: '(555) 123-4567', defaultTimeZone: 'America/New_York', defaultLocale: 'en-US' },
    { isoCode: 'GB', displayName: 'United Kingdom', flag: '🇬🇧', callingCode: '+44', phoneNumberMinLength: 10, phoneNumberMaxLength: 11, phoneNumberExample: '07911 123456', defaultTimeZone: 'Europe/London', defaultLocale: 'en-GB' },
    { isoCode: 'AU', displayName: 'Australia', flag: '🇦🇺', callingCode: '+61', phoneNumberMinLength: 9, phoneNumberMaxLength: 10, phoneNumberExample: '0412 345 678', defaultTimeZone: 'Australia/Sydney', defaultLocale: 'en-AU' },
    { isoCode: 'SG', displayName: 'Singapore', flag: '🇸🇬', callingCode: '+65', phoneNumberMinLength: 8, phoneNumberMaxLength: 8, phoneNumberExample: '9123 4567', defaultTimeZone: 'Asia/Singapore', defaultLocale: 'en-SG' },
    { isoCode: 'AE', displayName: 'United Arab Emirates', flag: '🇦🇪', callingCode: '+971', phoneNumberMinLength: 9, phoneNumberMaxLength: 9, phoneNumberExample: '50 123 4567', defaultTimeZone: 'Asia/Dubai', defaultLocale: 'en-AE' },
] as const;
export type ResidenceMembershipStatus = 'invited' | 'profileIncomplete' | 'documentsRequired' | 'ownerConsentRequired' | 'societyApprovalPending' | 'active' | 'rejected' | 'suspended' | 'revoked' | 'expired' | 'societyInactive' | 'unitTransferPending';
export type ResidenceApproverGroup = 'societyAdministrator' | 'committeeOffice' | 'facilityManagement' | 'owner' | 'membershipDesk';
export type ResidenceAccessAction = 'openHome' | 'trackRequest' | 'remindApprover' | 'withdrawRequest' | 'completeProfile' | 'uploadDocuments' | 'requestOwnerConsent' | 'reviewDecision' | 'correctAndResubmit' | 'contactSupport' | 'renewAccess' | 'viewHistory';
export type ResidenceAccessRequirementType = 'policeVerification' | 'ownerConsent' | 'rentAgreement' | 'identityVerification' | 'societyRulesAcknowledgement' | 'addressProof' | 'photoId';
export interface ResidenceAccessRequirement {
    readonly type: ResidenceAccessRequirementType;
    readonly label: string;
    readonly completed: boolean;
    readonly mandatory: boolean;
}
export interface ResidenceOnboardingState {
    readonly completed: boolean;
    readonly currentStepId: string | null;
    readonly completedStepIds: readonly string[];
    readonly totalSteps: number;
    readonly completedSteps: number;
    readonly rulesVersionAcknowledged: string | null;
    readonly latestRulesVersion: string;
}
export interface ImageAssetReference {
    readonly uri: string;
    readonly fallbackGradient: readonly string[];
    readonly fallbackIcon: string;
    readonly accessibilityLabel: string;
}
export interface ResidenceMembership {
    readonly membershipId: string;
    readonly societyId: string;
    readonly societyName: string;
    readonly societyImage: ImageAssetReference;
    readonly unitId: string;
    readonly unitDisplayName: string;
    readonly buildingName: string;
    readonly wingName?: string;
    readonly floorLabel?: string;
    readonly role: ResidentHomeRole;
    readonly status: ResidenceMembershipStatus;
    readonly statusReason?: string;
    readonly statusUpdatedAt: string;
    readonly approverGroup?: ResidenceApproverGroup;
    readonly outstandingRequirements: readonly ResidenceAccessRequirement[];
    readonly onboardingState: ResidenceOnboardingState;
    readonly lastAccessedAt?: string;
    readonly isLastActiveResidence: boolean;
    readonly availableActions: readonly ResidenceAccessAction[];
    readonly homeContextId: string;
    readonly lastReminderSentAt?: string;
    readonly reminderCount: number;
    readonly nextReminderAvailableAt?: string;
}
export interface AccessReminderPolicy {
    readonly enabled: boolean;
    readonly minimumIntervalHours: number;
    readonly maximumRemindersWithinWindow: number;
    readonly reminderWindowDays: number;
    readonly allowResidentNote: boolean;
    readonly escalationAfterDays?: number;
}
export interface AccessReminderRequest {
    readonly note?: string;
}
export interface AccessReminderResult {
    readonly sent: boolean;
    readonly nextAvailableAt: string;
    readonly totalRemindersSent: number;
    readonly remainingReminders: number;
}
export type AccessTimelineEventType = 'accessRequested' | 'profileVerified' | 'documentsSubmitted' | 'ownerConsentReceived' | 'sentForSocietyApproval' | 'reminderSent' | 'additionalInfoRequested' | 'accessApproved' | 'accessRejected' | 'accessSuspended' | 'accessRevoked' | 'accessExpired' | 'requestWithdrawn' | 'resubmitted';
export interface ResidenceAccessTimelineEvent {
    readonly id: string;
    readonly type: AccessTimelineEventType;
    readonly title: string;
    readonly description?: string;
    readonly occurredAt: string;
    readonly actor?: string;
}
export interface WithdrawAccessRequest {
    readonly reason?: string;
}
export interface ResidenceAccessRequest {
    readonly societyCode: string;
    readonly unitId: string;
    readonly role: ResidentHomeRole;
    readonly supportingNote?: string;
}
export interface ResidenceAccessRequestResult {
    readonly membership: ResidenceMembership;
    readonly timeline: readonly ResidenceAccessTimelineEvent[];
}
export type ResidenceOnboardingStepType = 'confirmProfile' | 'confirmResidence' | 'notificationPreferences' | 'emergencyContacts' | 'emergencyPreferences' | 'societyRules' | 'privacyConsent' | 'languageAndTimeZone' | 'roleSpecificSetup' | 'completion';
export interface ResidenceOnboardingStep {
    readonly id: string;
    readonly type: ResidenceOnboardingStepType;
    readonly title: string;
    readonly subtitle: string;
    readonly required: boolean;
    readonly completed: boolean;
    readonly enabled: boolean;
    readonly order: number;
}
export interface ResidenceOnboardingConfiguration {
    readonly membershipId: string;
    readonly societyName: string;
    readonly unitDisplayName: string;
    readonly role: ResidentHomeRole;
    readonly steps: readonly ResidenceOnboardingStep[];
    readonly totalRequired: number;
    readonly completedRequired: number;
    readonly canSkipOptional: boolean;
}
export interface SaveOnboardingStepRequest {
    readonly stepId: string;
    readonly data: Record<string, string | boolean | number>;
}
export interface CompleteOnboardingRequest {
    readonly acknowledgedRulesVersion: string;
    readonly consentTimestamp: string;
}
export interface ResidenceOnboardingCompletion {
    readonly membershipId: string;
    readonly completed: boolean;
    readonly completedAt: string;
    readonly dashboardReady: boolean;
}
export type AuthenticatedResidentState = {
    readonly type: 'newResident';
} | {
    readonly type: 'existingResidentWithoutMembership';
} | {
    readonly type: 'existingResidentWithSingleActiveMembership';
    readonly membership: ResidenceMembership;
} | {
    readonly type: 'existingResidentWithMultipleMemberships';
    readonly memberships: readonly ResidenceMembership[];
} | {
    readonly type: 'existingResidentWithPendingAccess';
    readonly memberships: readonly ResidenceMembership[];
} | {
    readonly type: 'existingResidentWithActionRequired';
    readonly memberships: readonly ResidenceMembership[];
} | {
    readonly type: 'existingResidentWithNoActiveAccess';
    readonly memberships: readonly ResidenceMembership[];
} | {
    readonly type: 'existingResidentWithSuspendedSession';
    readonly memberships: readonly ResidenceMembership[];
};
export interface GroupedMemberships {
    readonly active: readonly ResidenceMembership[];
    readonly pendingApproval: readonly ResidenceMembership[];
    readonly actionRequired: readonly ResidenceMembership[];
    readonly unavailable: readonly ResidenceMembership[];
}
export function groupMemberships(memberships: readonly ResidenceMembership[]): GroupedMemberships {
    const active: ResidenceMembership[] = [];
    const pendingApproval: ResidenceMembership[] = [];
    const actionRequired: ResidenceMembership[] = [];
    const unavailable: ResidenceMembership[] = [];
    for (const m of memberships) {
        switch (m.status) {
            case 'active':
                active.push(m);
                break;
            case 'invited':
            case 'societyApprovalPending':
            case 'unitTransferPending':
                pendingApproval.push(m);
                break;
            case 'profileIncomplete':
            case 'documentsRequired':
            case 'ownerConsentRequired':
                actionRequired.push(m);
                break;
            case 'rejected':
            case 'suspended':
            case 'revoked':
            case 'expired':
            case 'societyInactive':
                unavailable.push(m);
                break;
        }
    }
    return { active, pendingApproval, actionRequired, unavailable };
}
export function resolveAuthenticatedState(memberships: readonly ResidenceMembership[], isNewResident: boolean): AuthenticatedResidentState {
    if (isNewResident && memberships.length === 0) {
        return { type: 'newResident' };
    }
    if (memberships.length === 0) {
        return { type: 'existingResidentWithoutMembership' };
    }
    const grouped = groupMemberships(memberships);
    if (grouped.active.length === 1 && grouped.pendingApproval.length === 0 && grouped.actionRequired.length === 0) {
        return { type: 'existingResidentWithSingleActiveMembership', membership: getRequiredItem(grouped.active, 0, "membership.types.ts") };
    }
    if (grouped.active.length > 0) {
        return { type: 'existingResidentWithMultipleMemberships', memberships };
    }
    if (grouped.actionRequired.length > 0) {
        return { type: 'existingResidentWithActionRequired', memberships };
    }
    if (grouped.pendingApproval.length > 0) {
        return { type: 'existingResidentWithPendingAccess', memberships };
    }
    const hasSuspended = memberships.some((m) => m.status === 'suspended' || m.status === 'revoked');
    if (hasSuspended) {
        return { type: 'existingResidentWithSuspendedSession', memberships };
    }
    return { type: 'existingResidentWithNoActiveAccess', memberships };
}

