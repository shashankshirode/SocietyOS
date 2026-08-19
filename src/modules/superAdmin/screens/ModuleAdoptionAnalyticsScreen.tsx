import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { useModuleAdoption } from "../hooks/useModuleAdoption";
import { ModuleAdoptionCard } from "../components/ModuleAdoptionCard";
import { styles } from "../styles/screens/ModuleAdoptionAnalyticsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function ModuleAdoptionAnalyticsScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useModuleAdoption();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_d29318f4a9cf} subtitle={localizedUiText.m_84ac002a2054}/>
        <FlatList contentContainerStyle={styles.list} data={data} keyExtractor={(item) => item.moduleKey} renderItem={({ item }) => (<ModuleAdoptionCard adoption={item}/>)} ListEmptyComponent={<EmptyState title={localizedUiText.m_d2d2d48c815b} description={localizedUiText.m_cf1b39aeda6b}/>}/>
      </SafeAreaView>
    </ScreenContainer>);
}

