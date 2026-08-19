import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useComplianceChecklist, useSubmitComplianceCheck } from "../hooks/useComplianceChecklist";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { AppButton } from "../../../shared/components/AppButton";
import { styles, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2, createTextColorStyle3, createTextColorStyle4, createTextColorStyle5, createTextColorStyle6 } from "../styles/screens/RegulatoryAuditDetailsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function RegulatoryAuditDetailsScreen({ route, navigation }: LegacyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { itemId } = route.params;
    const { colors } = useAppTheme();
    const { data } = useComplianceChecklist();
    const { submit: updateCheck } = useSubmitComplianceCheck();
    const item = data?.find((i) => i.id === itemId);
    if (!item)
        return <ErrorState message={localizedUiText.m_60de363f3674}/>;
    const handleVerify = () => {
        updateCheck({ id: item.id, status: 'COMPLIANT' });
        navigation.goBack();
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={item.title} subtitle={localizedUiText.m_3dec3c80ac78} onBack={() => navigation.goBack()}/>
        <View style={styles.content}>
          <View style={[styles.box, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
            <Text style={[styles.label, createTextColorStyle(colors.textSecondary)]}>{localizedUiText.m_526e0087cc3f}</Text>
            <Text style={[styles.val, createTextColorStyle2(colors.textPrimary)]}>{item.description}</Text>

            <Text style={[styles.label, createTextColorStyle3(colors.textSecondary)]}>{localizedUiText.m_89bc9a84563c}</Text>
            <Text style={[styles.val, createTextColorStyle4(colors.textPrimary)]}>{item.lastChecked}</Text>

            <Text style={[styles.label, createTextColorStyle5(colors.textSecondary)]}>{localizedUiText.m_920e413c7d41}</Text>
            <Text style={[styles.val, createTextColorStyle6(colors.textPrimary)]}>{item.status}</Text>
          </View>

          <View style={styles.actions}>
            <AppButton title={localizedUiText.m_455d2248da11} onPress={handleVerify} variant="primary"/>
          </View>
        </View>
      </SafeAreaView>
    </ScreenContainer>);
}

