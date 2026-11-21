import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useComplianceChecklist } from "../hooks/useComplianceChecklist";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { AppButton } from "../../../shared/components/AppButton";
import { styles, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2 } from "../styles/screens/ComplianceDashboardScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function ComplianceDashboardScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { data, isLoading, error, refetch } = useComplianceChecklist();
    if (isLoading)
        return <LoadingState />;
    if (error || !data)
        return <ErrorState message={localizedUiText.m_de3054badcf3} onRetry={refetch}/>;
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ResponsivePageHeader title={localizedUiText.m_05711df86199} subtitle={localizedUiText.m_16fa648ff274} onBack={() => navigation.goBack()}/>
        <FlatList data={data} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
              <View style={styles.header}>
                <Text style={[styles.title, createTextColorStyle(colors.textPrimary)]}>{item.title}</Text>
                <StatusBadge label={item.status} type={item.status === 'COMPLIANT' ? 'success' : 'warning'}/>
              </View>
              <Text style={[styles.desc, createTextColorStyle2(colors.textSecondary)]}>{item.description}</Text>
              <AppButton title={localizedUiText.m_f33584b02ef8} onPress={() => navigation.navigate('RegulatoryAuditDetails', { itemId: item.id })} variant="outline" style={styles.btn}/>
            </View>)}/>
      </SafeAreaView>
    </ScreenContainer>);
}

