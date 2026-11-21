import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../../shared/constants/useMessages";
import { t } from "../../../household/components/householdComponentUtils";
import type { ResidentInsightCategory } from "../../../contextualInsights/data/residentInsight.types";
import { styles, createViewBackgroundColorStyle, createSafeTextColorStyle } from "../../styles/components/insights/InsightCategoryBadge.styles";
export interface InsightCategoryBadgeProps {
    category: ResidentInsightCategory;
}
type IconName = keyof typeof Ionicons.glyphMap;
export function InsightCategoryBadge({ category }: InsightCategoryBadgeProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    let bg = colors.infoSoft;
    let tint = colors.info;
    let icon: IconName = 'partly-sunny-outline';
    if (category === 'traffic') {
        bg = colors.primarySoft;
        tint = colors.primary;
        icon = 'car-outline';
    }
    else if (category === 'civic') {
        bg = colors.secondarySoft;
        tint = colors.accentTeal;
        icon = 'globe-outline';
    }
    else if (category === 'society') {
        bg = colors.primarySoft;
        tint = colors.accentIndigo;
        icon = 'business-outline';
    }
    else if (category === 'safety') {
        bg = colors.dangerSoft;
        tint = colors.danger;
        icon = 'shield-checkmark-outline';
    }
    else if (category === 'utility') {
        bg = colors.warningSoft;
        tint = colors.warning;
        icon = 'build-outline';
    }
    const labelKey = `resident.dashboard.insights.category.${category}`;
    const labelText = t(messages, labelKey);
    return (<View style={[styles.container, createViewBackgroundColorStyle(bg)]}>
      <Ionicons name={icon} size={11} color={tint}/>
      <SafeText variant="tiny" style={[styles.text, createSafeTextColorStyle(tint)]}>
        {labelText}
      </SafeText>
    </View>);
}
export default InsightCategoryBadge;

