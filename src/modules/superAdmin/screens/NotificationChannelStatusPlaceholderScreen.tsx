import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { useNotificationChannelStatus } from "../hooks/useNotificationChannelStatus";
import { IntegrationStatusCard } from "../components/IntegrationStatusCard";
import { styles } from "../styles/screens/NotificationChannelStatusPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function NotificationChannelStatusPlaceholderScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useNotificationChannelStatus();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_109680395057} subtitle={localizedUiText.m_be3feb27081b}/>
        <FlatList contentContainerStyle={styles.list} data={data} keyExtractor={(item) => item.id} renderItem={({ item }) => (<IntegrationStatusCard name={item.channelName} category="Notification Channel" status={item.status} provider={item.providerPlaceholder} failures={item.failureCountPlaceholder} affected={item.affectedSocietiesPlaceholder}/>)} ListEmptyComponent={<EmptyState title={localizedUiText.m_c385951198c4} description={localizedUiText.m_3f40d67235f4}/>}/>
      </SafeAreaView>
    </ScreenContainer>);
}

