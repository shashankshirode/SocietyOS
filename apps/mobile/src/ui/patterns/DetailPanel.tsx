import React from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { SafeText } from "../../shared/components/SafeText";
import { AppIconBubble } from "../../shared/icons/AppIconBubble";
import type { AppIconName } from "../../shared/icons/icon.types";
import { StatusPill } from "../../shared/components/StatusPill";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createAnimatedViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle, createAnimatedViewBorderBottomColorStyle, createViewBackgroundColorBorderColorStyle2, createScrollViewBackgroundColorStyle } from "./styles/DetailPanel.styles";
export interface DetailField {
    label: string;
    value: string;
    icon?: AppIconName;
}
export interface DetailAction {
    id: string;
    label: string;
    icon: AppIconName;
    variant?: 'primary' | 'danger' | 'outline';
    onPress: () => void;
}
interface DetailHeaderProps {
    title: string;
    subtitle?: string;
    status?: string;
    statusTone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    icon?: AppIconName;
    tint?: string;
    tintSoft?: string;
}
function DetailHeader({ title, subtitle, status, statusTone, icon, tint, tintSoft }: DetailHeaderProps) {
    const { colors } = useAppTheme();
    const accentColor = tint ?? colors.primary;
    const softColor = tintSoft ?? colors.primarySoft;
    return (<Animated.View entering={FadeInDown.duration(350)} style={[styles.headerCard, createAnimatedViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
      <View style={styles.headerTop}>
        {icon && (<AppIconBubble name={icon} size={48} iconSize={24} color={accentColor} backgroundColor={softColor}/>)}
        <View style={styles.headerTextArea}>
          <SafeText variant="h2" color="primary" numberOfLines={2}>{title}</SafeText>
          {subtitle && <SafeText variant="caption" color="secondary" numberOfLines={2}>{subtitle}</SafeText>}
        </View>
        {status && <StatusPill label={status} {...includeWhenPresent("tone", statusTone)}/>}
      </View>
    </Animated.View>);
}
function FieldGrid({ fields }: {
    fields: DetailField[];
}) {
    const { colors } = useAppTheme();
    return (<View style={[styles.fieldGrid, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
      {fields.map((field, i) => (<Animated.View key={field.label} entering={FadeInRight.delay(i * 50).duration(300)} style={[styles.fieldRow, i < fields.length - 1 && createAnimatedViewBorderBottomColorStyle(colors.border)]}>
          {field.icon && <AppIconBubble name={field.icon} size={28} iconSize={14} color={colors.textSecondary} backgroundColor={colors.surfaceElevated}/>}
          <View style={styles.fieldText}>
            <SafeText variant="caption" color="muted">{field.label}</SafeText>
            <SafeText variant="body" color="primary">{field.value}</SafeText>
          </View>
        </Animated.View>))}
    </View>);
}
function ActionBar({ actions }: {
    actions: DetailAction[];
}) {
    const { colors } = useAppTheme();
    return (<View style={styles.actionBar}>
      {actions.map((action) => {
            const isPrimary = action.variant === 'primary' || !action.variant;
            const isDanger = action.variant === 'danger';
            const bg = isPrimary ? colors.primary : isDanger ? colors.danger : 'transparent';
            const fg = isPrimary || isDanger ? '#FFFFFF' : colors.primary;
            const borderColor = isPrimary || isDanger ? 'transparent' : colors.border;
            return (<Animated.View key={action.id} entering={FadeInDown.delay(100).duration(300)} style={styles.animatedViewFlexMinWidth}>
            <View style={[styles.actionBtn, createViewBackgroundColorBorderColorStyle2(bg, borderColor)]} accessibilityRole="button" onTouchEnd={action.onPress}>
              <AppIconBubble name={action.icon} size={20} iconSize={12} color={fg} backgroundColor="transparent"/>
              <SafeText variant="caption" style={createSafeTextColorStyle(fg)}>{action.label}</SafeText>
            </View>
          </Animated.View>);
        })}
    </View>);
}
export interface DetailPanelProps {
    title: string;
    subtitle?: string;
    status?: string;
    statusTone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    icon?: AppIconName;
    fields?: DetailField[];
    actions?: DetailAction[];
    tint?: string;
    tintSoft?: string;
    children?: React.ReactNode;
    style?: ViewStyle;
    testID?: string;
}
export function DetailPanel({ title, subtitle, status, statusTone, icon, fields = [], actions = [], tint, tintSoft, children, style, testID, }: DetailPanelProps) {
    const { colors } = useAppTheme();
    return (<ScrollView style={[styles.root, createScrollViewBackgroundColorStyle(colors.background), style]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} {...includeWhenPresent("testID", testID)}>
      <DetailHeader title={title} {...includeWhenPresent("subtitle", subtitle)} {...includeWhenPresent("status", status)} {...includeWhenPresent("statusTone", statusTone)} {...includeWhenPresent("icon", icon)} {...includeWhenPresent("tint", tint)} {...includeWhenPresent("tintSoft", tintSoft)}/>
      {fields.length > 0 && <FieldGrid fields={fields}/>}
      {children}
      {actions.length > 0 && <ActionBar actions={actions}/>}
    </ScrollView>);
}

