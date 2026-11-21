import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { SafeText } from "../../shared/components/SafeText";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle2, createPressableBackgroundColorStyle } from "./styles/InlineErrorMessage.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface InlineErrorMessageProps {
    message?: string;
    onRetry?: () => void;
}
export function InlineErrorMessage({ message = getActiveUiLiteral("m_0c953ab32c60"), onRetry }: InlineErrorMessageProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle(colors.dangerSoft, colors.danger)]} testID="inline-error-message">
      <Ionicons name="alert-circle-outline" size={16} color={colors.danger}/>
      <SafeText variant="caption" style={[styles.message, createSafeTextColorStyle2(colors.textPrimary)]}>
        {message}
      </SafeText>
      {onRetry && (<Pressable onPress={onRetry} style={[styles.retryBtn, createPressableBackgroundColorStyle(colors.danger)]} accessibilityRole="button" accessibilityLabel={localizedUiText.m_6d1c1522ede2}>
          <SafeText variant="tiny" style={createSafeTextColorStyle(colors.textInverse)}>{localizedUiText.m_942087cc2d41}</SafeText>
        </Pressable>)}
    </View>);
}
export default InlineErrorMessage;

