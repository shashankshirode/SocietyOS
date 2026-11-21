import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle } from "./styles/ScreenRestrictedState.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface ScreenRestrictedStateProps {
    title?: string;
    description: string;
    accessibilityLabel?: string;
}
export function ScreenRestrictedState({ title = getActiveUiLiteral("m_a3966fe9958a"), description, accessibilityLabel, }: ScreenRestrictedStateProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { colors, dark } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorStyle(colors.background)]} accessibilityLabel={accessibilityLabel ?? title}>
      <View style={[
            styles.iconContainer,
            createViewBackgroundColorBorderColorStyle(dark ? colors.surfaceElevated : colors.surface, colors.border),
        ]}>
        <Ionicons name="lock-closed-outline" size={34} color={colors.danger}/>
      </View>
      <SafeText variant="title" color="primary" align="center" numberOfLines={3} style={styles.title}>
        {title}
      </SafeText>
      <SafeText variant="body" color="secondary" align="center" numberOfLines={5} style={styles.description}>
        {description}
      </SafeText>
    </View>);
}

