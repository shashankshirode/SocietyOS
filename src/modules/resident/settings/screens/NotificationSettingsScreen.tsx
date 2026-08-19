import { AppAlert } from "../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { Spacing } from "../../../../shared/theme/spacing";
import { useNotificationPermission } from "../../../../core/notifications/useNotificationPermission";
import { useLocalNotificationTest } from "../../../../core/notifications/useLocalNotificationTest";
import { getCachedNotificationPreferences, updateNotificationPreference } from "../../../../core/notifications/notificationPreferences";
import { resolvePermissionDeniedError } from "../../../../core/device/deviceCapabilityError";
import { AppButton } from "../../../../shared/components/AppButton";
import { AppScreen } from "../../../../shared/layouts/AppScreen";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { styles, createViewPaddingBottomStyle, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2, createTextColorStyle3, createViewBackgroundColorBorderColorStyle2, createTextColorStyle4, createViewBorderBottomColorStyle, createTextColorStyle5, createTextColorStyle6, createTextColorStyle7, createTextColorStyle8 } from "../styles/screens/NotificationSettingsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function NotificationSettingsScreen({ navigation }: BackOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const insets = useSafeAreaInsets();
    const { status, loading, askPermission } = useNotificationPermission();
    const { triggerTest, isSending } = useLocalNotificationTest();
    const [preferences, setPreferences] = useState(getCachedNotificationPreferences());
    function handleToggle(key: string, value: boolean, important?: boolean) {
        if (important && !value) {
            AppAlert.alert(String(localizedUiText.m_90c50691653a), String(localizedUiText.m_67422ecc9e25));
            return;
        }
        updateNotificationPreference(key, value);
        setPreferences(getCachedNotificationPreferences());
    }
    async function handleSendTest() {
        const result = await triggerTest();
        if (!result.success) {
            AppAlert.alert(String(localizedUiText.m_34de315c5c90), String(localizedUiText.m_de13ebbe2d50));
        }
    }
    async function handleEnable() {
        const nextStatus = await askPermission();
        if (nextStatus.status === 'denied') {
            AppAlert.alert(String(localizedUiText.m_866a0a58fd9a), resolvePermissionDeniedError('notifications'));
        }
    }
    return (<AppScreen scroll>
      <AppHeader title={localizedUiText.m_07a063cab7ec} showBack onBack={() => navigation.goBack()}/>
      <View style={[styles.content, createViewPaddingBottomStyle(insets.bottom + Spacing.xxl)]}>
        
        
        <View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.card, colors.border)]}>
          <Text style={[styles.title, createTextColorStyle(colors.textPrimary)]}>{localizedUiText.m_4e0190a510fa}</Text>
          <View style={styles.statusRow}>
            <Text style={[styles.label, createTextColorStyle2(colors.textSecondary)]}>{localizedUiText.m_5427e0ef4eba}</Text>
            <Text style={[styles.statusVal, createTextColorStyle3(status === 'granted' ? colors.success : colors.danger)]}>
              {loading ? localizedUiText.m_2e5f79bb94a8 : status.toUpperCase()}
            </Text>
          </View>
          {status !== 'granted' ? (<AppButton title={localizedUiText.m_87b9876704ed} variant="primary" size="sm" onPress={handleEnable} style={styles.btn}/>) : (<AppButton title={localizedUiText.m_5b297385e4fb} variant="secondary" size="sm" onPress={handleSendTest} loading={isSending} style={styles.btn}/>)}
        </View>

        
        <View style={[styles.card, createViewBackgroundColorBorderColorStyle2(colors.card, colors.border)]}>
          <Text style={[styles.title, createTextColorStyle4(colors.textPrimary)]}>{localizedUiText.m_66962f72a088}</Text>
          {preferences.map((pref) => (<View key={pref.key} style={[styles.toggleRow, createViewBorderBottomColorStyle(colors.divider)]}>
              <View style={styles.toggleText}>
                <Text style={[styles.label, createTextColorStyle5(colors.textSecondary)]}>{pref.label}</Text>
                {pref.important && (<Text style={[styles.importantTag, createTextColorStyle6(colors.danger)]}>{localizedUiText.m_4850b174b713}</Text>)}
              </View>
              <Switch value={pref.enabled} onValueChange={(val) => handleToggle(pref.key, val, pref.important)} trackColor={{ true: colors.primary, false: colors.border }} disabled={pref.important}/>
            </View>))}
        </View>

        
        <View style={styles.infoBox}>
          <Text style={[styles.infoText, createTextColorStyle7(colors.textMuted)]}>{localizedUiText.m_00c9dabed390}</Text>
          <Text style={[styles.syncText, createTextColorStyle8(colors.textMuted)]}>{localizedUiText.m_c2ad103f4456}</Text>
        </View>

      </View>
    </AppScreen>);
}

