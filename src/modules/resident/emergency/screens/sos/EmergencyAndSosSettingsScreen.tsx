import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useMessages } from "../../../../../shared/constants/useMessages";
import { useSosResidenceContext } from "../../hooks/useSosResidenceContext";
import { useSosResponsePlans } from "../../hooks/useSosResponsePlans";
import { useSosEmergencyContacts } from "../../hooks/useSosEmergencyContacts";
import { useSosPermissions } from "../../hooks/useSosPermissions";
import { SosReadinessIndicator } from "../../components/sos/SosReadinessIndicator";
import type { SosResponsePlanStackParamList } from "../../../../../app/navigation/navigation.types";
import { styles, createSafeTextColorStyle, createPressableBackgroundColorBorderColorOpacityStyle, createViewBackgroundColorStyle, createSafeTextColorStyle2, createScrollViewBackgroundColorStyle } from "../../styles/screens/sos/EmergencyAndSosSettingsScreen.styles";
type Props = NativeStackScreenProps<SosResponsePlanStackParamList, 'EmergencyAndSosSettings'>;
interface SettingsSectionProps {
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    title: string;
    subtitle: string;
    onPress: () => void;
    accessibilityLabel: string;
    badge?: string;
    disabled?: boolean;
}
function SettingsSection({ icon, iconColor, title, subtitle, onPress, accessibilityLabel, badge, disabled }: SettingsSectionProps) {
    const { colors } = useAppTheme();
    return (<Pressable onPress={onPress} disabled={disabled} style={[styles.sectionCard, createPressableBackgroundColorBorderColorOpacityStyle(colors.surface, colors.border, disabled ? 0.5 : 1)]} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
      <View style={[styles.sectionIcon, createViewBackgroundColorStyle(iconColor + '18')]}>
        <Ionicons name={icon} size={22} color={iconColor}/>
      </View>
      <View style={styles.sectionContent}>
        <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle2(colors.textPrimary)]} numberOfLines={1}>
          {title}
        </SafeText>
        <SafeText variant="caption" style={createSafeTextColorStyle(colors.textSecondary)} numberOfLines={2}>
          {subtitle}
        </SafeText>
      </View>
      {badge && (<View style={[styles.countBadge, styles.viewBackgroundColor]}>
          <SafeText variant="tiny" style={[styles.countText, styles.safeTextColor]}>
            {badge}
          </SafeText>
        </View>)}
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary}/>
    </Pressable>);
}
export function EmergencyAndSosSettingsScreen({ navigation }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const context = useSosResidenceContext();
    const { plans, isLoading: plansLoading } = useSosResponsePlans(context);
    const { contacts, isLoading: contactsLoading } = useSosEmergencyContacts(context);
    const { canManageContacts, canRunTest } = useSosPermissions();
    const sosMsg = messages.resident?.emergency?.sosSettings ?? {};
    const isLoading = plansLoading || contactsLoading;
    const activeContacts = contacts.filter((c) => c.active);
    return (<ScrollView style={[styles.container, createScrollViewBackgroundColorStyle(colors.background)]} contentContainerStyle={styles.contentContainer}>
      {!isLoading && (<SosReadinessIndicator plans={plans} contacts={contacts}/>)}

      {isLoading && (<View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.textSecondary}/>
        </View>)}

      <View style={styles.sectionsContainer}>
        <SettingsSection icon="shield-checkmark" iconColor="#EF4444" title={sosMsg?.responsePlans ?? localizedUiText.m_1a6187b1781d} subtitle={sosMsg?.responsePlansSubtitle ?? localizedUiText.m_7f60a8c996c1} onPress={() => navigation.navigate('SosResponsePlans')} accessibilityLabel={localizedUiText.m_d6b0451c1d04} badge={`${plans.length}`}/>

        <SettingsSection icon="people" iconColor="#3B82F6" title={sosMsg?.emergencyContacts ?? localizedUiText.m_06eaf514bc71} subtitle={sosMsg?.emergencyContactsSubtitle ?? localizedUiText.m_e3b8565e5f0b} onPress={() => navigation.navigate('EmergencyContacts')} accessibilityLabel={localizedUiText.m_08aab0b1f787} badge={`${activeContacts.length}`} disabled={!canManageContacts}/>

        <SettingsSection icon="home" iconColor="#8B5CF6" title={sosMsg?.trustedContacts ?? localizedUiText.m_6ced4142f39b} subtitle={sosMsg?.trustedContactsSubtitle ?? localizedUiText.m_501c9f667228} onPress={() => navigation.navigate('TrustedResidentSearch')} accessibilityLabel={localizedUiText.m_f0c36cd0c66d} disabled={!canManageContacts}/>

        <SettingsSection icon="lock-closed" iconColor="#10B981" title={sosMsg?.defaultResponders ?? localizedUiText.m_28c69d715231} subtitle={sosMsg?.defaultRespondersSubtitle ?? localizedUiText.m_89d539afc138} onPress={() => navigation.navigate('SosResponsePlans')} accessibilityLabel={localizedUiText.m_c5d9de38043c}/>

        <SettingsSection icon="medical" iconColor="#F97316" title={sosMsg?.emergencyProfile ?? localizedUiText.m_5477716ccddb} subtitle={sosMsg?.emergencyProfileSubtitle ?? localizedUiText.m_a49fb2119da4} onPress={() => navigation.navigate('EmergencyProfile')} accessibilityLabel={localizedUiText.m_9d8dcac930a1}/>

        <SettingsSection icon="flask" iconColor="#6366F1" title={sosMsg?.testSetup ?? localizedUiText.m_cbc61be0fcd1} subtitle={sosMsg?.testSetupSubtitle ?? localizedUiText.m_7c63ca34eb7d} onPress={() => navigation.navigate('SosTestMode')} accessibilityLabel={localizedUiText.m_9ed6dba49028} disabled={!canRunTest}/>

        <SettingsSection icon="time" iconColor="#6B7280" title={sosMsg?.auditLog ?? localizedUiText.m_1a2a1ca0d9f9} subtitle={sosMsg?.auditLogSubtitle ?? localizedUiText.m_fcfcaab3ad27} onPress={() => navigation.navigate('SosConfigurationHistory')} accessibilityLabel={localizedUiText.m_f49423845ec2}/>
      </View>
    </ScrollView>);
}

