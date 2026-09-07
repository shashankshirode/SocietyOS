import { Text, View, SafeAreaView } from "react-native";
import { Screen } from "../../../design-system/layouts";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useFinancialReports, useFinancialReport, useGenerateReport } from "../hooks/useFinancialReports";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { Button } from "../../../design-system/components";
import { styles } from "../styles/screens/FinancialReportDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function FinancialReportDetailScreen({ route, navigation }: LegacyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { reportId } = route.params as { reportId: string };
    const { colors, dark } = useAppTheme();
    const { data: report, isLoading, error } = useFinancialReport(reportId);
    const { submit: regenerate } = useGenerateReport();
    if (isLoading) {
        return null;
    }
    if (error || !report) {
        return <ErrorState message={localizedUiText.m_f3da6b248732} />;
    }
    const handleRegenerate = () => {
        regenerate({ name: report.reportName, month: report.month });
        navigation.goBack();
    };
    return (
        <Screen
            title={localizedUiText.m_66f70d42a758}
            subtitle={report.reportName}
            showBackButton
            onBack={() => navigation.goBack()}
        >
            <SafeAreaView style={styles.safe}>
                <View style={styles.content}>
                    <View style={styles.box}>
                        <Text style={styles.label}>{localizedUiText.m_49639ad493b7}</Text>
                        <Text style={styles.val}>{report.reportName}</Text>

                        <Text style={styles.label}>{localizedUiText.m_314786dc102e}</Text>
                        <Text style={styles.val}>{report.month}</Text>

                        <Text style={styles.label}>{localizedUiText.m_1996d6e79cb5}</Text>
                        <Text style={styles.val}>₹{report.collectedAmount}</Text>

                        <Text style={styles.label}>{localizedUiText.m_66fd58c25037}</Text>
                        <Text style={styles.val}>₹{report.outstandingAmount}</Text>
                    </View>

                    <View style={styles.actions}>
                        <Button title={localizedUiText.m_2489298701ba} onPress={handleRegenerate} variant="primary" />
                    </View>
                </View>
            </SafeAreaView>
        </Screen>
    );
}