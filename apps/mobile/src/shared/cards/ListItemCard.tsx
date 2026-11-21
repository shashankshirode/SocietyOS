import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { AppCard } from "./AppCard";
import { AppIcon } from "../icons/AppIcon";
import { AppIconName } from "../icons/icon.types";
import { SafeTextRow } from "../layout/SafeTextRow";
import { includeWhenPresent } from "../utils/presentProperty";
import { styles, createViewBackgroundColorBorderRadiusStyle, createAppCardShadowColorSpread2Style } from "./styles/ListItemCard.styles";
export interface ListItemCardProps {
    title: string;
    subtitle?: string;
    meta?: string;
    iconName?: AppIconName;
    right?: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}
export function ListItemCard({ title, subtitle, meta, iconName, right, onPress, style, }: ListItemCardProps) {
    const { colors, radius, shadows } = useAppTheme();
    const leftElement = iconName ? (<View style={[styles.iconCircle, createViewBackgroundColorBorderRadiusStyle(colors.primarySoft, radius.lg)]}>
      <AppIcon name={iconName} size={20} color={colors.primary}/>
    </View>) : undefined;
    const titleWithMeta = title;
    const subtitleWithMeta = subtitle
        ? `${subtitle}${meta ? ` • ${meta}` : ''}`
        : meta || undefined;
    return (<AppCard variant="elevated" {...includeWhenPresent("onPress", onPress)} style={[styles.card, createAppCardShadowColorSpread2Style(colors.shadow, shadows.soft), style]}>
      <SafeTextRow title={titleWithMeta} {...includeWhenPresent("subtitle", subtitleWithMeta)} {...includeWhenPresent("left", leftElement)} {...includeWhenPresent("right", right)}/>
    </AppCard>);
}
export default ListItemCard;

