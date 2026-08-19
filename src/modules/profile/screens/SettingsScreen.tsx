import { View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ResidentPageHeader } from "../../../ui/patterns/ResidentPageHeader";
import { SettingsSection } from "../../settings/components/SettingsSection";
import { SettingsRow } from "../../settings/components/SettingsRow";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useMessages } from "../../../shared/constants/useMessages";
import { useActiveResidentHome } from "../../resident/homeContext/hooks/useActiveResidentHome";
import { useAuthSession } from "../../../core/auth/useAuthSession";
import { useAppModal } from "../../../ui/modal";
import { resetToAppModeSelector } from "../../../core/auth/authNavigation";
import type { RootResetNavigation } from "../../../core/auth/authNavigation";
import { SafeText } from "../../../shared/components/SafeText";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle, createScrollViewPaddingBottomStyle, createPressableBackgroundColorBorderColorOpacityStyle } from "../styles/screens/SettingsScreen.styles";
type SettingsScreenProps = {
    navigation: LegacyNavigation & RootResetNavigation;
};
export function SettingsScreen({ navigation }: SettingsScreenProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const copy = messages.resident.settings;
    const insets = useSafeAreaInsets();
    const { activeContext } = useActiveResidentHome();
    const { logout } = useAuthSession();
    const modal = useAppModal();
    const handleLogout = () => {
        modal.show({
            titleKey: 'resident.settings.logout.confirmation.title',
            messageKey: 'resident.settings.logout.confirmation.description',
            tone: 'danger',
            actions: [
                {
                    id: 'logout-confirm',
                    labelKey: 'resident.settings.logout.confirmation.confirm',
                    tone: 'danger',
                    onPress: async () => {
                        modal.hide();
                        await logout();
                        resetToAppModeSelector(navigation);
                    },
                },
                {
                    id: 'logout-cancel',
                    labelKey: 'resident.settings.logout.confirmation.cancel',
                    tone: 'primary',
                    onPress: () => {
                        modal.hide();
                    },
                },
            ],
        });
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}>
      <ResidentPageHeader title={copy.title} subtitle={activeContext.societyName} showBackButton={true} onBackPress={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={[styles.scrollContent, createScrollViewPaddingBottomStyle(Math.max(insets.bottom, 20))]} showsVerticalScrollIndicator={false}>
        <View style={styles.responsiveContainer}>
          <SettingsSection title={copy.preferences.title}>
            <SettingsRow icon={<Ionicons name="language-outline" size={20} color={colors.primary}/>} title={copy.language.title} description={copy.language.description} onPress={() => navigation.navigate('Language')}/>
            <SettingsRow icon={<Ionicons name="color-palette-outline" size={20} color={colors.primary}/>} title={copy.appearance.title} description={copy.appearance.description} onPress={() => navigation.navigate('Appearance')}/>
            <SettingsRow icon={<Ionicons name="notifications-outline" size={20} color={colors.primary}/>} title={copy.notifications.title} description={copy.notifications.description} onPress={() => navigation.navigate('Notifications')}/>
            <SettingsRow icon={<Ionicons name="accessibility-outline" size={20} color={colors.primary}/>} title={copy.accessibility.title} description={copy.accessibility.description} onPress={() => navigation.navigate('Accessibility')}/>
            <SettingsRow isLast={true} icon={<Ionicons name="lock-closed-outline" size={20} color={colors.primary}/>} title={copy.privacy.title} description={copy.privacy.description} onPress={() => navigation.navigate('Privacy')}/>
          </SettingsSection>

          <SettingsSection title={copy.session.title} description={copy.session.description}>
            <Pressable onPress={handleLogout} style={({ pressed }) => [
            styles.logoutBtn,
            createPressableBackgroundColorBorderColorOpacityStyle(colors.dangerSoft, colors.danger, pressed ? 0.7 : 1),
        ]} accessibilityRole="button" accessibilityLabel={copy.logout.action}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.danger)}>
                {copy.logout.action}
              </SafeText>
            </Pressable>
          </SettingsSection>
        </View>
      </ScrollView>
    </View>);
}
export default SettingsScreen;

