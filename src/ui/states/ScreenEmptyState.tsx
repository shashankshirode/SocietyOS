import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { AppButton } from "../../shared/components/AppButton";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "./styles/ScreenEmptyState.styles";
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
    const { colors, dark } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorStyle(colors.background)]} accessibilityLabel={accessibilityLabel ?? title}>
      <View style={[
            styles.iconContainer,
            createViewBackgroundColorStyle2(dark ? colors.surfaceElevated : colors.surface),
        ]}>
        <Ionicons name={iconName} size={36} color={colors.secondary}/>
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

