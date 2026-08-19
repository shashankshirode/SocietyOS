import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { useIntegrationStatus } from "../hooks/useIntegrationStatus";
import { IntegrationStatusCard } from "../components/IntegrationStatusCard";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/IntegrationStatusPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function IntegrationStatusPlaceholderScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useIntegrationStatus();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_47b96df557ca} subtitle={localizedUiText.m_e32c5ec3d22e}/>
        <FlatList contentContainerStyle={styles.list} data={data} keyExtractor={(item) => item.id} renderItem={({ item }) => (<IntegrationStatusCard name={item.integrationName} category={item.category} status={item.status} {...includeWhenPresent("provider", item.provider)} failures={item.failureCountPlaceholder} affected={item.affectedSocietiesPlaceholder}/>)} ListEmptyComponent={<EmptyState title={localizedUiText.m_0e65444eb973} description={localizedUiText.m_05902e6442ea}/>}/>
      </SafeAreaView>
    </ScreenContainer>);
}

