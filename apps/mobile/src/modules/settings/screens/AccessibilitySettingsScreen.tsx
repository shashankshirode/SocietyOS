import { useState, useEffect } from "react";
import { StyleSheet, View, Switch, ActivityIndicator } from "react-native";
import { ResidentPageHeader } from "../../../ui/patterns/ResidentPageHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { SafeText } from "../../../shared/components/SafeText";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useMessages } from "../../../shared/constants/useMessages";
import { settingsRepository } from "../data/settings.repository";
import { AppAlert } from "../../../ui/modal/AppAlert";
import type { AccessibilityPreferences } from "../domain/settings.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle, createViewBorderBottomColorStyle } from "../styles/screens/AccessibilitySettingsScreen.styles";
export function AccessibilitySettingsScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const copy = messages.resident.settings;
    const [loading, setLoading] = useState(false);
    const [preferences, setPreferences] = useState<AccessibilityPreferences>({
        textScale: 'default',
        reduceMotion: false,
        highContrast: false,
        simplifiedNavigation: false,
        screenReaderEnhancements: false,
    });
    useEffect(() => {
        void settingsRepository.getSettings('resident-001').then((res) => {
            setPreferences(res.accessibility);
        });
    }, []);
    const handleToggle = async (key: keyof AccessibilityPreferences, value: boolean) => {
        setLoading(true);
        try {
            const res = await settingsRepository.updateAccessibility({
                userId: 'resident-001',
                accessibility: { [key]: value },
            });
            setPreferences(res.accessibility);
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_89e2170be620));
        }
        finally {
            setLoading(false);
        }
    };
    const options: {
        key: keyof AccessibilityPreferences;
        title: string;
        description: string;
    }[] = [
        { key: 'reduceMotion', title: String(localizedUiText.m_159f641008ba), description: String(localizedUiText.m_91ea2c39354a) },
        { key: 'highContrast', title: String(localizedUiText.m_faf73cec0083), description: String(localizedUiText.m_5f652627d92f) },
        { key: 'simplifiedNavigation', title: String(localizedUiText.m_1c3992513953), description: String(localizedUiText.m_691360c1d5d6) },
        { key: 'screenReaderEnhancements', title: String(localizedUiText.m_d0e4466b0630), description: String(localizedUiText.m_1cdb941f2674) },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}>
      <ResidentPageHeader title={copy.accessibility?.title || localizedUiText.m_d3368cbffe23} subtitle={copy.accessibility?.description || localizedUiText.m_760f828b00cb} showBackButton={true} onBackPress={() => navigation.goBack()}/>
      
      <View style={styles.content}>
        <AppCard style={styles.card}>
          {options.map((opt, index) => (<View key={opt.key} style={[
                styles.row,
                index < options.length - 1 && createViewBorderBottomColorStyle(colors.border)
            ]}>
              <View style={styles.textCol}>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)}>
                  {opt.title}
                </SafeText>
                <SafeText variant="caption" style={createSafeTextColorStyle2(colors.textSecondary)}>
                  {opt.description}
                </SafeText>
              </View>
              <Switch value={preferences[opt.key] as boolean} onValueChange={(val) => void handleToggle(opt.key, val)} trackColor={{ true: colors.primary, false: colors.border }}/>
            </View>))}
        </AppCard>
      </View>

      {loading && (<View style={[StyleSheet.absoluteFill, styles.overlay]}>
          <ActivityIndicator size="large" color={colors.primary}/>
        </View>)}
    </View>);
}
export default AccessibilitySettingsScreen;

