import { useState, useCallback, useMemo } from 'react';
import type { ResidentOnboardingDraft, OnboardingStep, OnboardingMilestone, OnboardingSociety, OnboardingUnit, ResidentRole, FamilyRelation, VerificationOutcome, } from '../data/residentOnboarding.types';
import { INITIAL_ONBOARDING_DRAFT, MOCK_DUPLICATE_ACCOUNTS, } from '../data/residentOnboarding.mockData';
const STEP_MILESTONE_MAP: Record<OnboardingStep, {
    milestone: OnboardingMilestone;
    stepIndex: number;
    progress: number;
}> = {
    VERIFY_MOBILE: { milestone: 'Verify', stepIndex: 1, progress: 10 },
    FIND_SOCIETY: { milestone: 'Your home', stepIndex: 2, progress: 25 },
    CONFIRM_SOCIETY: { milestone: 'Your home', stepIndex: 2, progress: 35 },
    FIND_UNIT: { milestone: 'Your home', stepIndex: 2, progress: 45 },
    CONFIRM_UNIT: { milestone: 'Your home', stepIndex: 2, progress: 50 },
    RESIDENT_TYPE: { milestone: 'About you', stepIndex: 3, progress: 60 },
    ROLE_SPECIFIC: { milestone: 'About you', stepIndex: 3, progress: 65 },
    ABOUT_YOU: { milestone: 'About you', stepIndex: 3, progress: 75 },
    DOCUMENTS: { milestone: 'Documents', stepIndex: 4, progress: 85 },
    REVIEW: { milestone: 'Review', stepIndex: 4, progress: 90 },
    VERIFICATION_PROGRESS: { milestone: 'Ready', stepIndex: 5, progress: 95 },
    VERIFICATION_RESULT: { milestone: 'Ready', stepIndex: 5, progress: 98 },
    SUBMITTING: { milestone: 'Ready', stepIndex: 5, progress: 92 },
    ADMIN_REVIEW: { milestone: 'Decision', stepIndex: 5, progress: 95 },
    RESUBMIT: { milestone: 'Documents', stepIndex: 4, progress: 80 },
    REJECTED: { milestone: 'Decision', stepIndex: 5, progress: 0 },
    APPROVED: { milestone: 'Active', stepIndex: 5, progress: 98 },
    ACTIVE: { milestone: 'Active', stepIndex: 5, progress: 100 },
    COMPLETED: { milestone: 'Ready', stepIndex: 5, progress: 100 },
    PERMISSIONS: { milestone: 'Ready', stepIndex: 5, progress: 99 },
    WELCOME_HOME: { milestone: 'Ready', stepIndex: 5, progress: 100 },
};
let globalPersistedDraft: ResidentOnboardingDraft | null = null;
export function resetGlobalDraft() {
    globalPersistedDraft = null;
}
export function useResidentOnboardingDraft() {
    const [draft, setDraft] = useState<ResidentOnboardingDraft>(globalPersistedDraft ?? INITIAL_ONBOARDING_DRAFT);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasDuplicateAccount, setHasDuplicateAccount] = useState(false);
    const [duplicateAccountInfo, setDuplicateAccountInfo] = useState<typeof MOCK_DUPLICATE_ACCOUNTS[0] | null>(null);
    const saveDraft = useCallback((updated: ResidentOnboardingDraft) => {
        const progress = STEP_MILESTONE_MAP[updated.step]?.progress ?? 10;
        const finalDraft = {
            ...updated,
            progressPercent: progress,
            lastSavedAt: new Date().toISOString(),
        };
        globalPersistedDraft = finalDraft;
        setDraft(finalDraft);
    }, []);
    const milestoneInfo = useMemo(() => {
        return STEP_MILESTONE_MAP[draft.step] ?? { milestone: 'Verify', stepIndex: 1, progress: 10 };
    }, [draft.step]);
    const verifyMobileOtp = useCallback(async (otp: string): Promise<{
        success: boolean;
        error?: string;
    }> => {
        if (otp === '123456') {
            const duplicate = MOCK_DUPLICATE_ACCOUNTS.find((acc) => acc.mobileNumber === draft.mobileNumber);
            if (duplicate) {
                setHasDuplicateAccount(true);
                setDuplicateAccountInfo(duplicate);
                return { success: false, error: 'Duplicate account detected' };
            }
            saveDraft({
                ...draft,
                isMobileVerified: true,
                step: draft.selectedSociety ? 'FIND_UNIT' : 'FIND_SOCIETY',
            });
            return { success: true };
        }
        return {
            success: false,
            error: 'Incorrect code. Please check the code and try again.',
        };
    }, [draft, saveDraft]);
    const selectSociety = useCallback((society: OnboardingSociety) => {
        saveDraft({
            ...draft,
            selectedSociety: society,
            step: 'CONFIRM_SOCIETY',
        });
    }, [draft, saveDraft]);
    const confirmSociety = useCallback(() => {
        saveDraft({
            ...draft,
            step: 'FIND_UNIT',
        });
    }, [draft, saveDraft]);
    const selectUnit = useCallback((unit: OnboardingUnit) => {
        saveDraft({
            ...draft,
            selectedUnit: unit,
            step: 'CONFIRM_UNIT',
        });
    }, [draft, saveDraft]);
    const confirmUnit = useCallback(() => {
        saveDraft({
            ...draft,
            step: 'RESIDENT_TYPE',
        });
    }, [draft, saveDraft]);
    const selectResidentRole = useCallback((role: ResidentRole) => {
        const updatedDocs = draft.documents.map((doc) => {
            if (doc.type === 'rental_agreement') {
                return { ...doc, isRequired: role === 'TENANT' };
            }
            return doc;
        });
        if (role === 'OWNER') {
            saveDraft({
                ...draft,
                residentRole: role,
                documents: updatedDocs,
                step: 'ABOUT_YOU',
            });
        }
        else {
            saveDraft({
                ...draft,
                residentRole: role,
                documents: updatedDocs,
                step: 'ROLE_SPECIFIC',
            });
        }
    }, [draft, saveDraft]);
    const submitRoleSpecific = useCallback((details: {
        tenantDetails?: {
            agreementStart: string;
            agreementEnd: string;
            requiresOwnerVerification: boolean;
            ownerName?: string;
        };
        familyDetails?: {
            relationship: FamilyRelation;
            primaryResidentName?: string;
        };
    }) => {
        const nextDraft: ResidentOnboardingDraft = {
            ...draft,
            step: 'ABOUT_YOU',
        };
        if (details.tenantDetails !== undefined) {
            nextDraft.tenantDetails = details.tenantDetails;
        }
        if (details.familyDetails !== undefined) {
            nextDraft.familyDetails = details.familyDetails;
        }
        saveDraft(nextDraft);
    }, [draft, saveDraft]);
    const updateProfile = useCallback((profileData: Partial<ResidentOnboardingDraft['profile']>) => {
        const updatedProfile = { ...draft.profile, ...profileData };
        saveDraft({
            ...draft,
            profile: updatedProfile,
            step: 'DOCUMENTS',
        });
    }, [draft, saveDraft]);
    const uploadDocument = useCallback((docId: string, file: {
        fileName: string;
        fileSize: number;
        fileUri: string;
    }) => {
        const updatedDocs = draft.documents.map((doc) => {
            if (doc.id === docId) {
                return {
                    ...doc,
                    status: 'UPLOADED' as const,
                    fileName: file.fileName,
                    fileSize: file.fileSize,
                    fileUri: file.fileUri,
                };
            }
            return doc;
        });
        saveDraft({
            ...draft,
            documents: updatedDocs,
        });
    }, [draft, saveDraft]);
    const removeDocument = useCallback((docId: string) => {
        const updatedDocs = draft.documents.map((doc) => {
            if (doc.id === docId) {
                const reset = {
                    ...doc,
                    status: 'NOT_UPLOADED' as const,
                };
                delete reset.fileName;
                delete reset.fileSize;
                delete reset.fileUri;
                return reset;
            }
            return doc;
        });
        saveDraft({
            ...draft,
            documents: updatedDocs,
        });
    }, [draft, saveDraft]);
    const proceedToReview = useCallback(() => {
        saveDraft({
            ...draft,
            step: 'REVIEW',
        });
    }, [draft, saveDraft]);
    const submitForVerification = useCallback(async () => {
        setIsSubmitting(true);
        saveDraft({
            ...draft,
            step: 'VERIFICATION_PROGRESS',
        });
        const delay = process.env.NODE_ENV === 'test' ? 50 : 1800;
        setTimeout(() => {
            setIsSubmitting(false);
            saveDraft({
                ...draft,
                step: 'VERIFICATION_RESULT',
                verificationOutcome: draft.residentRole === 'TENANT' ? 'PENDING' : 'APPROVED',
            });
        }, delay);
    }, [draft, saveDraft]);
    const setVerificationOutcome = useCallback((outcome: VerificationOutcome) => {
        saveDraft({
            ...draft,
            verificationOutcome: outcome,
        });
    }, [draft, saveDraft]);
    const proceedToPermissions = useCallback(() => {
        saveDraft({
            ...draft,
            step: 'PERMISSIONS',
        });
    }, [draft, saveDraft]);
    const grantNotificationPermission = useCallback((granted: boolean) => {
        saveDraft({
            ...draft,
            notificationPermissionGranted: granted,
            step: 'WELCOME_HOME',
        });
    }, [draft, saveDraft]);
    const goToStep = useCallback((step: OnboardingStep) => {
        saveDraft({
            ...draft,
            step,
        });
    }, [draft, saveDraft]);
    const resetDraft = useCallback(() => {
        globalPersistedDraft = null;
        setDraft(INITIAL_ONBOARDING_DRAFT);
        setHasDuplicateAccount(false);
        setDuplicateAccountInfo(null);
    }, []);
    const dismissDuplicateModal = useCallback(() => {
        setHasDuplicateAccount(false);
    }, []);
    return {
        draft,
        milestoneInfo,
        isSubmitting,
        hasDuplicateAccount,
        duplicateAccountInfo,
        dismissDuplicateModal,
        verifyMobileOtp,
        selectSociety,
        confirmSociety,
        selectUnit,
        confirmUnit,
        selectResidentRole,
        submitRoleSpecific,
        updateProfile,
        uploadDocument,
        removeDocument,
        proceedToReview,
        submitForVerification,
        setVerificationOutcome,
        proceedToPermissions,
        grantNotificationPermission,
        goToStep,
        resetDraft,
    };
}

