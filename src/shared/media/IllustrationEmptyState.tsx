import { Text, View, ViewStyle } from "react-native";
import { AppIconBubble } from "../icons/AppIconBubble";
import type { AppIconName } from "../icons/icon.types";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewBackgroundColorBorderColorStyle, createTextColorStyle, createTextColorStyle2 } from "./styles/IllustrationEmptyState.styles";
type IllustrationEmptyStateProps = {
    icon?: AppIconName;
    title: string;
    message: string;
    style?: ViewStyle;
};
export function IllustrationEmptyState({ icon = 'empty', title, message, style }: IllustrationEmptyStateProps) {
    const { colors } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border), style]}>
      <AppIconBubble name={icon} size={56} iconSize={26}/>
      <Text style={[styles.title, createTextColorStyle(colors.textPrimary)]}>{title}</Text>
      <Text style={[styles.message, createTextColorStyle2(colors.textSecondary)]}>{message}</Text>
    </View>);
}

