import React from "react";
import { View, Pressable, ViewStyle } from "react-native";
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { SafeText } from "../../shared/components/SafeText";
import { AppIconBubble } from "../../shared/icons/AppIconBubble";
import type { AppIconName } from "../../shared/icons/icon.types";
import { StatusPill } from "../../shared/components/StatusPill";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createViewBackgroundColorBorderColorStyle } from "./styles/DataCard.styles";
export interface DataCardProps {
    title: string;
    subtitle?: string;
    meta?: string;
    icon?: AppIconName;
    status?: string;
    statusTone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    trailing?: string;
    trailingCaption?: string;
    onPress?: () => void;
    index?: number;
    style?: ViewStyle;
    testID?: string;
    children?: React.ReactNode;
}
export function DataCard({ title, subtitle, meta, icon, status, statusTone, trailing, trailingCaption, onPress, index = 0, style, testID, children, }: DataCardProps) {
    const { colors } = useAppTheme();
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));
    const content = (<Animated.View entering={FadeInDown.delay(index * 40).duration(300).springify()} style={animatedStyle}>
      <View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border), style]} {...includeWhenPresent("testID", testID)}>
        <View style={styles.row}>
          {icon && (<AppIconBubble name={icon} size={40} iconSize={20} color={colors.primary} backgroundColor={colors.primarySoft}/>)}
          <View style={styles.body}>
            <View style={styles.titleRow}>
              <SafeText variant="bodyStrong" color="primary" numberOfLines={1} style={styles.titleText}>{title}</SafeText>
              {trailing && (<View style={styles.trailingArea}>
                  <SafeText variant="bodyStrong" color="primary">{trailing}</SafeText>
                  {trailingCaption && <SafeText variant="tiny" color="muted">{trailingCaption}</SafeText>}
                </View>)}
            </View>
            {subtitle && <SafeText variant="caption" color="secondary" numberOfLines={2}>{subtitle}</SafeText>}
            {(meta || status) && (<View style={styles.metaRow}>
                {meta && <SafeText variant="tiny" color="muted">{meta}</SafeText>}
                {status && <StatusPill label={status} {...includeWhenPresent("tone", statusTone)}/>}
              </View>)}
          </View>
        </View>
        {children}
      </View>
    </Animated.View>);
    if (!onPress)
        return content;
    return (<Pressable onPress={onPress} onPressIn={() => { scale.value = withSpring(0.97); }} onPressOut={() => { scale.value = withSpring(1); }} accessibilityRole="button">
      {content}
    </Pressable>);
}
export function DataCardList({ children, style }: {
    children: React.ReactNode;
    style?: ViewStyle;
}) {
    return <View style={[styles.list, style]}>{children}</View>;
}

