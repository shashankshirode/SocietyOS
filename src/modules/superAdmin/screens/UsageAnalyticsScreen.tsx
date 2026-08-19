import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ResponsiveGrid } from "../../../shared/layouts/ResponsiveGrid";
import { useUsageAnalytics } from "../hooks/useUsageAnalytics";
import { PlatformMetricCard } from "../components/PlatformMetricCard";
import { styles } from "../styles/screens/UsageAnalyticsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function UsageAnalyticsScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useUsageAnalytics();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={error?.message || localizedUiText.m_ddf785b79c42} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_3d96620f949b} subtitle={localizedUiText.m_260138e6ac2c}/>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ResponsiveGrid columnsPhone={2} columnsTablet={3}>
            <PlatformMetricCard label={localizedUiText.m_c7aba09d03e4} value={data.monthlyActiveUsers} icon="people-outline"/>
            <PlatformMetricCard label={localizedUiText.m_025e4e11c0b1} value={data.visitorPassesCreated} icon="qr-code-outline"/>
            <PlatformMetricCard label={localizedUiText.m_add75dd33df1} value={data.complaintsCreated} icon="alert-circle-outline"/>
            <PlatformMetricCard label={localizedUiText.m_dfdd8cd9b48a} value={data.facilityBookings} icon="calendar-outline"/>
            <PlatformMetricCard label={localizedUiText.m_76d93c42291b} value={data.guardEntries} icon="shield-checkmark-outline"/>
            <PlatformMetricCard label={localizedUiText.m_d48274e1af8c} value={data.marketplaceListings} icon="cart-outline"/>
          </ResponsiveGrid>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

