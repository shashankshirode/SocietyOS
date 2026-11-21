import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "./householdComponentUtils";
import type { HouseholdSummary } from "../data/residentHousehold.types";
import { useResponsiveLayout } from "../../../../ui/layout/useResponsiveLayout";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorWidthStyle, createViewBackgroundColorStyle3 } from "../styles/components/HouseholdReadinessPanel.styles";
type HouseholdReadinessPanelProps = {
    summary: HouseholdSummary;
};
export function HouseholdReadinessPanel({ summary }: HouseholdReadinessPanelProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const { isTablet } = useResponsiveLayout();
    const readinessColor = summary.readiness.status === 'ready'
        ? colors.success
        : summary.readiness.status === 'needsReview'
            ? colors.warning
            : summary.readiness.status === 'actionRequired'
                ? colors.danger
                : colors.textSecondary;
    const metrics = [
        { label: t(messages, 'resident.household.summary.familyMembers'), value: `${summary.familyMemberCount}` },
        { label: t(messages, 'resident.household.summary.emergencyContacts'), value: `${summary.emergencyContactCount}` },
        { label: t(messages, 'resident.household.summary.activeAccess'), value: `${summary.accessSummary.activeAccessCount}` },
        { label: t(messages, 'resident.household.summary.pendingActions'), value: `${summary.pendingActionCount}` },
    ];
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}> 
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <SafeText variant="bodyStrong" color="primary">{t(messages, 'resident.household.summary.title')}</SafeText>
          <SafeText variant="caption" color="secondary">{summary.readiness.message}</SafeText>
        </View>
        <View style={[styles.badge, createViewBackgroundColorStyle(colors.primarySoft)]}> 
          <Ionicons name="sparkles-outline" size={16} color={colors.primary}/>
          <SafeText variant="tiny" color="primary">{t(messages, `resident.household.readiness.${summary.readiness.status}`)}</SafeText>
        </View>
      </View>

      <View style={styles.progressRow}>
        <View style={[styles.progressBar, createViewBackgroundColorStyle2(colors.backgroundSoft)]}> 
          <View style={[styles.progressFill, createViewBackgroundColorWidthStyle(readinessColor, `${summary.readiness.progress}%`)]}/>
        </View>
        <SafeText variant="bodyStrong" color="primary">{`${summary.readiness.completedItems}/${summary.readiness.totalItems} ${t(messages, 'resident.household.readiness.tally')}`}</SafeText>
      </View>

      <View style={[styles.grid, isTablet ? styles.tabletGrid : null]}>
        {metrics.map((metric) => (<View key={metric.label} style={[styles.metric, createViewBackgroundColorStyle3(colors.backgroundSoft)]}> 
            <SafeText variant="h3" color="primary">{metric.value}</SafeText>
            <SafeText variant="tiny" color="muted">{metric.label}</SafeText>
          </View>))}
      </View>
    </View>);
}

