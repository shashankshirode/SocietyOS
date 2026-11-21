import { View, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../../shared/components/SafeText";
import type { SosRecipientRule } from "../../data/sosResponsePlan.types";
import { styles, createSafeTextColorStyle, createPressableBackgroundColorBorderColorOpacityStyle, createViewBackgroundColorStyle, createSafeTextColorStyle2 } from "../../styles/components/sos/SosRecipientRow.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
interface SosRecipientRowProps {
    rule: SosRecipientRule;
    onPress?: () => void;
    showReorder?: boolean;
}
function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((n) => n.charAt(0).toUpperCase())
        .join('');
}
function getRecipientIcon(type: SosRecipientRule['recipientType']): keyof typeof Ionicons.glyphMap {
    switch (type) {
        case 'societyRole': return 'shield-checkmark';
        case 'societyChannel': return 'megaphone';
        case 'familyMember': return 'people';
        case 'externalEmergencyContact': return 'call';
        case 'trustedResident': return 'home';
        case 'emergencyVolunteerGroup': return 'hand-left';
        case 'serviceProvider': return 'construct';
        case 'residentOwner': return 'person';
    }
}
export function SosRecipientRow({ rule, onPress, showReorder = false }: SosRecipientRowProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const initials = getInitials(rule.recipientDisplayName);
    const iconName = getRecipientIcon(rule.recipientType);
    const isMandatory = rule.mandatory;
    const isEnabled = rule.enabled;
    const accessibilityLabel = isMandatory
        ? `${rule.recipientDisplayName} is a required society responder and cannot be removed.`
        : `${rule.recipientDisplayName}, optional personal responder. Tap to configure.`;
    return (<Pressable onPress={onPress} disabled={!onPress} style={[
            styles.row,
            createPressableBackgroundColorBorderColorOpacityStyle(colors.surface, colors.border, isEnabled ? 1 : 0.5),
        ]} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
      {showReorder && (<Ionicons name="reorder-three" size={20} color={colors.textSecondary} style={styles.reorderIcon}/>)}
      <View style={[styles.avatar, createViewBackgroundColorStyle((isMandatory ? '#10B981' : '#3B82F6') + '18')]}>
        {isMandatory ? (<Ionicons name={iconName} size={18} color="#10B981"/>) : (<SafeText variant="caption" style={[styles.initials, styles.safeTextColor]}>
            {initials}
          </SafeText>)}
      </View>

      <View style={styles.content}>
        <SafeText variant="body" style={[styles.name, createSafeTextColorStyle2(colors.textPrimary)]} numberOfLines={1}>
          {rule.recipientDisplayName}
        </SafeText>
        <SafeText variant="tiny" style={createSafeTextColorStyle(colors.textSecondary)} numberOfLines={1}>
          {rule.notifyImmediately
            ? localizedUiText.m_ac30df9b78b1 : formatUiLiteral(localizedUiText.m_d8226aa3f278, [rule.escalationDelaySeconds])}
        </SafeText>
      </View>

      <View style={styles.badges}>
        {isMandatory && (<View style={[styles.badge, styles.viewBackgroundColor]}>
            <Ionicons name="lock-closed" size={10} color="#10B981"/>
            <SafeText variant="tiny" style={[styles.badgeText, styles.safeTextColor2]}>{localizedUiText.m_4850b174b713}</SafeText>
          </View>)}
        {!isEnabled && (<View style={[styles.badge, styles.viewBackgroundColor2]}>
            <SafeText variant="tiny" style={[styles.badgeText, styles.safeTextColor3]}>{localizedUiText.m_75081b593d15}</SafeText>
          </View>)}
      </View>

      {onPress && !isMandatory && (<Ionicons name="chevron-forward" size={16} color={colors.textSecondary}/>)}
    </Pressable>);
}

