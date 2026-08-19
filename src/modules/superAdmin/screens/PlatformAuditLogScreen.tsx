import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { usePlatformAuditLogs } from "../hooks/usePlatformAuditLogs";
import { PlatformAuditLogRow } from "../components/PlatformAuditLogRow";
import { styles } from "../styles/screens/PlatformAuditLogScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function PlatformAuditLogScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = usePlatformAuditLogs();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_6dc67772f004} subtitle={localizedUiText.m_8808d8afe3f1}/>
        <FlatList data={data} keyExtractor={(item) => item.id} renderItem={({ item }) => (<PlatformAuditLogRow log={item}/>)} ListEmptyComponent={<EmptyState title={localizedUiText.m_cd07a86c9306} description={localizedUiText.m_42caf331cd62}/>}/>
      </SafeAreaView>
    </ScreenContainer>);
}

