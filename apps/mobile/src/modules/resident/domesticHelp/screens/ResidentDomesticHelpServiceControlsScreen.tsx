import React from "react";
import { View } from "react-native";
import type { DomesticHelpServiceControlsScreenProps } from "../../../../app/navigation/navigation.types";
import { formatResidentDateTime } from "../../../../core/localization/dateTimeFormatters";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusPill } from "../../../../shared/components/StatusPill";
import { SurfaceCard } from "../../../../shared/components/SurfaceCard";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { AppScreen } from "../../../../shared/layouts/AppScreen";
import { useMessages } from "../../../../shared/constants/useMessages";
import { AppAlert } from "../../../../ui/modal/AppAlert";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import type { DomesticHelpServiceAction, ResidentDomesticHelpProfile } from "../data/domesticHelp.types";
import { useResidentDomesticHelpDetail, useResidentDomesticHelpServiceAction } from "../data/useResidentDomesticHelp";
import { styles } from "../styles/screens/ResidentDomesticHelpServiceControlsScreen.styles";
export function ResidentDomesticHelpServiceControlsScreen({ route }: DomesticHelpServiceControlsScreenProps) {
    const messages = useMessages().resident.domesticHelp;
    const detail = useResidentDomesticHelpDetail(route.params.domesticHelpId);
    const mutation = useResidentDomesticHelpServiceAction(route.params.domesticHelpId);
    const [updatedProfile, setUpdatedProfile] = React.useState<ResidentDomesticHelpProfile>();
    const [pendingAction, setPendingAction] = React.useState<DomesticHelpServiceAction['type']>();
    const profile = updatedProfile ?? detail.data;
    async function apply(action: DomesticHelpServiceAction, successMessage: string) {
        setPendingAction(action.type);
        try {
            const result = await mutation.submit(action);
            if (result.ok && result.data) {
                setUpdatedProfile(result.data);
                AppAlert.alert(messages.serviceControlsTitle, successMessage);
                return;
            }
            AppAlert.alert(messages.serviceControlsTitle, result.ok ? messages.mutationError : result.error.message);
        }
        finally {
            setPendingAction(undefined);
        }
    }
    function grantTemporaryAccess() {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        void apply({ type: 'grantTemporaryAccess', expiresAt }, messages.temporaryAccessSuccess);
    }
    function confirmRemoval() {
        AppAlert.alert(messages.removeTitle, messages.removeConfirmation, [
            { text: messages.keepLinked, style: 'cancel' },
            { text: messages.removeAction, style: 'destructive', onPress: () => void apply({ type: 'remove' }, messages.removeSuccess) },
        ]);
    }
    const statusLabel = profile ? messages.serviceStatus[profile.serviceStatus] : '';
    const passLabel = profile ? messages.passStatus[profile.passStatus] : '';
    const isRemoved = profile?.serviceStatus === 'removed';
    return (<View style={styles.root}>
      <ResidentPageHeader title={messages.serviceControlsTitle} subtitle={messages.serviceControlsSubtitle}/>
      <AppScreen scroll edges={['bottom']} contentStyle={styles.content} testID="resident-domestic-help-service-controls">
        {detail.isLoading ? <LoadingState message={messages.loading} showCardPlaceholder/> : null}
        {detail.error ? <ErrorState message={detail.error.message} onRetry={detail.refetch} retryLabel={messages.retry}/> : null}
        {profile ? (<>
            <SurfaceCard title={profile.name} subtitle={profile.service} icon="people">
              <View style={styles.statusRow}>
                <StatusPill label={statusLabel} tone={isRemoved ? 'danger' : profile.serviceStatus === 'active' ? 'success' : 'warning'}/>
                <StatusPill label={passLabel} tone={profile.passStatus === 'valid' ? 'success' : profile.passStatus === 'expired' ? 'danger' : 'warning'}/>
              </View>
              <SafeText variant="caption" color="secondary">
                {messages.passExpiryLabel}: {formatResidentDateTime(profile.passExpiresAt)}
              </SafeText>
              {profile.temporaryAccessExpiresAt ? (<SafeText variant="caption" color="secondary">
                  {messages.temporaryAccessUntil}: {formatResidentDateTime(profile.temporaryAccessExpiresAt)}
                </SafeText>) : null}
            </SurfaceCard>

            <SurfaceCard title={messages.availabilityTitle} subtitle={messages.availabilityDescription} icon="calendar">
              <AppButton title={profile.serviceStatus === 'onLeave' ? messages.endLeave : messages.startLeave} onPress={() => void apply({ type: profile.serviceStatus === 'onLeave' ? 'endLeave' : 'startLeave' }, profile.serviceStatus === 'onLeave' ? messages.endLeaveSuccess : messages.startLeaveSuccess)} variant="secondary" disabled={mutation.isSubmitting || isRemoved} loading={pendingAction === 'startLeave' || pendingAction === 'endLeave'} fullWidth/>
              <AppButton title={profile.replacementRequestId ? messages.replacementRequested : messages.requestReplacement} onPress={() => void apply({ type: 'requestReplacement' }, messages.replacementSuccess)} variant="outline" disabled={mutation.isSubmitting || isRemoved || Boolean(profile.replacementRequestId)} loading={pendingAction === 'requestReplacement'} fullWidth/>
              <AppButton title={messages.grantTemporaryAccess} onPress={grantTemporaryAccess} variant="outline" disabled={mutation.isSubmitting || isRemoved} loading={pendingAction === 'grantTemporaryAccess'} fullWidth/>
            </SurfaceCard>

            <SurfaceCard title={messages.notificationsTitle} subtitle={messages.notificationsDescription} icon="notifications">
              <AppButton title={profile.entryExitNotificationsEnabled ? messages.disableNotifications : messages.enableNotifications} onPress={() => void apply({ type: 'setEntryExitNotifications', enabled: !profile.entryExitNotificationsEnabled }, messages.notificationsSuccess)} variant="outline" disabled={mutation.isSubmitting || isRemoved} loading={pendingAction === 'setEntryExitNotifications'} fullWidth/>
            </SurfaceCard>

            <SurfaceCard title={messages.feedbackTitle} subtitle={messages.feedbackDescription} icon="star">
              <AppButton title={profile.lastFeedbackRating ? messages.feedbackSubmitted : messages.submitFeedback} onPress={() => void apply({ type: 'submitFeedback', rating: 5 }, messages.feedbackSuccess)} variant="outline" disabled={mutation.isSubmitting || isRemoved || Boolean(profile.lastFeedbackRating)} loading={pendingAction === 'submitFeedback'} fullWidth/>
            </SurfaceCard>

            <AppButton title={messages.removeAction} onPress={confirmRemoval} variant="danger" disabled={mutation.isSubmitting || isRemoved} loading={pendingAction === 'remove'} fullWidth testID="domestic-help-remove"/>
          </>) : null}
      </AppScreen>
    </View>);
}

