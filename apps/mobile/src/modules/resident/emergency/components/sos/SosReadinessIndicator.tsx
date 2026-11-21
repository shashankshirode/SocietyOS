import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../../shared/components/SafeText";
import type { SosResponsePlan } from "../../data/sosResponsePlan.types";
import type { SosEmergencyContact } from "../../data/sosEmergencyContact.types";
import { useMessages } from "../../../../../shared/constants/useMessages";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle4, createViewBackgroundColorStyle, createSafeTextColorStyle5 } from "../../styles/components/sos/SosReadinessIndicator.styles";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
type ReadinessLevel = 'ready' | 'defaults' | 'recommended' | 'needsAttention';
interface SosReadinessIndicatorProps {
    plans: SosResponsePlan[];
    contacts: SosEmergencyContact[];
}
function assessReadiness(plans: SosResponsePlan[], contacts: SosEmergencyContact[]): ReadinessLevel {
    const activeContacts = contacts.filter((c) => c.active && c.verified);
    const customPlans = plans.filter((p) => p.mode === 'custom');
    if (customPlans.length >= 3 && activeContacts.length >= 2)
        return 'ready';
    if (activeContacts.length > 0)
        return 'ready';
    if (plans.length > 0 && activeContacts.length === 0)
        return 'recommended';
    if (plans.length === 0)
        return 'needsAttention';
    return 'defaults';
}
function getReadinessConfig(level: ReadinessLevel): {
    color: string;
    icon: keyof typeof Ionicons.glyphMap;
} {
    switch (level) {
        case 'ready': return { color: '#10B981', icon: 'checkmark-circle' };
        case 'defaults': return { color: '#6B7280', icon: 'information-circle' };
        case 'recommended': return { color: '#F59E0B', icon: 'alert-circle' };
        case 'needsAttention': return { color: '#EF4444', icon: 'warning' };
    }
}
export function SosReadinessIndicator({ plans, contacts }: SosReadinessIndicatorProps) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const level = assessReadiness(plans, contacts);
    const config = getReadinessConfig(level);
    const sosMessages = messages.resident?.emergency?.sosSettings ?? {};
    const activeContacts = contacts.filter((c) => c.active && c.verified);
    const labelMap: Record<ReadinessLevel, string> = {
        ready: sosMessages?.readinessReady ?? 'Ready',
        defaults: sosMessages?.readinessDefaults ?? getActiveUiLiteral("m_910035613ab2"),
        recommended: sosMessages?.readinessRecommended ?? getActiveUiLiteral("m_6eceb9760383"),
        needsAttention: sosMessages?.readinessNeedsAttention ?? getActiveUiLiteral("m_c1ebc7817870"),
    };
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]} accessibilityLabel={formatUiLiteral(localizedUiText.m_6bd9cf3a4ad8, [labelMap[level]])}>
      <View style={styles.header}>
        <Ionicons name={config.icon} size={22} color={config.color}/>
        <SafeText variant="bodyStrong" style={[styles.title, createSafeTextColorStyle4(colors.textPrimary)]}>
          {sosMessages?.readiness ?? localizedUiText.m_cee7d44c2e24}
        </SafeText>
        <View style={[styles.statusBadge, createViewBackgroundColorStyle(config.color + '18')]}>
          <SafeText variant="tiny" style={[styles.statusText, createSafeTextColorStyle5(config.color)]}>
            {labelMap[level]}
          </SafeText>
        </View>
      </View>

      <View style={styles.stats}>
        <SafeText variant="caption" style={createSafeTextColorStyle(colors.textSecondary)}>
          {`${plans.length} ${sosMessages?.plansConfigured ?? localizedUiText.m_3e9f001ddb42}`}
        </SafeText>
        <SafeText variant="caption" style={createSafeTextColorStyle2(colors.textSecondary)}>
          {`${activeContacts.length} ${sosMessages?.verifiedContacts ?? localizedUiText.m_12598da31e91}`}
        </SafeText>
        <SafeText variant="caption" style={createSafeTextColorStyle3(colors.textSecondary)}>
          {sosMessages?.securityEnabled ?? localizedUiText.m_02312633724a}
        </SafeText>
      </View>
    </View>);
}

