import { View } from "react-native";
import type { DomesticHelpAttendanceScreenProps } from "../../../../app/navigation/navigation.types";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusPill } from "../../../../shared/components/StatusPill";
import { SurfaceCard } from "../../../../shared/components/SurfaceCard";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { AppScreen } from "../../../../shared/layouts/AppScreen";
import { useMessages } from "../../../../shared/constants/useMessages";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { useResidentDomesticHelpDetail } from "../data/useResidentDomesticHelp";
import { styles } from "../styles/screens/ResidentDomesticHelpAttendanceScreen.styles";
export function ResidentDomesticHelpAttendanceScreen({ route }: DomesticHelpAttendanceScreenProps) {
    const messages = useMessages().resident.domesticHelp;
    const { data, isLoading, error, refetch } = useResidentDomesticHelpDetail(route.params.domesticHelpId);
    return (<View style={styles.root}>
      <ResidentPageHeader title={messages.attendanceTitle} subtitle={messages.attendanceSubtitle}/>
      <AppScreen scroll edges={['bottom']} contentStyle={styles.content} testID="resident-domestic-help-attendance">
        {isLoading ? <LoadingState message={messages.loading} showCardPlaceholder/> : null}
        {error ? <ErrorState message={error.message} onRetry={refetch} retryLabel={messages.retry}/> : null}
        {data ? (<>
            <SafeText variant="h3">{data.name}</SafeText>
            {data.attendance.map((record) => (<SurfaceCard key={record.id}>
                <View style={styles.row}>
                  <View style={styles.copy}>
                    <SafeText variant="bodyStrong">{record.dateLabel}</SafeText>
                    <SafeText variant="caption" color="secondary">
                      {record.status === 'present'
                    ? `${record.entryTime ?? '—'} – ${record.exitTime ?? '—'}`
                    : messages.absent}
                    </SafeText>
                  </View>
                  <StatusPill label={record.status === 'present' ? messages.present : messages.absent} tone={record.status === 'present' ? 'success' : 'neutral'}/>
                </View>
              </SurfaceCard>))}
          </>) : null}
      </AppScreen>
    </View>);
}

