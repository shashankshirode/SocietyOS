import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../../household/components/householdComponentUtils";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createPressableBackgroundColorBorderColorStyle } from "../styles/components/ContextualInsightErrorState.styles";
export function ContextualInsightErrorState({ onRetry }: {
    onRetry: () => void;
}) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    return (<Pressable onPress={onRetry} accessibilityRole="button" accessibilityLabel={messages.common.retry} style={[styles.container, createPressableBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
      <Ionicons name="alert-circle-outline" size={16} color={colors.danger}/>
      <SafeText variant="tiny" style={createSafeTextColorStyle(colors.textPrimary)}>
        {t(messages, 'resident.contextualInsights.error.unavailable')}
      </SafeText>
      <SafeText variant="tiny" style={createSafeTextColorStyle2(colors.primary)}>{messages.common.retry}</SafeText>
    </Pressable>);
}
export default ContextualInsightErrorState;

