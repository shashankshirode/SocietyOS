import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../../shared/constants/useMessages";
import { t } from "../../../household/components/householdComponentUtils";
import type { ResidentInsightSource } from "../../../contextualInsights/data/residentInsight.types";
import { styles, createViewBackgroundColorStyle, createSafeTextColorStyle, createViewBackgroundColorStyle2, createSafeTextColorStyle2 } from "../../styles/components/insights/InsightSourceBadge.styles";
export interface InsightSourceBadgeProps {
    source: ResidentInsightSource;
}
export function InsightSourceBadge({ source }: InsightSourceBadgeProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const displaySource = t(messages, source.labelMessageKey ?? `resident.dashboard.insights.source.${source.type}`);
    const reportedByPrefix = t(messages, 'resident.dashboard.insights.reportedBy');
    const verifiedLabel = t(messages, 'resident.dashboard.insights.verified');
    return (<View style={[styles.container, createViewBackgroundColorStyle(colors.surfaceMuted)]}>
      <Ionicons name="radio-outline" size={12} color={colors.textSecondary}/>
      <SafeText variant="tiny" style={[styles.sourceText, createSafeTextColorStyle(colors.textSecondary)]} numberOfLines={1} ellipsizeMode="tail">
        {`${reportedByPrefix} ${displaySource}`}
      </SafeText>
      {source.verified && (<View style={[styles.verifiedBadge, createViewBackgroundColorStyle2(colors.successSoft)]}>
          <Ionicons name="checkmark-circle" size={10} color={colors.success}/>
          <SafeText variant="tiny" style={[styles.verifiedText, createSafeTextColorStyle2(colors.success)]}>
            {verifiedLabel}
          </SafeText>
        </View>)}
    </View>);
}
export default InsightSourceBadge;

