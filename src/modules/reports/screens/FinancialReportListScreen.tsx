import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useFinancialReports } from "../hooks/useFinancialReports";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { AppButton } from "../../../shared/components/AppButton";
import { styles, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2, createTextColorStyle3 } from "../styles/screens/FinancialReportListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function FinancialReportListScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { data, isLoading, error, refetch } = useFinancialReports();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={localizedUiText.m_3a25e9ad0e04} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_f3fc8fed3e9f} subtitle={localizedUiText.m_a499e8c34251} onBack={() => navigation.goBack()}/>
        <FlatList data={data} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
              <View style={styles.header}>
                <Text style={[styles.title, createTextColorStyle(colors.textPrimary)]}>{item.reportName}</Text>
                <Text style={[styles.month, createTextColorStyle2(colors.textSecondary)]}>{item.month}</Text>
              </View>
              <Text style={[styles.desc, createTextColorStyle3(colors.textSecondary)]}>{localizedUiText.m_98182557c4b1}{item.collectedAmount}{" " + localizedUiText.m_1c86bac22a73}{item.outstandingAmount}</Text>
              <AppButton title={localizedUiText.m_774f19a02383} onPress={() => navigation.navigate('FinancialReportDetail', { reportId: item.id })} variant="outline" style={styles.btn}/>
            </View>)}/>
      </SafeAreaView>
    </ScreenContainer>);
}

