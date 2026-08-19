import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useHardwareDevices, useTriggerFirmwareUpdate } from "../hooks/useHardwareDevices";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { AppButton } from "../../../shared/components/AppButton";
import { styles, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2, createTextColorStyle3, createTextColorStyle4, createTextColorStyle5, createTextColorStyle6, createTextColorStyle7, createTextColorStyle8 } from "../styles/screens/HardwareLogDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function HardwareLogDetailScreen({ route, navigation }: LegacyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { deviceId } = route.params;
    const { colors } = useAppTheme();
    const { data } = useHardwareDevices();
    const { submit: updateFirmware } = useTriggerFirmwareUpdate();
    const device = data?.find((d) => d.id === deviceId);
    if (!device)
        return <ErrorState message={localizedUiText.m_5fa5a35a62b8}/>;
    const handleUpdate = () => {
        updateFirmware({ id: device.id });
        navigation.goBack();
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={device.name} subtitle={localizedUiText.m_91ba9981cd5d} onBack={() => navigation.goBack()}/>
        <View style={styles.content}>
          <View style={[styles.box, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
            <Text style={[styles.label, createTextColorStyle(colors.textSecondary)]}>{localizedUiText.m_246b71213c47}</Text>
            <Text style={[styles.val, createTextColorStyle2(colors.textPrimary)]}>{device.type}</Text>

            <Text style={[styles.label, createTextColorStyle3(colors.textSecondary)]}>{localizedUiText.m_3c3de0c91c5f}</Text>
            <Text style={[styles.val, createTextColorStyle4(colors.textPrimary)]}>{device.ipAddress}</Text>

            <Text style={[styles.label, createTextColorStyle5(colors.textSecondary)]}>{localizedUiText.m_edb21d8b8bcb}</Text>
            <Text style={[styles.val, createTextColorStyle6(colors.textPrimary)]}>{device.lastSyncTime}</Text>

            <Text style={[styles.label, createTextColorStyle7(colors.textSecondary)]}>{localizedUiText.m_3693e2883427}</Text>
            <Text style={[styles.val, createTextColorStyle8(colors.textPrimary)]}>{device.status}</Text>
          </View>

          <View style={styles.actions}>
            <AppButton title={localizedUiText.m_6d65e051746c} onPress={handleUpdate} variant="primary"/>
          </View>
        </View>
      </SafeAreaView>
    </ScreenContainer>);
}

