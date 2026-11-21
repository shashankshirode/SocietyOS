import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { useOperationalAlerts } from "../hooks/useOperationalAlerts";
import { OperationalAlertCard } from "../components/OperationalAlertCard";
import { styles } from "../styles/screens/OperationalAlertsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function OperationalAlertsScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useOperationalAlerts();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_56de8fa8e7f6} subtitle={localizedUiText.m_56ecdf160b2f}/>
        <FlatList contentContainerStyle={styles.list} data={data} keyExtractor={(item) => item.id} renderItem={({ item }) => (<OperationalAlertCard alert={item} onPress={() => { }}/>)} ListEmptyComponent={<EmptyState title={localizedUiText.m_17473aee2b01} description={localizedUiText.m_ac470e7771ac}/>}/>
      </SafeAreaView>
    </ScreenContainer>);
}

