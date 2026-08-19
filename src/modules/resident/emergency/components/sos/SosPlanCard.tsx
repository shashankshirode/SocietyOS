import { View, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../../shared/components/SafeText";
import type { SosResponsePlan } from "../../data/sosResponsePlan.types";
import { getSosTypeDefinition } from "../../data/sosTypeDefinitions";
import { useMessages } from "../../../../../shared/constants/useMessages";
import { styles, createSafeTextColorStyle, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle2, createSafeTextColorStyle3 } from "../../styles/components/sos/SosPlanCard.styles";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
type PlanStatus = 'ready' | 'default' | 'needsReview' | 'noPersonal';
function getPlanStatus(plan: SosResponsePlan): PlanStatus {
    const personalCount = plan.recipientRules.filter((r) => !r.mandatory && r.enabled).length;
    if (plan.mode === 'custom' && personalCount > 0)
        return 'ready';
    if (plan.mode === 'recommended')
        return 'default';
    if (personalCount === 0)
        return 'noPersonal';
    return 'needsReview';
}
function getStatusColor(status: PlanStatus, colors: ReturnType<typeof useAppTheme>['colors']): string {
    switch (status) {
        case 'ready': return colors.success ?? '#10B981';
        case 'default': return colors.textSecondary ?? '#6B7280';
        case 'needsReview': return '#F59E0B';
        case 'noPersonal': return '#F59E0B';
    }
}
interface SosPlanCardProps {
    plan: SosResponsePlan;
    onPress: () => void;
}
export function SosPlanCard({ plan, onPress }: SosPlanCardProps) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const definition = getSosTypeDefinition(plan.sosType);
    const status = getPlanStatus(plan);
    const statusColor = getStatusColor(status, colors);
    const totalResponders = plan.recipientRules.filter((r) => r.enabled).length;
    const mandatoryCount = plan.recipientRules.filter((r) => r.mandatory && r.enabled).length;
    const sosMessages = messages.resident?.emergency?.sosSettings ?? {};
    const planMessages = messages.resident?.emergency?.sosPlans ?? {};
    const typeMessages = sosMessages?.types?.[plan.sosType] ?? {};
    const statusLabel = (() => {
        switch (status) {
            case 'ready': return planMessages?.statusReady ?? 'Ready';
            case 'default': return planMessages?.statusDefault ?? getActiveUiLiteral("m_d72820365330");
            case 'needsReview': return planMessages?.statusNeedsReview ?? getActiveUiLiteral("m_07297fa94a99");
            case 'noPersonal': return planMessages?.statusNoPersonal ?? getActiveUiLiteral("m_e31fe40caf14");
        }
    })();
    const accessibilityLabel = `${typeMessages?.title ?? plan.sosType} response plan. ${totalResponders} responders configured. ${mandatoryCount} are mandatory.`;
    return (<Pressable onPress={onPress} style={[styles.card, createPressableBackgroundColorBorderColorStyle(colors.surface, colors.border)]} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
      <View style={styles.row}>
        <View style={[styles.iconContainer, createViewBackgroundColorStyle((definition?.color ?? '#DC2626') + '18')]}>
          <Ionicons name={(definition?.icon ?? 'alert-circle') as keyof typeof Ionicons.glyphMap} size={24} color={definition?.color ?? '#DC2626'}/>
        </View>
        <View style={styles.content}>
          <SafeText variant="bodyStrong" style={[styles.title, createSafeTextColorStyle2(colors.textPrimary)]}>
            {typeMessages?.title ?? plan.sosType}
          </SafeText>
          <SafeText variant="caption" style={createSafeTextColorStyle(colors.textSecondary)} numberOfLines={1}>
            {`${totalResponders} ${planMessages?.respondersConfigured ?? localizedUiText.m_0427cc57dbe4}`}
          </SafeText>
        </View>
        <View style={styles.statusArea}>
          <View style={[styles.statusBadge, createViewBackgroundColorStyle2(statusColor + '18')]}>
            <SafeText variant="tiny" style={[styles.statusText, createSafeTextColorStyle3(statusColor)]}>
              {statusLabel}
            </SafeText>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary}/>
        </View>
      </View>
    </Pressable>);
}

