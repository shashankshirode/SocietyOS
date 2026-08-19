import React from "react";
import { View, ViewStyle } from "react-native";
import { AppIconBubble } from "../icons/AppIconBubble";
import type { AppIconName } from "../icons/icon.types";
import { PressableScale } from "../motion/PressableScale";
import { Shadows } from "../theme/shadows";
import { useAppTheme } from "../theme/useAppTheme";
import { SafeText } from "./SafeText";
import { StatusPill } from "./StatusPill";
import { includeWhenPresent } from "../utils/presentProperty";
import { styles } from "./styles/SurfaceCard.styles";
type SurfaceCardVariant = 'default' | 'elevated' | 'glass' | 'gradient' | 'warning' | 'danger' | 'success';
type SurfaceCardProps = {
    title?: string;
    subtitle?: string;
    body?: string;
    icon?: AppIconName;
    status?: string;
    statusTone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    actionArea?: React.ReactNode;
    children?: React.ReactNode;
    variant?: SurfaceCardVariant;
    onPress?: () => void;
    style?: ViewStyle;
    testID?: string;
};
export function SurfaceCard({ title, subtitle, body, icon, status, statusTone, actionArea, children, variant = 'default', onPress, style, testID }: SurfaceCardProps) {
    const { colors } = useAppTheme();
    const variantStyle: Record<SurfaceCardVariant, ViewStyle> = {
        default: { backgroundColor: colors.surface, borderColor: colors.border },
        elevated: { backgroundColor: colors.surfaceElevated, borderColor: colors.border, ...Shadows.card },
        glass: { backgroundColor: colors.surfaceGlass, borderColor: colors.border },
        gradient: { backgroundColor: colors.primary, borderColor: colors.primaryPressed },
        warning: { backgroundColor: colors.warningSoft, borderColor: colors.warning },
        danger: { backgroundColor: colors.dangerSoft, borderColor: colors.danger },
        success: { backgroundColor: colors.successSoft, borderColor: colors.success }
    };
    const isInverse = variant === 'gradient';
    const content = (<View {...includeWhenPresent("testID", testID)} style={[styles.card, variantStyle[variant], style]}>
      <View style={styles.header}>
        {icon ? <AppIconBubble name={icon} size={44} iconSize={21} color={isInverse ? colors.white : colors.primary} backgroundColor={isInverse ? colors.primaryPressed : colors.primarySoft}/> : null}
        <View style={styles.copy}>
          {title ? <SafeText variant="title" color={isInverse ? 'inverse' : 'primary'} numberOfLines={2}>{title}</SafeText> : null}
          {subtitle ? <SafeText variant="caption" color={isInverse ? 'inverse' : 'secondary'} numberOfLines={3}>{subtitle}</SafeText> : null}
        </View>
        {status ? <StatusPill label={status} {...includeWhenPresent("tone", statusTone)}/> : null}
      </View>
      {body ? <SafeText variant="body" color={isInverse ? 'inverse' : 'secondary'}>{body}</SafeText> : null}
      {children}
      {actionArea ? <View style={styles.actionArea}>{actionArea}</View> : null}
    </View>);
    if (!onPress)
        return content;
    return <PressableScale onPress={onPress} accessibilityRole="button">{content}</PressableScale>;
}

