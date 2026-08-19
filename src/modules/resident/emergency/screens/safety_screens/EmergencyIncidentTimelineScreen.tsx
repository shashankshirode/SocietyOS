import { Text, View, ScrollView } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../../app/navigation/navigation.types";
import { useEmergencyTimeline } from "../../data/useEmergencyTimeline";
import { LoadingState } from "../../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { EmergencyTimeline } from "../../components/EmergencyTimeline";
import { styles } from "../../styles/screens/safety_screens/EmergencyIncidentTimelineScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'EmergencyIncidentTimeline'>;
export function EmergencyIncidentTimelineScreen({ route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { incidentId } = route.params;
    const { data, isLoading, error, refetch } = useEmergencyTimeline(incidentId);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_bb8c75c3a19d}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_3b41ba9c7cb8}/>;
    const timelineData = data;
    return (<ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{localizedUiText.m_232f46a8480a}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_e8725120df53}</Text>

        <View style={styles.card}>
          <EmergencyTimeline events={timelineData}/>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

