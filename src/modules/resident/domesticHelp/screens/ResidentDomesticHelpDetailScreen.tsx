import { View } from "react-native";
import type { DomesticHelpDetailScreenProps } from "../../../../app/navigation/navigation.types";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusPill } from "../../../../shared/components/StatusPill";
import { SurfaceCard } from "../../../../shared/components/SurfaceCard";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { AppScreen } from "../../../../shared/layouts/AppScreen";
import { useMessages } from "../../../../shared/constants/useMessages";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { DomesticHelpProfileCard } from "../components/DomesticHelpProfileCard";
import { useResidentDomesticHelpDetail } from "../data/useResidentDomesticHelp";
import { styles } from "../styles/screens/ResidentDomesticHelpDetailScreen.styles";
export function ResidentDomesticHelpDetailScreen({ navigation, route }: DomesticHelpDetailScreenProps) {
    const messages = useMessages().resident.domesticHelp;
    const { data, isLoading, error, refetch } = useResidentDomesticHelpDetail(route.params.domesticHelpId);
    return (<View style={styles.root}>
      <ResidentPageHeader title={messages.detailTitle}/>
      <AppScreen scroll edges={['bottom']} contentStyle={styles.content} testID="resident-domestic-help-detail">
        {isLoading ? <LoadingState message={messages.loading} showCardPlaceholder/> : null}
        {error ? <ErrorState message={error.message} onRetry={refetch} retryLabel={messages.retry}/> : null}
        {!isLoading && !error && !data ? (<ErrorState message={messages.emptyDescription} onRetry={refetch} retryLabel={messages.retry}/>) : null}
        {data ? (<>
            <DomesticHelpProfileCard profile={data}/>
            <SurfaceCard title={messages.scheduleTitle} body={data.approvedSchedule} icon="calendar"/>
            <SurfaceCard>
              <View style={styles.detailRow}>
                <SafeText variant="body" color="secondary">{messages.verificationLabel}</SafeText>
                <StatusPill label={data.verificationStatus === 'verified' ? messages.verified : data.verificationStatus === 'pending' ? messages.pending : data.verificationStatus === 'pendingPoliceVerification' ? 'Police Check Pending' : data.verificationStatus === 'unverified' ? 'Unverified' : messages.rejected} tone={data.verificationStatus === 'verified' ? 'success' : data.verificationStatus === 'pending' || data.verificationStatus === 'pendingPoliceVerification' ? 'warning' : 'danger'}/>
              </View>
              <View style={styles.detailRow}>
                <SafeText variant="body" color="secondary">{messages.phoneLabel}</SafeText>
                <SafeText variant="bodyStrong">{data.maskedPhone}</SafeText>
              </View>
              <View style={styles.detailRow}>
                <SafeText variant="body" color="secondary">{messages.lastVisitLabel}</SafeText>
                <SafeText variant="bodyStrong">{data.lastVisitLabel}</SafeText>
              </View>
            </SurfaceCard>
            <AppButton title={messages.openAttendance} onPress={() => navigation.navigate('DomesticHelpAttendance', { domesticHelpId: data.id })} variant="secondary" fullWidth/>
            <AppButton title={messages.manageAccess} onPress={() => navigation.navigate('DomesticHelpAccess', { domesticHelpId: data.id })} variant="outline" fullWidth/>
            <AppButton title={messages.openServiceControls} onPress={() => navigation.navigate('DomesticHelpServiceControls', { domesticHelpId: data.id })} variant="outline" fullWidth/>
          </>) : null}
      </AppScreen>
    </View>);
}

