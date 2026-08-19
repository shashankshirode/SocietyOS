import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { residenceNavigationGuard } from '../services/ResidenceNavigationGuardService';
import { residenceAccessMessages } from '../../../messages/en/residenceAccess.messages';
import type { ResidenceAccessAction, ResidenceAccessDetail, ResidenceAccessListItem, ResidenceAccessRepositoryError, ResidenceNavigationDestination, } from '../models/residenceAccess.types';
import { useResidenceAccessExperience } from '../hooks/useResidenceAccessExperience';
import { ResidenceAccessListScreen } from './ResidenceAccessListScreen';
import { ResidenceDocumentRequirementsScreen } from './ResidenceDocumentRequirementsScreen';
import { ResidenceSubmissionReviewScreen } from './ResidenceSubmissionReviewScreen';
import { ResidenceApprovalProgressScreen } from './ResidenceApprovalProgressScreen';
import { ResidenceOwnerConsentScreen } from './ResidenceOwnerConsentScreen';
import { ResidenceDecisionScreen } from './ResidenceDecisionScreen';
import { ResidenceSuspensionResolutionScreen } from './ResidenceSuspensionResolutionScreen';
import { ResidenceAccessRenewalScreen } from './ResidenceAccessRenewalScreen';
import { ResidenceAccessOverviewScreen } from './ResidenceAccessOverviewScreen';
import { ResidenceLinkHomeScreen } from './ResidenceLinkHomeScreen';
import { ResidenceAccessStatusSheet } from '../components/ResidenceAccessStatusSheet';
import { ReminderSocietySheet } from '../components/ReminderSocietySheet';
import { ContactSocietySheet } from '../components/ContactSocietySheet';
import { WithdrawResidenceRequestSheet } from '../components/WithdrawResidenceRequestSheet';
type ExperienceScreen = 'LIST' | 'LINK_HOME' | 'REVIEW_INITIAL' | 'REVIEW_CORRECTION' | ResidenceNavigationDestination;
type DocumentReturnScreen = 'REVIEW_INITIAL' | 'REVIEW_CORRECTION' | 'OWNER_CONSENT' | 'APPROVAL_PROGRESS' | 'SUSPENSION_RESOLUTION' | 'ACCESS_RENEWAL';
type DocumentBackScreen = 'LIST' | 'CORRECTION_REQUIRED' | 'REJECTION_DECISION' | 'OWNER_CONSENT' | 'APPROVAL_PROGRESS' | 'SUSPENSION_RESOLUTION' | 'ACCESS_RENEWAL';
interface ResidenceAccessExperienceScreenProps {
    readonly userId: string;
    readonly residentName: string;
    readonly mobileNumber: string;
    readonly onEnterResidence: (detail: ResidenceAccessDetail) => Promise<boolean>;
    readonly onSignOut: () => Promise<void>;
}
export function ResidenceAccessExperienceScreen({ userId, residentName, mobileNumber, onEnterResidence, onSignOut, }: ResidenceAccessExperienceScreenProps) {
    const experience = useResidenceAccessExperience(userId);
    const [screen, setScreen] = useState<ExperienceScreen>('LIST');
    const [documentReturnScreen, setDocumentReturnScreen] = useState<DocumentReturnScreen>('REVIEW_INITIAL');
    const [documentBackScreen, setDocumentBackScreen] = useState<DocumentBackScreen>('LIST');
    const [statusVisible, setStatusVisible] = useState(false);
    const [reminderVisible, setReminderVisible] = useState(false);
    const [contactVisible, setContactVisible] = useState(false);
    const [withdrawVisible, setWithdrawVisible] = useState(false);
    const [entryError, setEntryError] = useState<ResidenceAccessRepositoryError | null>(null);
    const detail = experience.selectedDetail;
    useEffect(() => {
        if (!detail) {
            return;
        }
        const guardedScreens: readonly ExperienceScreen[] = [
            'OWNER_CONSENT',
            'APPROVAL_PROGRESS',
            'CORRECTION_REQUIRED',
            'REJECTION_DECISION',
            'SUSPENSION_RESOLUTION',
            'ACCESS_RENEWAL',
            'REACTIVATION_STATUS',
            'RESIDENCE_ACCESS_OVERVIEW',
        ];
        if (!guardedScreens.includes(screen)) {
            return;
        }
        const resolved = residenceNavigationGuard.resolveDestination(detail.accessRecord, detail.eligibility);
        const latestScreen: ExperienceScreen = resolved === 'RESIDENT_DASHBOARD'
            ? 'RESIDENCE_ACCESS_OVERVIEW'
            : resolved;
        if (latestScreen !== screen) {
            setStatusVisible(false);
            setReminderVisible(false);
            setWithdrawVisible(false);
            setScreen(latestScreen);
        }
    }, [detail, screen]);
    const goToList = () => {
        setStatusVisible(false);
        setReminderVisible(false);
        setContactVisible(false);
        setWithdrawVisible(false);
        setEntryError(null);
        setScreen('LIST');
        experience.closeResidence();
    };
    const enterResidence = async (currentDetail: ResidenceAccessDetail) => {
        const destination = residenceNavigationGuard.resolveDestination(currentDetail.accessRecord, currentDetail.eligibility);
        if (destination !== 'RESIDENT_DASHBOARD') {
            setScreen(destination);
            return;
        }
        const activated = await experience.activateResidence(currentDetail.accessRecord.residenceAccessId);
        if (!activated) {
            return;
        }
        const latest = await experience.selectResidence(currentDetail.accessRecord.residenceAccessId);
        if (!latest || !latest.eligibility.canEnterResidence) {
            setScreen(latest
                ? residenceNavigationGuard.resolveDestination(latest.accessRecord, latest.eligibility)
                : 'LIST');
            return;
        }
        const entered = await onEnterResidence(latest);
        if (!entered) {
            setEntryError({
                code: 'SERVER_ERROR',
                message: `${residenceAccessMessages.account.sessionErrorTitle}. ${residenceAccessMessages.account.sessionErrorBody}`,
                retryable: true,
            });
            setScreen('LIST');
        }
    };
    const openGuardedDestination = async (currentDetail: ResidenceAccessDetail) => {
        const destination = residenceNavigationGuard.resolveDestination(currentDetail.accessRecord, currentDetail.eligibility);
        if (destination === 'RESIDENT_DASHBOARD') {
            await enterResidence(currentDetail);
        }
        else {
            setScreen(destination);
        }
    };
    const selectAndOpen = async (item: ResidenceAccessListItem, showStatus: boolean) => {
        const selected = await experience.selectResidence(item.accessRecord.residenceAccessId);
        if (!selected)
            return;
        if (showStatus) {
            setStatusVisible(true);
        }
        else {
            await openGuardedDestination(selected);
        }
    };
    const routeAction = async (currentDetail: ResidenceAccessDetail, action: ResidenceAccessAction) => {
        if (!action.enabled)
            return;
        switch (action.type) {
            case 'ENTER_RESIDENCE':
                await enterResidence(currentDetail);
                return;
            case 'VIEW_STATUS':
                setStatusVisible(true);
                return;
            case 'SEND_REMINDER':
                setReminderVisible(true);
                return;
            case 'CONTACT_SOCIETY':
                setContactVisible(true);
                return;
            case 'WITHDRAW_REQUEST':
                setWithdrawVisible(true);
                return;
            case 'LINK_ANOTHER_HOME':
                setScreen('LINK_HOME');
                return;
            case 'SIGN_OUT':
                await onSignOut();
                return;
            case 'UPLOAD_DOCUMENTS':
            case 'VIEW_REQUIREMENTS':
                setDocumentReturnScreen(currentDetail.accessRecord.status === 'DOCUMENT_CHANGES_REQUIRED' ? 'REVIEW_CORRECTION' : 'REVIEW_INITIAL');
                setDocumentBackScreen('LIST');
                setScreen('DOCUMENT_REQUIREMENTS');
                return;
            case 'CORRECT_AND_RESUBMIT':
                setScreen('CORRECTION_REQUIRED');
                return;
            case 'VIEW_DECISION':
            case 'REQUEST_RECONSIDERATION':
                setScreen('REJECTION_DECISION');
                return;
            case 'REQUEST_OWNER_CONSENT':
            case 'RESEND_OWNER_CONSENT':
            case 'UPLOAD_OWNER_CONSENT':
                setScreen('OWNER_CONSENT');
                return;
            case 'RENEW_ACCESS':
            case 'REQUEST_REACTIVATION':
                setScreen('ACCESS_RENEWAL');
                return;
            case 'RESOLVE_SUSPENSION':
            case 'SUBMIT_CLARIFICATION':
                setScreen('SUSPENSION_RESOLUTION');
                return;
            case 'VIEW_HISTORY':
            case 'VIEW_PREVIOUS_OCCUPANCY':
            case 'REMOVE_FROM_QUICK_ACCESS':
            case 'START_CLAIM':
            case 'COMPLETE_IDENTITY':
            case 'VIEW_SUBMITTED_INFORMATION':
            case 'VIEW_DOCUMENTS':
            case 'SUBMIT_FOR_REVIEW':
            case 'SWITCH_RESIDENCE':
                await openGuardedDestination(currentDetail);
                return;
        }
    };
    const handleListAction = async (item: ResidenceAccessListItem, action: ResidenceAccessAction) => {
        const selected = await experience.selectResidence(item.accessRecord.residenceAccessId);
        if (selected) {
            await routeAction(selected, action);
        }
    };
    const continueAfterDocuments = () => {
        if (documentReturnScreen === 'OWNER_CONSENT') {
            void experience.requestOwnerConsent('WRITTEN_CONSENT').then((requested) => {
                if (requested)
                    setScreen('OWNER_CONSENT');
            });
            return;
        }
        setScreen(documentReturnScreen);
    };
    const withOverlays = (content: React.ReactNode) => (<>
      {content}
      {detail ? (<ResidenceAccessStatusSheet visible={statusVisible} residence={detail.residence} accessRecord={detail.accessRecord} eligibility={detail.eligibility} timeline={detail.timeline} primaryAction={detail.primaryAction} secondaryActions={detail.secondaryActions} onAction={(action) => { setStatusVisible(false); void routeAction(detail, action); }} onDismiss={() => setStatusVisible(false)}/>) : null}
      <ReminderSocietySheet visible={reminderVisible} detail={detail} loading={experience.activeMutation === 'SEND_REMINDER'} onSend={experience.sendReminder} onDismiss={() => setReminderVisible(false)}/>
      <ContactSocietySheet visible={contactVisible} residence={detail?.residence ?? null} onDismiss={() => setContactVisible(false)}/>
      <WithdrawResidenceRequestSheet visible={withdrawVisible} detail={detail} loading={experience.activeMutation === 'WITHDRAW_REQUEST'} onConfirm={async () => {
            const withdrawn = await experience.withdrawRequest();
            if (withdrawn)
                goToList();
            return withdrawn;
        }} onDismiss={() => setWithdrawVisible(false)}/>
    </>);
    if (screen === 'LINK_HOME') {
        return withOverlays(<ResidenceLinkHomeScreen activeMutation={experience.activeMutation} error={experience.actionError} onBack={goToList} onSubmit={experience.linkResidence} onLinked={() => { setScreen('RESIDENCE_ACCESS_OVERVIEW'); }} onDismissError={experience.clearActionError}/>);
    }
    if (detail && screen === 'DOCUMENT_REQUIREMENTS') {
        return withOverlays(<ResidenceDocumentRequirementsScreen detail={detail} activeMutation={experience.activeMutation} uploadProgress={experience.uploadProgress} recoveredUploads={experience.recoveredUploads} error={experience.actionError} onBack={() => setScreen(documentBackScreen)} onUpload={experience.uploadDocument} onCancelUpload={experience.cancelDocumentUpload} onRemove={experience.removeDocument} onContinue={continueAfterDocuments} onDismissError={experience.clearActionError}/>);
    }
    if (detail && (screen === 'REVIEW_INITIAL' || screen === 'REVIEW_CORRECTION')) {
        return withOverlays(<ResidenceSubmissionReviewScreen detail={detail} residentName={residentName} mobileNumber={mobileNumber} mode={screen === 'REVIEW_CORRECTION' ? 'CORRECTION' : 'INITIAL'} activeMutation={experience.activeMutation} error={experience.actionError} onBack={() => setScreen('DOCUMENT_REQUIREMENTS')} onSubmitInitial={experience.submitForReview} onSubmitCorrection={experience.resubmitCorrection} onSubmitted={() => setScreen('APPROVAL_PROGRESS')} onDismissError={experience.clearActionError}/>);
    }
    if (detail && screen === 'APPROVAL_PROGRESS') {
        return withOverlays(<ResidenceApprovalProgressScreen detail={detail} error={experience.actionError} onBack={goToList} onRefresh={() => { void experience.refreshSelected(); }} onReminder={() => setReminderVisible(true)} onContact={() => setContactVisible(true)} onWithdraw={() => setWithdrawVisible(true)} onViewDocuments={() => {
                setDocumentReturnScreen('APPROVAL_PROGRESS');
                setDocumentBackScreen('APPROVAL_PROGRESS');
                setScreen('DOCUMENT_REQUIREMENTS');
            }} onSwitchResidence={goToList} onSignOut={() => { void onSignOut(); }} onDismissError={experience.clearActionError}/>);
    }
    if (detail && screen === 'OWNER_CONSENT') {
        return withOverlays(<ResidenceOwnerConsentScreen detail={detail} activeMutation={experience.activeMutation} error={experience.actionError} onBack={goToList} onRequestConsent={() => experience.requestOwnerConsent('SECURE_LINK')} onUploadWrittenConsent={() => {
                setDocumentReturnScreen('OWNER_CONSENT');
                setDocumentBackScreen('OWNER_CONSENT');
                setScreen('DOCUMENT_REQUIREMENTS');
            }} onContact={() => setContactVisible(true)} onCancel={() => setWithdrawVisible(true)} onRefresh={() => { void experience.refreshSelected(); }} onDismissError={experience.clearActionError}/>);
    }
    if (detail && (screen === 'CORRECTION_REQUIRED' || screen === 'REJECTION_DECISION')) {
        const currentDecisionScreen = screen;
        return withOverlays(<ResidenceDecisionScreen detail={detail} activeMutation={experience.activeMutation} error={experience.actionError} onBack={goToList} onCorrect={() => {
                setDocumentReturnScreen('REVIEW_CORRECTION');
                setDocumentBackScreen(currentDecisionScreen);
                setScreen('DOCUMENT_REQUIREMENTS');
            }} onReviewCorrection={() => setScreen('REVIEW_CORRECTION')} onSubmitAppeal={experience.submitAppeal} onContact={() => setContactVisible(true)} onRefresh={() => { void experience.refreshSelected(); }} onDismissError={experience.clearActionError}/>);
    }
    if (detail && screen === 'SUSPENSION_RESOLUTION') {
        return withOverlays(<ResidenceSuspensionResolutionScreen detail={detail} activeMutation={experience.activeMutation} error={experience.actionError} onBack={goToList} onUploadClarification={() => {
                setDocumentReturnScreen('SUSPENSION_RESOLUTION');
                setDocumentBackScreen('SUSPENSION_RESOLUTION');
                setScreen('DOCUMENT_REQUIREMENTS');
            }} onSubmit={experience.submitSuspensionResolution} onContact={() => setContactVisible(true)} onSwitchResidence={goToList} onRefresh={() => { void experience.refreshSelected(); }} onDismissError={experience.clearActionError}/>);
    }
    if (detail && (screen === 'ACCESS_RENEWAL' || screen === 'REACTIVATION_STATUS')) {
        return withOverlays(<ResidenceAccessRenewalScreen detail={detail} activeMutation={experience.activeMutation} error={experience.actionError} onBack={goToList} onUploadRenewal={() => {
                setDocumentReturnScreen('ACCESS_RENEWAL');
                setDocumentBackScreen('ACCESS_RENEWAL');
                setScreen('DOCUMENT_REQUIREMENTS');
            }} onSubmit={experience.requestReactivation} onPreviousOccupancy={() => setScreen('RESIDENCE_ACCESS_OVERVIEW')} onContact={() => setContactVisible(true)} onRefresh={() => { void experience.refreshSelected(); }} onDismissError={experience.clearActionError}/>);
    }
    if (detail && screen === 'RESIDENCE_ACCESS_OVERVIEW') {
        return withOverlays(<ResidenceAccessOverviewScreen detail={detail} error={experience.actionError} onBack={goToList} onShowStatus={() => setStatusVisible(true)} onEnter={() => { void enterResidence(detail); }} onReactivate={() => setScreen('ACCESS_RENEWAL')} onContact={() => setContactVisible(true)} onRefresh={() => { void experience.refreshSelected(); }} onDismissError={experience.clearActionError}/>);
    }
    return withOverlays(<ResidenceAccessListScreen items={experience.items} totalCount={experience.totalCount} isLoading={experience.isLoading} isRefreshing={experience.isRefreshing} isLoadingMore={experience.isLoadingMore} hasMore={experience.hasMore} error={entryError ?? experience.listError} searchText={experience.searchText} statusFilter={experience.statusFilter} roleFilter={experience.roleFilter} onSearchTextChange={experience.setSearchText} onStatusFilterChange={experience.setStatusFilter} onRoleFilterChange={experience.setRoleFilter} onRefresh={() => { setEntryError(null); void experience.refresh(); }} onLoadMore={() => { void experience.loadMore(); }} onAction={(item, action) => { void handleListAction(item, action); }} onOpenStatus={(item) => { void selectAndOpen(item, true); }} onLinkHome={() => setScreen('LINK_HOME')} onSignOut={() => { void onSignOut(); }} onContactSupport={() => { void Linking.openURL('mailto:support@societyos.in'); }}/>);
}

