import { Text } from "react-native";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { AppButton } from "../../../../shared/components/AppButton";
import { StatusBadge, getParkingBadgeType } from "../../../../shared/components/StatusBadge";
import { useEscalateParkingIncident, useParkingIncidentDetail, useReportFalseParkingResolution, useResolveParkingIncident } from "../data/useParkingIncidentDetail";
import { DetailCard, DetailRow, labelize, ParkingScreen, WarningText } from "../components/ParkingUi";
import type { ParkingIncidentDetailScreenProps } from "../../../../app/navigation/navigation.types";
import { formatResidentDateTime } from "../../../../core/localization/dateTimeFormatters";
import { styles } from "../styles/screens/ParkingIncidentDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
export function ParkingIncidentDetailScreen({ navigation, route }: ParkingIncidentDetailScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: incident, isLoading, error, refetch } = useParkingIncidentDetail(route.params.incidentId);
    const resolveMutation = useResolveParkingIncident();
    const escalateMutation = useEscalateParkingIncident();
    const falseResolutionMutation = useReportFalseParkingResolution();
    if (isLoading) {
        return <LoadingState message={localizedUiText.m_52534ea7eee1} showCardPlaceholder/>;
    }
    if (error) {
        return <ErrorState message={error.message} onRetry={refetch}/>;
    }
    if (!incident) {
        return <ErrorState message={localizedUiText.m_a5a36ae88c49} onRetry={refetch}/>;
    }
    async function resolveIncident() {
        if (!incident)
            return;
        const result = await resolveMutation.submit(incident.id);
        if (result.ok) {
            await refetch();
        }
    }
    async function escalateIncident() {
        if (!incident)
            return;
        const result = await escalateMutation.submit(incident.id);
        if (result.ok) {
            await refetch();
        }
    }
    async function reportFalseResolution() {
        if (!incident)
            return;
        const result = await falseResolutionMutation.submit(incident.id);
        if (result.ok)
            await refetch();
    }
    return (<ParkingScreen title={incident.incidentNumber} subtitle={labelize(incident.issueType)} onBack={navigation.goBack}>
      <DetailCard title={localizedUiText.m_920e413c7d41}>
        <StatusBadge label={labelize(incident.status)} type={getParkingBadgeType(incident.status)}/>
      </DetailCard>
      <DetailCard title={localizedUiText.m_4ed0c8fa6637}>
        <DetailRow label={localizedUiText.m_c170bc77f0f0} value={incident.reportedBy}/>
        <DetailRow label={localizedUiText.m_8fdbff7f0c09} value={incident.reportedFlat}/>
        <DetailRow label={localizedUiText.m_a62394ba4acc} value={incident.vehicleNumber ?? getActiveUiLiteral("m_67a926f7008e")}/>
        <DetailRow label={localizedUiText.m_15b61974b270} value={incident.location}/>
        <DetailRow label={localizedUiText.m_526e0087cc3f} value={incident.description}/>
        <DetailRow label={localizedUiText.m_d60dbba07922} value={labelize(incident.priority)}/>
        <DetailRow label={localizedUiText.m_d70b9e24bca2} value={formatResidentDateTime(incident.createdAt)}/>
        <DetailRow label={localizedUiText.m_08ee4565a256} value={incident.assignedTo ?? incident.assignedTeam}/>
        <DetailRow label={localizedUiText.m_03867aea70ac} value={incident.evidenceLabel ?? getActiveUiLiteral("m_842b8e0c0f7a")}/>
        <DetailRow label={localizedUiText.m_53a8aade0d9d} value={incident.resolutionNotes ?? getActiveUiLiteral("m_69ae060aa9d9")} isLast/>
      </DetailCard>
      <DetailCard title={localizedUiText.m_9dcff98e275f}>
        {incident.timeline.map((item) => (<Text key={item.id} style={styles.timelineItem}>
            {item.title}: {item.note} · {formatResidentDateTime(item.createdAt)}
          </Text>))}
      </DetailCard>
      <WarningText>{localizedUiText.m_2055ac8f53ca}</WarningText>
      <DetailCard title={localizedUiText.m_ff8059dc6752}>
        {!['RESOLVED', 'CLOSED'].includes(incident.status) ? (<AppButton title={localizedUiText.m_e9f199b79040} onPress={resolveIncident} loading={resolveMutation.isSubmitting} variant="secondary"/>) : null}
        {!['RESOLVED', 'CLOSED', 'ESCALATED'].includes(incident.status) ? (<AppButton title={localizedUiText.m_0803701eaabf} onPress={escalateIncident} loading={escalateMutation.isSubmitting} variant="danger"/>) : null}
        {['RESOLVED', 'CLOSED'].includes(incident.status) ? (<AppButton title={localizedUiText.m_1335b3139d15} onPress={reportFalseResolution} loading={falseResolutionMutation.isSubmitting} variant="danger"/>) : null}
      </DetailCard>
    </ParkingScreen>);
}

