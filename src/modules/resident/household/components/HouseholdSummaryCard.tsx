import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import type { HouseholdOverview } from "../data/residentHousehold.types";
import { t } from "./householdComponentUtils";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "../styles/components/HouseholdSummaryCard.styles";
type HouseholdSummaryCardProps = {
    overview: HouseholdOverview;
};
export function HouseholdSummaryCard({ overview }: HouseholdSummaryCardProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const stats = [
        { key: 'family', label: t(messages, 'resident.household.summary.familyMembers'), value: overview.familyMemberCount },
        { key: 'access', label: t(messages, 'resident.household.summary.activeAccess'), value: overview.activeFamilyAccessCount },
        { key: 'emergency', label: t(messages, 'resident.household.summary.emergencyContacts'), value: overview.emergencyContactCount },
        { key: 'tenant', label: t(messages, 'resident.household.summary.pendingTenantRequests'), value: overview.pendingTenantRequestCount },
    ];
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
      <SafeText variant="bodyStrong" color="primary">{t(messages, 'resident.household.summary.title')}</SafeText>
      <SafeText variant="caption" color="secondary">{overview.unitLabel}</SafeText>
      <View style={styles.grid}>
        {stats.map((stat) => (<View key={stat.key} style={[styles.stat, createViewBackgroundColorStyle(colors.backgroundSoft)]}>
            <SafeText variant="h3" color="primary">{String(stat.value)}</SafeText>
            <SafeText variant="tiny" color="muted">{stat.label}</SafeText>
          </View>))}
      </View>
    </View>);
}

