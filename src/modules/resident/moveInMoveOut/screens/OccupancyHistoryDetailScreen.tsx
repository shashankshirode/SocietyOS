import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useOccupancyHistory, useUpdateOccupancyStatus } from "../hooks/useOccupancyHistory";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { AppButton } from "../../../../shared/components/AppButton";
import { styles, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2, createTextColorStyle3, createTextColorStyle4, createTextColorStyle5, createTextColorStyle6 } from "../styles/screens/OccupancyHistoryDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
export function OccupancyHistoryDetailScreen({ route, navigation }: LegacyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { recordId } = route.params;
    const { colors } = useAppTheme();
    const { data } = useOccupancyHistory();
    const { submit: updateStatus } = useUpdateOccupancyStatus();
    const record = data?.find((r) => r.id === recordId);
    if (!record)
        return <ErrorState message={localizedUiText.m_60de363f3674}/>;
    const handleApprove = () => {
        updateStatus({ id: record.id, status: 'APPROVED' });
        navigation.goBack();
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={formatUiLiteral(localizedUiText.m_b4649fa2ca76, [record.flatNumber])} subtitle={localizedUiText.m_e637d5962a7f} onBack={() => navigation.goBack()}/>
        <View style={styles.content}>
          <View style={[styles.box, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
            <Text style={[styles.label, createTextColorStyle(colors.textSecondary)]}>{localizedUiText.m_0fa2af4e2bc0}</Text>
            <Text style={[styles.val, createTextColorStyle2(colors.textPrimary)]}>{record.occupantName}</Text>
            
            <Text style={[styles.label, createTextColorStyle3(colors.textSecondary)]}>{localizedUiText.m_e1806c035927}</Text>
            <Text style={[styles.val, createTextColorStyle4(colors.textPrimary)]}>{record.occupantType}</Text>

            <Text style={[styles.label, createTextColorStyle5(colors.textSecondary)]}>{localizedUiText.m_8b5d07700948}</Text>
            <Text style={[styles.val, createTextColorStyle6(colors.textPrimary)]}>{record.documentStatus}</Text>
          </View>

          <View style={styles.actions}>
            <AppButton title={localizedUiText.m_dc0d57634b71} onPress={handleApprove} variant="primary"/>
          </View>
        </View>
      </SafeAreaView>
    </ScreenContainer>);
}

