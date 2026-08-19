import { createPrerequisiteAction } from './prerequisiteActionMapper';
import { isBlockingPrerequisite } from './prerequisiteSeverity';
import type { PrerequisiteCheck, PrerequisiteDefinition, PrerequisiteEvaluationResult, PrerequisiteRuntimeContext, ResidentModuleKey, } from './prerequisite.types';
import { includeWhenPresent } from "../utils/presentProperty";
type PrerequisiteActionKey = 'createVisitorPass' | 'payBill' | 'raiseComplaint' | 'viewDocument' | 'uploadDocument' | 'createNoc' | 'addTenant' | 'bookFacility' | 'sendContactRequest' | 'showLocalSuggestion';
type RuleKey = `${ResidentModuleKey}:${PrerequisiteActionKey}`;
const key = (moduleKey: ResidentModuleKey, actionKey: PrerequisiteActionKey): RuleKey => `${moduleKey}:${actionKey}`;
const commonSocietyUnitRules = (requiredForMessageKey: string): PrerequisiteDefinition[] => [
    {
        id: 'active-society',
        contextKey: 'activeSocietyExists',
        missingStatus: 'missing',
        severity: 'blocking',
        titleMessageKey: 'resident.prerequisites.activeSocietyTitle',
        descriptionMessageKey: 'resident.prerequisites.activeSocietyDescription',
        requiredForMessageKey,
        resolutionStepsMessageKeys: ['resident.prerequisites.activeSocietyStep'],
        action: createPrerequisiteAction('completeProfile', 'OwnerTenantOverview')
    },
    {
        id: 'active-unit',
        contextKey: 'activeUnitExists',
        missingStatus: 'missing',
        severity: 'blocking',
        titleMessageKey: 'resident.prerequisites.activeUnitTitle',
        descriptionMessageKey: 'resident.prerequisites.activeUnitDescription',
        requiredForMessageKey,
        resolutionStepsMessageKeys: ['resident.prerequisites.activeUnitStep'],
        action: createPrerequisiteAction('completeProfile', 'OwnerTenantOverview')
    },
];
const prerequisiteRules: Partial<Record<RuleKey, PrerequisiteDefinition[]>> = {
    [key('visitors', 'createVisitorPass')]: [
        ...commonSocietyUnitRules('resident.prerequisites.requiredForVisitorPass'),
        {
            id: 'resident-access',
            contextKey: 'residentAccessActive',
            missingStatus: 'restricted',
            severity: 'restricted',
            titleMessageKey: 'resident.prerequisites.residentAccessTitle',
            descriptionMessageKey: 'resident.prerequisites.residentAccessDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForVisitorPass',
            resolutionStepsMessageKeys: ['resident.prerequisites.residentAccessStep'],
            action: createPrerequisiteAction('contactAdmin')
        },
        {
            id: 'visitor-feature',
            contextKey: 'featureEnabled',
            missingStatus: 'restricted',
            severity: 'restricted',
            titleMessageKey: 'resident.prerequisites.featureDisabledTitle',
            descriptionMessageKey: 'resident.prerequisites.featureDisabledDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForVisitorPass',
            resolutionStepsMessageKeys: ['resident.prerequisites.featureDisabledStep'],
            action: createPrerequisiteAction('contactAdmin')
        },
        {
            id: 'visitor-permission',
            contextKey: 'permissionEnabled',
            missingStatus: 'restricted',
            severity: 'restricted',
            titleMessageKey: 'resident.prerequisites.residentAccessTitle',
            descriptionMessageKey: 'resident.prerequisites.residentAccessDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForVisitorPass',
            resolutionStepsMessageKeys: ['resident.prerequisites.residentAccessStep'],
            action: createPrerequisiteAction('contactAdmin')
        },
        {
            id: 'gate-setup',
            contextKey: 'gateSetupExists',
            missingStatus: 'blocked',
            severity: 'blocking',
            titleMessageKey: 'resident.prerequisites.gateSetupTitle',
            descriptionMessageKey: 'resident.prerequisites.gateSetupDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForVisitorPass',
            resolutionStepsMessageKeys: ['resident.prerequisites.gateSetupStep'],
            action: createPrerequisiteAction('contactAdmin')
        },
        {
            id: 'visitor-details',
            contextKey: 'visitorDetailsProvided',
            missingStatus: 'missing',
            severity: 'warning',
            titleMessageKey: 'resident.prerequisites.visitorDetailsTitle',
            descriptionMessageKey: 'resident.prerequisites.visitorDetailsDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForVisitorPass',
            resolutionStepsMessageKeys: ['resident.prerequisites.visitorDetailsStep'],
            action: createPrerequisiteAction('navigate', 'CreateVisitorFromHome')
        },
    ],
    [key('billing', 'payBill')]: [
        {
            id: 'billing-feature',
            contextKey: 'featureEnabled',
            missingStatus: 'restricted',
            severity: 'restricted',
            titleMessageKey: 'resident.prerequisites.featureDisabledTitle',
            descriptionMessageKey: 'resident.prerequisites.featureDisabledDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForBillPayment',
            resolutionStepsMessageKeys: ['resident.prerequisites.featureDisabledStep'],
            action: createPrerequisiteAction('contactAdmin')
        },
        {
            id: 'current-bill',
            contextKey: 'currentBillExists',
            missingStatus: 'missing',
            severity: 'blocking',
            titleMessageKey: 'resident.prerequisites.billMissingTitle',
            descriptionMessageKey: 'resident.prerequisites.billMissingDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForBillPayment',
            resolutionStepsMessageKeys: ['resident.prerequisites.billMissingStep'],
            action: createPrerequisiteAction('waitForApproval')
        },
        {
            id: 'bill-published',
            contextKey: 'billPublished',
            missingStatus: 'blocked',
            severity: 'blocking',
            titleMessageKey: 'resident.prerequisites.billNotPublishedTitle',
            descriptionMessageKey: 'resident.prerequisites.billNotPublishedDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForBillPayment',
            resolutionStepsMessageKeys: ['resident.prerequisites.billNotPublishedStep'],
            action: createPrerequisiteAction('waitForApproval')
        },
        {
            id: 'outstanding-amount',
            contextKey: 'outstandingAmountExists',
            missingStatus: 'notApplicable',
            severity: 'info',
            titleMessageKey: 'resident.prerequisites.noOutstandingTitle',
            descriptionMessageKey: 'resident.prerequisites.noOutstandingDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForBillPayment',
            resolutionStepsMessageKeys: ['resident.prerequisites.noOutstandingStep'],
            action: createPrerequisiteAction('none')
        },
        {
            id: 'payment-methods',
            contextKey: 'paymentMethodsConfigured',
            missingStatus: 'blocked',
            severity: 'blocking',
            titleMessageKey: 'resident.prerequisites.paymentMethodTitle',
            descriptionMessageKey: 'resident.prerequisites.paymentMethodDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForBillPayment',
            resolutionStepsMessageKeys: ['resident.prerequisites.paymentMethodStep'],
            action: createPrerequisiteAction('contactAdmin')
        },
        {
            id: 'bill-permission',
            contextKey: 'permissionEnabled',
            missingStatus: 'restricted',
            severity: 'restricted',
            titleMessageKey: 'resident.prerequisites.documentPermissionTitle',
            descriptionMessageKey: 'resident.prerequisites.documentPermissionDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForBillPayment',
            resolutionStepsMessageKeys: ['resident.prerequisites.documentPermissionStep'],
            action: createPrerequisiteAction('contactAdmin')
        },
    ],
    [key('complaints', 'raiseComplaint')]: [
        ...commonSocietyUnitRules('resident.prerequisites.requiredForComplaint'),
        {
            id: 'complaints-feature',
            contextKey: 'featureEnabled',
            missingStatus: 'restricted',
            severity: 'restricted',
            titleMessageKey: 'resident.prerequisites.featureDisabledTitle',
            descriptionMessageKey: 'resident.prerequisites.featureDisabledDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForComplaint',
            resolutionStepsMessageKeys: ['resident.prerequisites.featureDisabledStep'],
            action: createPrerequisiteAction('contactAdmin')
        },
        {
            id: 'complaint-categories',
            contextKey: 'complaintCategoriesConfigured',
            missingStatus: 'blocked',
            severity: 'blocking',
            titleMessageKey: 'resident.prerequisites.complaintCategoriesTitle',
            descriptionMessageKey: 'resident.prerequisites.complaintCategoriesDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForComplaint',
            resolutionStepsMessageKeys: ['resident.prerequisites.complaintCategoriesStep'],
            action: createPrerequisiteAction('contactAdmin')
        },
        {
            id: 'complaint-details',
            contextKey: 'complaintDetailsProvided',
            missingStatus: 'missing',
            severity: 'warning',
            titleMessageKey: 'resident.prerequisites.complaintDetailsTitle',
            descriptionMessageKey: 'resident.prerequisites.complaintDetailsDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForComplaint',
            resolutionStepsMessageKeys: ['resident.prerequisites.complaintDetailsStep'],
            action: createPrerequisiteAction('navigate', 'CreateComplaintFromHome')
        },
    ],
    [key('documents', 'viewDocument')]: [
        {
            id: 'document-feature',
            contextKey: 'featureEnabled',
            missingStatus: 'restricted',
            severity: 'restricted',
            titleMessageKey: 'resident.prerequisites.featureDisabledTitle',
            descriptionMessageKey: 'resident.prerequisites.featureDisabledDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForDocument',
            resolutionStepsMessageKeys: ['resident.prerequisites.featureDisabledStep'],
            action: createPrerequisiteAction('contactAdmin')
        },
        {
            id: 'document-permission',
            contextKey: 'documentPermissionEnabled',
            missingStatus: 'restricted',
            severity: 'restricted',
            titleMessageKey: 'resident.prerequisites.documentPermissionTitle',
            descriptionMessageKey: 'resident.prerequisites.documentPermissionDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForDocument',
            resolutionStepsMessageKeys: ['resident.prerequisites.documentPermissionStep'],
            action: createPrerequisiteAction('contactAdmin')
        },
    ],
    [key('documents', 'uploadDocument')]: [
        {
            id: 'document-type',
            contextKey: 'documentTypeSelected',
            missingStatus: 'missing',
            severity: 'warning',
            titleMessageKey: 'resident.prerequisites.documentTypeTitle',
            descriptionMessageKey: 'resident.prerequisites.documentTypeDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForDocument',
            resolutionStepsMessageKeys: ['resident.prerequisites.documentTypeStep'],
            action: createPrerequisiteAction('uploadDocument', 'UploadDocument')
        },
        {
            id: 'document-file',
            contextKey: 'documentFileSelected',
            missingStatus: 'missing',
            severity: 'warning',
            titleMessageKey: 'resident.prerequisites.documentFileTitle',
            descriptionMessageKey: 'resident.prerequisites.documentFileDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForDocument',
            resolutionStepsMessageKeys: ['resident.prerequisites.documentFileStep'],
            action: createPrerequisiteAction('uploadDocument', 'UploadDocument')
        },
    ],
    [key('noc', 'createNoc')]: [
        ...commonSocietyUnitRules('resident.prerequisites.requiredForNoc'),
        {
            id: 'noc-clearance',
            contextKey: 'duesClearanceAvailable',
            missingStatus: 'blocked',
            severity: 'blocking',
            titleMessageKey: 'resident.prerequisites.nocClearanceTitle',
            descriptionMessageKey: 'resident.prerequisites.nocClearanceDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForNoc',
            resolutionStepsMessageKeys: ['resident.prerequisites.nocClearanceStep'],
            action: createPrerequisiteAction('waitForApproval')
        },
        {
            id: 'noc-dues',
            contextKey: 'outstandingAmountExists',
            expectedValue: false,
            missingStatus: 'blocked',
            severity: 'blocking',
            titleMessageKey: 'resident.prerequisites.nocDuesTitle',
            descriptionMessageKey: 'resident.prerequisites.nocDuesDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForNoc',
            resolutionStepsMessageKeys: ['resident.prerequisites.nocDuesStep'],
            action: createPrerequisiteAction('payDues')
        },
    ],
    [key('tenant', 'addTenant')]: [
        {
            id: 'tenant-owner',
            contextKey: 'currentResidentIsOwner',
            missingStatus: 'restricted',
            severity: 'restricted',
            titleMessageKey: 'resident.prerequisites.tenantOwnerTitle',
            descriptionMessageKey: 'resident.prerequisites.tenantOwnerDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForTenant',
            resolutionStepsMessageKeys: ['resident.prerequisites.tenantOwnerStep'],
            action: createPrerequisiteAction('completeProfile', 'CurrentOwnerProfile')
        },
        {
            id: 'owner-profile',
            contextKey: 'ownerProfileActive',
            missingStatus: 'blocked',
            severity: 'blocking',
            titleMessageKey: 'resident.prerequisites.tenantOwnerTitle',
            descriptionMessageKey: 'resident.prerequisites.tenantOwnerDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForTenant',
            resolutionStepsMessageKeys: ['resident.prerequisites.tenantOwnerStep'],
            action: createPrerequisiteAction('completeProfile', 'CurrentOwnerProfile')
        },
        {
            id: 'active-tenant',
            contextKey: 'activeTenantExists',
            expectedValue: false,
            missingStatus: 'blocked',
            severity: 'blocking',
            titleMessageKey: 'resident.prerequisites.tenantExistingTitle',
            descriptionMessageKey: 'resident.prerequisites.tenantExistingDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForTenant',
            resolutionStepsMessageKeys: ['resident.prerequisites.tenantExistingStep'],
            action: createPrerequisiteAction('waitForApproval')
        },
        {
            id: 'previous-noc',
            contextKey: 'previousTenantNocCompleted',
            missingStatus: 'blocked',
            severity: 'blocking',
            titleMessageKey: 'resident.prerequisites.tenantPreviousNocTitle',
            descriptionMessageKey: 'resident.prerequisites.tenantPreviousNocDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForTenant',
            resolutionStepsMessageKeys: ['resident.prerequisites.tenantPreviousNocStep'],
            action: createPrerequisiteAction('waitForApproval')
        },
        {
            id: 'rent-agreement',
            contextKey: 'rentAgreementAvailable',
            missingStatus: 'missing',
            severity: 'warning',
            titleMessageKey: 'resident.prerequisites.tenantAgreementTitle',
            descriptionMessageKey: 'resident.prerequisites.tenantAgreementDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForTenant',
            resolutionStepsMessageKeys: ['resident.prerequisites.tenantAgreementStep'],
            action: createPrerequisiteAction('uploadDocument', 'AddTenantDocuments')
        },
    ],
    [key('facility', 'bookFacility')]: [
        {
            id: 'facility-setup',
            contextKey: 'facilityExists',
            missingStatus: 'blocked',
            severity: 'blocking',
            titleMessageKey: 'resident.prerequisites.facilityMissingTitle',
            descriptionMessageKey: 'resident.prerequisites.facilityMissingDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForFacility',
            resolutionStepsMessageKeys: ['resident.prerequisites.facilityMissingStep'],
            action: createPrerequisiteAction('contactAdmin')
        },
        {
            id: 'facility-rules',
            contextKey: 'facilityRulesConfigured',
            missingStatus: 'blocked',
            severity: 'blocking',
            titleMessageKey: 'resident.prerequisites.facilityMissingTitle',
            descriptionMessageKey: 'resident.prerequisites.facilityMissingDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForFacility',
            resolutionStepsMessageKeys: ['resident.prerequisites.facilityMissingStep'],
            action: createPrerequisiteAction('contactAdmin')
        },
        {
            id: 'facility-slots',
            contextKey: 'selectedSlotAvailable',
            missingStatus: 'missing',
            severity: 'warning',
            titleMessageKey: 'resident.prerequisites.facilitySlotsTitle',
            descriptionMessageKey: 'resident.prerequisites.facilitySlotsDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForFacility',
            resolutionStepsMessageKeys: ['resident.prerequisites.facilitySlotsStep'],
            action: createPrerequisiteAction('retry')
        },
    ],
    [key('residentConnect', 'sendContactRequest')]: [
        {
            id: 'privacy-settings',
            contextKey: 'privacySettingsLoaded',
            missingStatus: 'missing',
            severity: 'warning',
            titleMessageKey: 'resident.prerequisites.privacyTitle',
            descriptionMessageKey: 'resident.prerequisites.privacyDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForConnect',
            resolutionStepsMessageKeys: ['resident.prerequisites.privacyStep'],
            action: createPrerequisiteAction('navigate', 'ResidentPrivacySettings')
        },
        {
            id: 'target-resident',
            contextKey: 'targetResidentExists',
            missingStatus: 'restricted',
            severity: 'restricted',
            titleMessageKey: 'resident.prerequisites.targetResidentTitle',
            descriptionMessageKey: 'resident.prerequisites.targetResidentDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForConnect',
            resolutionStepsMessageKeys: ['resident.prerequisites.targetResidentStep'],
            action: createPrerequisiteAction('contactAdmin')
        },
        {
            id: 'connect-details',
            contextKey: 'connectDetailsProvided',
            missingStatus: 'missing',
            severity: 'warning',
            titleMessageKey: 'resident.prerequisites.connectDetailsTitle',
            descriptionMessageKey: 'resident.prerequisites.connectDetailsDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForConnect',
            resolutionStepsMessageKeys: ['resident.prerequisites.connectDetailsStep'],
            action: createPrerequisiteAction('navigate', 'CreateContactRequest')
        },
    ],
    [key('contextualInsights', 'showLocalSuggestion')]: [
        {
            id: 'area',
            contextKey: 'activeSocietyAreaExists',
            missingStatus: 'missing',
            severity: 'warning',
            titleMessageKey: 'resident.prerequisites.weatherAreaTitle',
            descriptionMessageKey: 'resident.prerequisites.weatherAreaDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForContext',
            resolutionStepsMessageKeys: ['resident.prerequisites.weatherAreaStep'],
            action: createPrerequisiteAction('contactAdmin')
        },
        {
            id: 'weather',
            contextKey: 'weatherSnapshotExists',
            missingStatus: 'missing',
            severity: 'warning',
            titleMessageKey: 'resident.prerequisites.weatherAreaTitle',
            descriptionMessageKey: 'resident.prerequisites.weatherAreaDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForContext',
            resolutionStepsMessageKeys: ['resident.prerequisites.weatherAreaStep'],
            action: createPrerequisiteAction('retry')
        },
        {
            id: 'advisory',
            contextKey: 'localAdvisoryFeedAvailable',
            missingStatus: 'notApplicable',
            severity: 'info',
            titleMessageKey: 'resident.prerequisites.advisoryTitle',
            descriptionMessageKey: 'resident.prerequisites.advisoryDescription',
            requiredForMessageKey: 'resident.prerequisites.requiredForContext',
            resolutionStepsMessageKeys: ['resident.prerequisites.advisoryStep'],
            action: createPrerequisiteAction('retry')
        },
    ]
};
function toCheck(definition: PrerequisiteDefinition, context: PrerequisiteRuntimeContext): PrerequisiteCheck {
    const expectedValue = definition.expectedValue ?? true;
    const actualValue = context[definition.contextKey] ?? true;
    const satisfied = actualValue === expectedValue;
    return {
        id: definition.id,
        status: satisfied ? 'satisfied' : definition.missingStatus,
        severity: satisfied ? 'info' : definition.severity,
        titleMessageKey: definition.titleMessageKey,
        descriptionMessageKey: definition.descriptionMessageKey,
        requiredForMessageKey: definition.requiredForMessageKey,
        resolutionStepsMessageKeys: definition.resolutionStepsMessageKeys,
        ...includeWhenPresent("action", satisfied ? undefined : definition.action)
    };
}
export function evaluatePrerequisites({ moduleKey, actionKey, context = {}, }: {
    moduleKey: ResidentModuleKey;
    actionKey: PrerequisiteActionKey;
    context?: PrerequisiteRuntimeContext;
}): PrerequisiteEvaluationResult {
    const rules = prerequisiteRules[key(moduleKey, actionKey)] ?? [];
    const checks = rules.map((rule) => toCheck(rule, context));
    const blockingChecks = checks.filter(isBlockingPrerequisite);
    const warningChecks = checks.filter((check) => check.status === 'missing' && !isBlockingPrerequisite(check));
    return {
        moduleKey,
        actionKey,
        canContinue: blockingChecks.length === 0 && warningChecks.length === 0,
        checks,
        blockingChecks,
        warningChecks
    };
}
export { prerequisiteRules };

