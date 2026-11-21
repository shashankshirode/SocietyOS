import type { ResidentHomeRole } from '../../homeContext/data/residentHomeContext.types';
import type { ResidenceOnboardingConfiguration, ResidenceOnboardingState, ResidenceOnboardingCompletion, ResidenceOnboardingStep, } from './membership.types';
import type { ResidenceOnboardingRepository } from './onboardingRepository.types';
const onboardingStore = new Map<string, {
    completedStepIds: string[];
    rulesVersionAcknowledged: string | null;
    completed: boolean;
    stepData: Record<string, Record<string, string | boolean | number>>;
}>();
function generateStepsForRole(role: ResidentHomeRole): ResidenceOnboardingStep[] {
    const baseSteps: ResidenceOnboardingStep[] = [
        { id: 'confirm-residence', type: 'confirmResidence', title: 'Confirm your home', subtitle: 'Verify your residence details are correct.', required: true, completed: false, enabled: true, order: 1 },
        { id: 'confirm-profile', type: 'confirmProfile', title: 'Essential details', subtitle: 'Set your preferred display name and locale.', required: true, completed: false, enabled: true, order: 2 },
        { id: 'notifications', type: 'notificationPreferences', title: 'Notifications', subtitle: 'Choose how you receive updates.', required: true, completed: false, enabled: true, order: 3 },
        { id: 'emergency', type: 'emergencyPreferences', title: 'Emergency readiness', subtitle: 'Configure your emergency contacts and SOS recipients.', required: true, completed: false, enabled: true, order: 4 },
        { id: 'society-rules', type: 'societyRules', title: 'Society rules', subtitle: 'Review and acknowledge the society bylaws and privacy policy.', required: true, completed: false, enabled: true, order: 5 },
    ];
    const roleSteps: ResidenceOnboardingStep[] = [];
    if (role === 'owner' || role === 'coOwner') {
        roleSteps.push({ id: 'role-family-setup', type: 'roleSpecificSetup', title: 'Family setup', subtitle: 'Add family members who live in this unit.', required: false, completed: false, enabled: true, order: 6 });
    }
    if (role === 'tenant') {
        roleSteps.push({ id: 'role-tenant-docs', type: 'roleSpecificSetup', title: 'Tenant documents', subtitle: 'Verify your rent agreement and police verification status.', required: true, completed: false, enabled: true, order: 6 });
    }
    if (role === 'familyMember') {
        roleSteps.push({ id: 'role-family-permissions', type: 'roleSpecificSetup', title: 'Your permissions', subtitle: 'Review the access permissions assigned to you.', required: false, completed: false, enabled: true, order: 6 });
    }
    const optionalSteps: ResidenceOnboardingStep[] = [
        { id: 'optional-participation', type: 'emergencyPreferences', title: 'Optional participation', subtitle: 'Choose to participate in community and emergency volunteering.', required: false, completed: false, enabled: true, order: 7 },
    ];
    const completionStep: ResidenceOnboardingStep = {
        id: 'completion', type: 'completion', title: 'All set', subtitle: 'Your home is ready.', required: true, completed: false, enabled: true, order: 8,
    };
    return [...baseSteps, ...roleSteps, ...optionalSteps, completionStep];
}
export const onboardingMockSource: ResidenceOnboardingRepository = {
    async getOnboardingConfiguration(membershipId, _signal) {
        const stored = onboardingStore.get(membershipId);
        const completedIds = stored?.completedStepIds ?? [];
        const roleMap: Record<string, ResidentHomeRole> = {
            'membership-001': 'owner',
            'membership-002': 'familyMember',
            'membership-003': 'tenant',
            'membership-004': 'owner',
            'membership-005': 'tenant',
            'membership-006': 'familyMember',
            'membership-007': 'tenant',
            'membership-008': 'owner',
        };
        const societyMap: Record<string, string> = {
            'membership-001': 'Green Valley Heights',
            'membership-002': 'Green Valley Heights',
            'membership-003': 'Gokhale Park Residency',
            'membership-004': 'Rohan Ananta',
            'membership-005': 'Riverstone Enclave',
            'membership-006': 'Emerald Court',
            'membership-007': 'Skyline Residency',
            'membership-008': 'Orchid Habitat',
        };
        const unitMap: Record<string, string> = {
            'membership-001': 'A-1204',
            'membership-002': 'B-804',
            'membership-003': 'C-503',
            'membership-004': 'P-1102',
            'membership-005': 'D-602',
            'membership-006': 'A-303',
            'membership-007': 'B-905',
            'membership-008': 'C-704',
        };
        const role = roleMap[membershipId] ?? 'owner';
        const steps = generateStepsForRole(role).map((step) => ({
            ...step,
            completed: completedIds.includes(step.id),
        }));
        const requiredSteps = steps.filter((s) => s.required);
        const completedRequired = requiredSteps.filter((s) => s.completed).length;
        const config: ResidenceOnboardingConfiguration = {
            membershipId,
            societyName: societyMap[membershipId] ?? 'Society',
            unitDisplayName: unitMap[membershipId] ?? 'Unit',
            role,
            steps,
            totalRequired: requiredSteps.length,
            completedRequired,
            canSkipOptional: true,
        };
        return config;
    },
    async saveOnboardingStep(membershipId, request, _signal) {
        const existing = onboardingStore.get(membershipId) ?? {
            completedStepIds: [],
            rulesVersionAcknowledged: null,
            completed: false,
            stepData: {},
        };
        if (!existing.completedStepIds.includes(request.stepId)) {
            existing.completedStepIds.push(request.stepId);
        }
        existing.stepData[request.stepId] = request.data;
        onboardingStore.set(membershipId, existing);
        const config = await this.getOnboardingConfiguration(membershipId);
        const totalSteps = config.steps.length;
        const completedSteps = existing.completedStepIds.length;
        const nextIncomplete = config.steps.find((s) => !existing.completedStepIds.includes(s.id) && s.id !== 'completion');
        const state: ResidenceOnboardingState = {
            completed: existing.completed,
            currentStepId: nextIncomplete?.id ?? 'completion',
            completedStepIds: existing.completedStepIds,
            totalSteps,
            completedSteps,
            rulesVersionAcknowledged: existing.rulesVersionAcknowledged,
            latestRulesVersion: 'v2.1',
        };
        return state;
    },
    async completeOnboarding(membershipId, request, _signal) {
        const existing = onboardingStore.get(membershipId) ?? {
            completedStepIds: [],
            rulesVersionAcknowledged: null,
            completed: false,
            stepData: {},
        };
        existing.completed = true;
        existing.rulesVersionAcknowledged = request.acknowledgedRulesVersion;
        if (!existing.completedStepIds.includes('completion')) {
            existing.completedStepIds.push('completion');
        }
        onboardingStore.set(membershipId, existing);
        const completion: ResidenceOnboardingCompletion = {
            membershipId,
            completed: true,
            completedAt: request.consentTimestamp,
            dashboardReady: true,
        };
        return completion;
    },
};

