import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { dailyInsightMessages } from "../../../../../messages/en/residentDashboard.messages";
import { styles, createViewBackgroundColorStyle, createSafeTextColorStyle, createSafeTextColorStyle2 } from "../../styles/components/insights/InsightEmptyState.styles";
export function InsightEmptyState() {
    const { colors } = useAppTheme();
    const titleText = dailyInsightMessages.sheet.clearTitle;
    const descText = dailyInsightMessages.sheet.clearMessage;
    return (<View style={styles.container} testID="insight-empty-state">
      <View style={[styles.iconContainer, createViewBackgroundColorStyle(colors.successSoft)]}>
        <Ionicons name="checkmark-circle-outline" size={32} color={colors.success}/>
      </View>
      <SafeText variant="bodyStrong" style={[styles.title, createSafeTextColorStyle(colors.textPrimary)]}>
        {titleText}
      </SafeText>
      <SafeText variant="caption" style={[styles.desc, createSafeTextColorStyle2(colors.textSecondary)]}>
        {descText}
      </SafeText>
    </View>);
}
export default InsightEmptyState;

