import React from "react";
import { FlatList, Text, View } from "react-native";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { AppCard } from "../../../../shared/cards/AppCard";
import { FilterChips } from "../../../../shared/lists/FilterChips";
import { FormField } from "../../../../shared/forms/FormField";
import { StatusBadge, getParkingBadgeType } from "../../../../shared/components/StatusBadge";
import { useParkingIncidents } from "../data/useParkingIncidents";
import { DetailRow, labelize, ParkingScreen } from "../components/ParkingUi";
import type { ParkingIncidentListScreenProps } from "../../../../app/navigation/navigation.types";
import type { ParkingIncident } from "../../../../shared/types/parking.types";
import { formatResidentDateTime } from "../../../../core/localization/dateTimeFormatters";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/ParkingIncidentListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type IncidentFilter = 'OPEN' | 'SECURITY_NOTIFIED' | 'OWNER_NOTIFIED' | 'RESOLVED' | 'ESCALATED' | 'ALL';
const FILTERS = [
    { key: 'OPEN', get label() {
            return getActiveUiLiteral("m_ed077f3d8125");
        } },
    { key: 'SECURITY_NOTIFIED', get label() {
            return getActiveUiLiteral("m_55d8f1f3b492");
        } },
    { key: 'OWNER_NOTIFIED', get label() {
            return getActiveUiLiteral("m_7f1da34fb8d8");
        } },
    { key: 'RESOLVED', get label() {
            return getActiveUiLiteral("m_5be3c2c8354e");
        } },
    { key: 'ESCALATED', get label() {
            return getActiveUiLiteral("m_b710aaaaa7ba");
        } },
    { key: 'ALL', get label() {
            return getActiveUiLiteral("m_a52ace420f21");
        } },
] satisfies {
    key: IncidentFilter;
    label: string;
}[];
export function ParkingIncidentListScreen({ navigation, route }: ParkingIncidentListScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [filter, setFilter] = React.useState<IncidentFilter>('OPEN');
    const [query, setQuery] = React.useState('');
    const status = filter === 'OPEN' ? undefined : filter;
    const { data = [], isLoading, error, refetch } = useParkingIncidents({ unitId: route.params.unitId, ...includeWhenPresent("status", status), query });
    const incidents = filter === 'OPEN'
        ? data.filter((incident) => !['RESOLVED', 'REJECTED', 'CLOSED'].includes(incident.status))
        : data;
    if (isLoading) {
        return <LoadingState message={localizedUiText.m_5a5d3d052d1f} showCardPlaceholder/>;
    }
    if (error) {
        return <ErrorState message={error.message} onRetry={refetch}/>;
    }
    return (<ParkingScreen title={localizedUiText.m_20f7c82d50c1} subtitle={localizedUiText.m_1f655d56af9d} onBack={navigation.goBack}>
      <FormField label={localizedUiText.m_49c266baaaa7} value={query} onChangeText={setQuery} placeholder={localizedUiText.m_12af9e495e91}/>
      <FilterChips options={FILTERS} selectedKey={filter} onSelect={setFilter}/>
      <FlatList data={incidents} keyExtractor={(item) => item.id} scrollEnabled={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_f1dce2c1fc8c} description={localizedUiText.m_e69a449abbd0} iconName="clipboard-outline"/>} renderItem={({ item }) => (<IncidentCard incident={item} onPress={() => navigation.navigate('ParkingIncidentDetail', { incidentId: item.id })}/>)} extraData={localizedUiText}/>
    </ParkingScreen>);
}
function IncidentCard({ incident, onPress }: {
    incident: ParkingIncident;
    onPress: () => void;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{incident.incidentNumber}</Text>
          <Text style={styles.meta}>{labelize(incident.issueType)} · {incident.location}</Text>
        </View>
        <StatusBadge label={labelize(incident.status)} type={getParkingBadgeType(incident.status)}/>
      </View>
      <DetailRow label={localizedUiText.m_a62394ba4acc} value={incident.vehicleNumber ?? getActiveUiLiteral("m_665bac6a5ec3")}/>
      <DetailRow label={localizedUiText.m_d60dbba07922} value={labelize(incident.priority)}/>
      <DetailRow label={localizedUiText.m_d70b9e24bca2} value={formatResidentDateTime(incident.createdAt)}/>
      <DetailRow label={localizedUiText.m_3a5ecca188c0} value={formatResidentDateTime(incident.updatedAt)}/>
      <DetailRow label={localizedUiText.m_0dacf019b533} value={incident.assignedTeam} isLast/>
    </AppCard>);
}

