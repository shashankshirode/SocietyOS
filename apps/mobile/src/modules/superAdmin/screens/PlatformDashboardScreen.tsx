import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ResponsiveGrid } from "../../../shared/layouts/ResponsiveGrid";
import { usePlatformDashboard } from "../hooks/usePlatformDashboard";
import { PlatformMetricCard } from "../components/PlatformMetricCard";
import { styles } from "../styles/screens/PlatformDashboardScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function PlatformDashboardScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = usePlatformDashboard();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_27d17a1cb51b} subtitle={localizedUiText.m_be4299f9323e}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ResponsiveGrid columnsPhone={2} columnsTablet={3}>
            <PlatformMetricCard label={localizedUiText.m_4bed35976a6b} value={data.totalSocieties} icon="business-outline"/>
            <PlatformMetricCard label={localizedUiText.m_5639b9f1265e} value={data.totalActiveUsers} icon="people-outline"/>
            <PlatformMetricCard label={localizedUiText.m_9318cc3a87bf} value={data.openSupportTickets} icon="chatbubbles-outline" trend="2 pending escalation" trendType="down"/>
            <PlatformMetricCard label={localizedUiText.m_56de8fa8e7f6} value={data.criticalAlerts} icon="alert-circle-outline" trend="Requires attention" trendType="down"/>
            <PlatformMetricCard label={localizedUiText.m_3ab20ff94f7c} value={data.societiesUsingFreeLaunch} icon="gift-outline"/>
            <PlatformMetricCard label={localizedUiText.m_d29318f4a9cf} value={`${data.moduleAdoptionScore}%`} icon="apps-outline" trend="Good engagement" trendType="up"/>
          </ResponsiveGrid>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{localizedUiText.m_da4b90c4c7b0}</Text>
            <Text style={styles.bodyText}>{localizedUiText.m_1a97a154d0d0}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

