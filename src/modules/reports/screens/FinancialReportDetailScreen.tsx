import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useFinancialReports, useGenerateReport } from "../hooks/useFinancialReports";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { AppButton } from "../../../shared/components/AppButton";
import { styles, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2, createTextColorStyle3, createTextColorStyle4, createTextColorStyle5, createTextColorStyle6, createTextColorStyle7, createTextColorStyle8 } from "../styles/screens/FinancialReportDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function FinancialReportDetailScreen({ route, navigation }: LegacyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { reportId } = route.params;
    const { colors } = useAppTheme();
    const { data } = useFinancialReports();
    const { submit: regenerate } = useGenerateReport();
    const report = data?.find((r) => r.id === reportId);
    if (!report)
        return <ErrorState message={localizedUiText.m_f3da6b248732}/>;
    const handleRegenerate = () => {
        regenerate({ name: report.reportName, month: report.month });
        navigation.goBack();
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_66f70d42a758} subtitle={report.reportName} onBack={() => navigation.goBack()}/>
        <View style={styles.content}>
          <View style={[styles.box, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
            <Text style={[styles.label, createTextColorStyle(colors.textSecondary)]}>{localizedUiText.m_49639ad493b7}</Text>
            <Text style={[styles.val, createTextColorStyle2(colors.textPrimary)]}>{report.reportName}</Text>

            <Text style={[styles.label, createTextColorStyle3(colors.textSecondary)]}>{localizedUiText.m_314786dc102e}</Text>
            <Text style={[styles.val, createTextColorStyle4(colors.textPrimary)]}>{report.month}</Text>

            <Text style={[styles.label, createTextColorStyle5(colors.textSecondary)]}>{localizedUiText.m_1996d6e79cb5}</Text>
            <Text style={[styles.val, createTextColorStyle6(colors.textPrimary)]}>₹{report.collectedAmount}</Text>

            <Text style={[styles.label, createTextColorStyle7(colors.textSecondary)]}>{localizedUiText.m_66fd58c25037}</Text>
            <Text style={[styles.val, createTextColorStyle8(colors.textPrimary)]}>₹{report.outstandingAmount}</Text>
          </View>

          <View style={styles.actions}>
            <AppButton title={localizedUiText.m_2489298701ba} onPress={handleRegenerate} variant="primary"/>
          </View>
        </View>
      </SafeAreaView>
    </ScreenContainer>);
}

