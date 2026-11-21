import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { dailyInsightMessages } from "../../../../../messages/en/residentDashboard.messages";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createPressableBackgroundColorStyle } from "../../styles/components/insights/InsightErrorState.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
export interface InsightErrorStateProps {
    onRetry?: () => void;
}
export function InsightErrorState({ onRetry }: InsightErrorStateProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    const titleText = dailyInsightMessages.sheet.loadErrorTitle;
    const descText = getActiveUiLiteral("m_6cce95935a2c");
    const retryText = dailyInsightMessages.sheet.retry;
    return (<View style={styles.container} testID="insight-error-state">
      <View style={[styles.iconContainer, createViewBackgroundColorStyle(colors.dangerSoft)]}>
        <Ionicons name="alert-circle-outline" size={32} color={colors.danger}/>
      </View>
      
      <SafeText variant="bodyStrong" style={[styles.title, createSafeTextColorStyle2(colors.textPrimary)]}>
        {titleText}
      </SafeText>
      
      <SafeText variant="caption" style={[styles.desc, createSafeTextColorStyle3(colors.textSecondary)]}>
        {descText}
      </SafeText>

      {onRetry ? (<Pressable style={[styles.btn, createPressableBackgroundColorStyle(colors.primary)]} onPress={onRetry} accessibilityRole="button" accessibilityLabel={retryText}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textInverse)}>
            {retryText}
          </SafeText>
        </Pressable>) : null}
    </View>);
}
export default InsightErrorState;

