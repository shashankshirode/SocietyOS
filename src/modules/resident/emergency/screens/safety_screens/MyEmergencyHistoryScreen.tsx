import { Text, View, FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../../app/navigation/navigation.types";
import { useMyEmergencyHistory } from "../../data/useMyEmergencyHistory";
import { LoadingState } from "../../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { EmergencyIncidentCard } from "../../components/EmergencyIncidentCard";
import { styles } from "../../styles/screens/safety_screens/MyEmergencyHistoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'MyEmergencyHistory'>;
export function MyEmergencyHistoryScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useMyEmergencyHistory();
    if (isLoading)
        return <LoadingState message={localizedUiText.m_9a0b66557603}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ScreenContainer style={styles.container}>
      <FlatList data={data} keyExtractor={item => item.id} contentContainerStyle={styles.scroll} renderItem={({ item }) => (<EmergencyIncidentCard incident={item} onPress={() => navigation.navigate('ActiveEmergencyDetail', { incidentId: item.id })}/>)} ListHeaderComponent={<View style={styles.header}>
            <Text style={styles.title}>{localizedUiText.m_3b4dba2daac0}</Text>
            <Text style={styles.subtitle}>{localizedUiText.m_968bf33b57d5}</Text>
          </View>} ListEmptyComponent={<View style={styles.empty}>
            <Text style={styles.emptyText}>{localizedUiText.m_ba5e349e6e81}</Text>
          </View>}/>
    </ScreenContainer>);
}

