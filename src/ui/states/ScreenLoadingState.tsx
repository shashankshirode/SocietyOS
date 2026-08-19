import { ActivityIndicator, View } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorStyle } from "./styles/ScreenLoadingState.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface ScreenLoadingStateProps {
    message?: string;
    accessibilityLabel?: string;
}
export function ScreenLoadingState({ message, accessibilityLabel = getActiveUiLiteral("m_d1049c5e8c3b"), }: ScreenLoadingStateProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorStyle(colors.background)]} accessibilityLabel={accessibilityLabel} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.primary}/>
      {message ? (<SafeText variant="body" color="secondary" align="center" numberOfLines={2} style={styles.message}>
          {message}
        </SafeText>) : null}
    </View>);
}

