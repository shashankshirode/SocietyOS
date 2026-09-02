import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { AppButton } from "../../shared/components/AppButton";
import { styles, createViewBackgroundColorStyle, createViewBorderColorStyle } from "./styles/ScreenEmptyState.styles";
export interface ScreenEmptyStateProps {
    title: string;
    description: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    accessibilityLabel?: string;
    primaryAction?: {
        label: string;
        onPress: () => void;
    };
}
export function ScreenEmptyState({ title, description, iconName = 'file-tray-outline', accessibilityLabel, primaryAction, }: ScreenEmptyStateProps) {
    const { semantic } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorStyle(semantic.surface.canvas)]} accessibilityLabel={accessibilityLabel ?? title}>
      <View style={[
            styles.iconContainer,
            createViewBackgroundColorStyle(semantic.surface.soft),
            createViewBorderColorStyle(semantic.border.subtle),
        ]}>
        <Ionicons name={iconName} size={28} color={semantic.accent.moss}/>
      </View>
      <SafeText variant="title" color="primary" align="center" numberOfLines={3} style={styles.title}>
        {title}
      </SafeText>
      <SafeText variant="body" color="secondary" align="center" numberOfLines={5} style={styles.description}>
        {description}
      </SafeText>
      {primaryAction ? (<AppButton title={primaryAction.label} onPress={primaryAction.onPress} style={styles.action}/>) : null}
    </View>);
}
