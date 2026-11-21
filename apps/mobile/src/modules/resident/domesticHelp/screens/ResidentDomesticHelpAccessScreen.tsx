import React from "react";
import { View } from "react-native";
import type { DomesticHelpAccessScreenProps } from "../../../../app/navigation/navigation.types";
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
import { useResidentDomesticHelpAccess, useResidentDomesticHelpDetail } from "../data/useResidentDomesticHelp";
import { styles } from "../styles/screens/ResidentDomesticHelpAccessScreen.styles";
export function ResidentDomesticHelpAccessScreen({ route }: DomesticHelpAccessScreenProps) {
    const messages = useMessages().resident.domesticHelp;
    const detail = useResidentDomesticHelpDetail(route.params.domesticHelpId);
    const access = useResidentDomesticHelpAccess(route.params.domesticHelpId);
    const [localStatus, setLocalStatus] = React.useState(detail.data?.accessStatus);
    const currentStatus = localStatus ?? detail.data?.accessStatus;
    const updateAccess = async () => {
        const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
        const result = await access.submit(nextStatus);
        if (result.ok && result.data) {
            setLocalStatus(result.data.accessStatus);
            AppAlert.alert(messages.accessTitle, messages.mutationSuccess);
            return;
        }
        AppAlert.alert(messages.accessTitle, result.ok ? messages.mutationError : result.error.message);
    };
    return (<View style={styles.root}>
      <ResidentPageHeader title={messages.accessTitle} subtitle={messages.accessSubtitle}/>
      <AppScreen scroll edges={['bottom']} contentStyle={styles.content} testID="resident-domestic-help-access">
        {detail.isLoading ? <LoadingState message={messages.loading} showCardPlaceholder/> : null}
        {detail.error ? <ErrorState message={detail.error.message} onRetry={detail.refetch} retryLabel={messages.retry}/> : null}
        {detail.data ? (<>
            <SurfaceCard title={detail.data.name} subtitle={detail.data.service} icon="people">
              <View style={styles.statusRow}>
                <SafeText variant="body" color="secondary">{messages.manageAccess}</SafeText>
                <StatusPill label={currentStatus === 'active' ? messages.activeAccess : messages.suspendedAccess} tone={currentStatus === 'active' ? 'success' : 'warning'}/>
              </View>
              <SafeText variant="caption" color="secondary">{detail.data.approvedSchedule}</SafeText>
            </SurfaceCard>
            <AppButton title={currentStatus === 'active' ? messages.pauseAccess : messages.restoreAccess} onPress={updateAccess} variant={currentStatus === 'active' ? 'danger' : 'success'} loading={access.isSubmitting} disabled={access.isSubmitting} fullWidth testID="domestic-help-access-toggle"/>
          </>) : null}
      </AppScreen>
    </View>);
}

