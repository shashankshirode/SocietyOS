import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { useSocietyHealth } from "../hooks/useSocietyHealth";
import { SocietyHealthCard } from "../components/SocietyHealthCard";
import { styles } from "../styles/screens/SocietyHealthOverviewScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function SocietyHealthOverviewScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useSocietyHealth();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_b2cfba48e8a7} subtitle={localizedUiText.m_de479ea688c1}/>
        <FlatList contentContainerStyle={styles.list} data={data} keyExtractor={(item) => item.societyId} renderItem={({ item }) => (<SocietyHealthCard health={item}/>)} ListEmptyComponent={<EmptyState title={localizedUiText.m_d2d2d48c815b} description={localizedUiText.m_f21266c1f6f0}/>}/>
      </SafeAreaView>
    </ScreenContainer>);
}

