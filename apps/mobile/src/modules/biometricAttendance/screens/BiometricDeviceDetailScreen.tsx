import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useBiometricReadiness, useSyncBiometricData } from "../hooks/useBiometricReadiness";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { AppButton } from "../../../shared/components/AppButton";
import { styles, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2, createTextColorStyle3, createTextColorStyle4, createTextColorStyle5, createTextColorStyle6 } from "../styles/screens/BiometricDeviceDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function BiometricDeviceDetailScreen({ route, navigation }: LegacyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { deviceId } = route.params;
    const { colors } = useAppTheme();
    const { data } = useBiometricReadiness();
    const { submit: syncData } = useSyncBiometricData();
    const device = data?.find((d) => d.id === deviceId);
    if (!device)
        return <ErrorState message={localizedUiText.m_005076f9ccce}/>;
    const handleSync = () => {
        syncData({ id: device.id });
        navigation.goBack();
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={device.deviceName} subtitle={localizedUiText.m_41f2bb87be65} onBack={() => navigation.goBack()}/>
        <View style={styles.content}>
          <View style={[styles.box, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
            <Text style={[styles.label, createTextColorStyle(colors.textSecondary)]}>{localizedUiText.m_f9570e5c14c7}</Text>
            <Text style={[styles.val, createTextColorStyle2(colors.textPrimary)]}>{device.location}</Text>

            <Text style={[styles.label, createTextColorStyle3(colors.textSecondary)]}>{localizedUiText.m_621ef865cd78}</Text>
            <Text style={[styles.val, createTextColorStyle4(colors.textPrimary)]}>{device.lastSyncTime}</Text>

            <Text style={[styles.label, createTextColorStyle5(colors.textSecondary)]}>{localizedUiText.m_920e413c7d41}</Text>
            <Text style={[styles.val, createTextColorStyle6(colors.textPrimary)]}>{device.status}</Text>
          </View>

          <View style={styles.actions}>
            <AppButton title={localizedUiText.m_785c9242a602} onPress={handleSync} variant="primary"/>
          </View>
        </View>
      </SafeAreaView>
    </ScreenContainer>);
}

