import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../../shared/constants/useMessages";
import { t } from "../../../household/components/householdComponentUtils";
import type { ResidentInsightPriority } from "../../../contextualInsights/data/residentInsight.types";
import { styles, createViewBackgroundColorStyle, createSafeTextColorStyle } from "../../styles/components/insights/InsightPriorityChip.styles";
export interface InsightPriorityChipProps {
    priority: ResidentInsightPriority;
}
export function InsightPriorityChip({ priority }: InsightPriorityChipProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    let bg = colors.successSoft;
    let text = colors.success;
    if (priority === 'medium') {
        bg = colors.infoSoft;
        text = colors.info;
    }
    else if (priority === 'high') {
        bg = colors.warningSoft;
        text = colors.warning;
    }
    else if (priority === 'critical') {
        bg = colors.dangerSoft;
        text = colors.danger;
    }
    const labelKey = `resident.dashboard.insights.priority.${priority}`;
    const labelText = t(messages, labelKey);
    return (<View style={[styles.container, createViewBackgroundColorStyle(bg)]}>
      <Ionicons name="alert-circle-outline" size={10} color={text}/>
      <SafeText variant="tiny" style={[styles.text, createSafeTextColorStyle(text)]}>
        {labelText}
      </SafeText>
    </View>);
}
export default InsightPriorityChip;

