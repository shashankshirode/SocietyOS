import { ReactElement } from "react";
import { View, Image, ImageSourcePropType, useWindowDimensions, Platform } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { AppButton } from "../../shared/components/AppButton";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorStyle, createSafeTextColorStyle, createViewBackgroundColorBorderColorMaxWidthStyle } from "./styles/EmptyStatePanel.styles";
export interface EmptyStatePanelProps {
    illustration?: ImageSourcePropType;
    icon?: ReactElement;
    title: string;
    description: string;
    primaryAction?: {
        label: string;
        onPress: () => void;
        accessibilityLabel: string;
    };
    secondaryAction?: {
        label: string;
        onPress: () => void;
        accessibilityLabel: string;
    };
    testID?: string;
}
export function EmptyStatePanel({ illustration, icon, title, description, primaryAction, secondaryAction, testID, }: EmptyStatePanelProps) {
    const { colors, dark } = useAppTheme();
    const { width: screenWidth } = useWindowDimensions();
    const isTablet = screenWidth >= 768;
    return (<View style={[
            styles.container,
            createViewBackgroundColorBorderColorMaxWidthStyle(dark ? colors.surfaceElevated : colors.surface, colors.border, isTablet ? 520 : undefined),
        ]} testID={testID} accessibilityRole="summary" accessibilityLabel={`${title}. ${description}`}>
      {illustration ? (<Image source={illustration} style={styles.illustration} resizeMode="contain" accessible={false}/>) : icon ? (<View style={[styles.iconContainer, createViewBackgroundColorStyle(dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.03)')]}>
          {icon}
        </View>) : null}

      <SafeText variant="bodyStrong" align="center" style={[styles.title, createSafeTextColorStyle(colors.textPrimary)]}>
        {title}
      </SafeText>

      <SafeText variant="caption" align="center" color="secondary" style={styles.description}>
        {description}
      </SafeText>

      <View style={styles.actions}>
        {primaryAction ? (<AppButton title={primaryAction.label} onPress={primaryAction.onPress} accessibilityLabel={primaryAction.accessibilityLabel} fullWidth={Platform.OS !== 'web'}/>) : null}

        {secondaryAction ? (<AppButton title={secondaryAction.label} onPress={secondaryAction.onPress} accessibilityLabel={secondaryAction.accessibilityLabel} variant="outline" fullWidth={Platform.OS !== 'web'}/>) : null}
      </View>
    </View>);
}
export default EmptyStatePanel;

