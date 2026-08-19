import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useSmartAutomation, useToggleController } from "../hooks/useSmartAutomation";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { AppButton } from "../../../shared/components/AppButton";
import { styles, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2, createTextColorStyle3, createTextColorStyle4, createTextColorStyle5, createTextColorStyle6 } from "../styles/screens/AutomationDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function AutomationDetailScreen({ route, navigation }: {
    route: {
        params: {
            controllerId: string;
        };
    };
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { controllerId } = route.params;
    const { colors } = useAppTheme();
    const { data } = useSmartAutomation();
    const { submit: toggleNode } = useToggleController();
    const ctrl = data?.find((c) => c.id === controllerId);
    if (!ctrl)
        return <ErrorState message={localizedUiText.m_6e59aa2bb4b3}/>;
    const handleToggle = () => {
        toggleNode({ id: ctrl.id });
        navigation.goBack();
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={ctrl.name} subtitle={localizedUiText.m_9186bcb9a700} onBack={() => navigation.goBack()}/>
        <View style={styles.content}>
          <View style={[styles.box, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
            <Text style={[styles.label, createTextColorStyle(colors.textSecondary)]}>{localizedUiText.m_3e9a7c79a189}</Text>
            <Text style={[styles.val, createTextColorStyle2(colors.textPrimary)]}>{ctrl.deviceType}</Text>

            <Text style={[styles.label, createTextColorStyle3(colors.textSecondary)]}>{localizedUiText.m_51b3bad35ff7}</Text>
            <Text style={[styles.val, createTextColorStyle4(colors.textPrimary)]}>{ctrl.lastRunTime}</Text>

            <Text style={[styles.label, createTextColorStyle5(colors.textSecondary)]}>{localizedUiText.m_171c0962bf1b}</Text>
            <Text style={[styles.val, createTextColorStyle6(colors.textPrimary)]}>{ctrl.status}</Text>
          </View>

          <View style={styles.actions}>
            <AppButton title={ctrl.status === 'ACTIVE' ? localizedUiText.m_1aa984d10ca0 : localizedUiText.m_f11b1799aa55} onPress={handleToggle} variant="primary"/>
          </View>
        </View>
      </SafeAreaView>
    </ScreenContainer>);
}

