import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useFinancialReports } from "../hooks/useFinancialReports";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ErrorBoundary } from "../../../shared/components/ErrorBoundary";
import { Screen } from "../../../design-system/layouts";
import { Button } from "../../../design-system/components";
import { SkeletonLoader, CardSkeleton } from "../../../shared/components/SkeletonLoader";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { styles } from "../styles/screens/FinancialReportListScreen.styles";
export function FinancialReportListScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { data, isLoading, error, refetch } = useFinancialReports();
    if (isLoading) {
        return (
            <ErrorBoundary
                fallback={<ErrorState message={localizedUiText.m_3a25e9ad0e04} onRetry={refetch} />}
            >
                <Screen
                    title={localizedUiText.m_f3fc8fed3e9f}
                    subtitle={localizedUiText.m_a499e8c34251}
                    showBackButton
                    onBack={() => navigation.goBack()}
                >
                    <SafeAreaView style={styles.safe} edges={['bottom']}>
                        <CardSkeleton lines={3} count={5} spacing={16} />
                    </SafeAreaView>
                </Screen>
            </ErrorBoundary>
        );
    }
    if (error || !data) {
        return (
            <ErrorBoundary
                fallback={<ErrorState message={localizedUiText.m_3a25e9ad0e04} onRetry={refetch} />}
            >
                <Screen
                    title={localizedUiText.m_f3fc8fed3e9f}
                    subtitle={localizedUiText.m_a499e8c34251}
                    showBackButton
                    onBack={() => navigation.goBack()}
                >
                    <SafeAreaView style={styles.safe} edges={['bottom']}>
                        <ErrorState message={localizedUiText.m_3a25e9ad0e04} onRetry={refetch} />
                    </SafeAreaView>
                </Screen>
            </ErrorBoundary>
        );
    }
    return (
        <ErrorBoundary
            fallback={<ErrorState message={localizedUiText.m_3a25e9ad0e04} onRetry={refetch} />}
            onError={(err) => console.error('[FinancialReportListScreen] Error:', err)}
        >
            <Screen
                title={localizedUiText.m_f3fc8fed3e9f}
                subtitle={localizedUiText.m_a499e8c34251}
                showBackButton
                onBack={() => navigation.goBack()}
            >
                <SafeAreaView style={styles.safe} edges={['bottom']}>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.list}
                        renderItem={({ item }) => (
                            <View style={[styles.card]}>
                                <View style={styles.header}>
                                    <Text style={[styles.title, { color: '#0F172A' }]}>{item.reportName}</Text>
                                    <Text style={[styles.month, { color: '#64748B' }]}>{item.month}</Text>
                                </View>
                                <Text style={[styles.desc, { color: '#64748B' }]}>{localizedUiText.m_98182557c4b1}{item.collectedAmount}{" " + localizedUiText.m_1c86bac22a73}{item.outstandingAmount}</Text>
                                <Button title={localizedUiText.m_774f19a02383} onPress={() => navigation.navigate('FinancialReportDetail', { reportId: item.id })} variant="outline" size="sm" />
                            </View>
                        )}
                    />
                </SafeAreaView>
            </Screen>
        </ErrorBoundary>
    );
}