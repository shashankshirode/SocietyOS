import { View, Pressable } from "react-native";
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { SafeText } from "../../shared/components/SafeText";
import { AppIconBubble } from "../../shared/icons/AppIconBubble";
import type { AppIconName } from "../../shared/icons/icon.types";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "./styles/QuickActionRail.styles";
export interface QuickActionItem {
    id: string;
    icon: AppIconName;
    label: string;
    description?: string;
    badge?: string;
    onPress: () => void;
}
interface QuickActionRailProps {
    actions: QuickActionItem[];
    columns?: 2 | 3;
    tint?: string;
    tintSoft?: string;
}
function ActionTile({ action, index, tint, tintSoft }: {
    action: QuickActionItem;
    index: number;
    tint?: string;
    tintSoft?: string;
}) {
    const { colors } = useAppTheme();
    const accentColor = tint ?? colors.primary;
    const softColor = tintSoft ?? colors.primarySoft;
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));
    return (<Animated.View entering={FadeInUp.delay(index * 60).duration(350).springify()} style={[animatedStyle, styles.tileWrapper]}>
      <Pressable onPressIn={() => { scale.value = withSpring(0.96); }} onPressOut={() => { scale.value = withSpring(1); }} onPress={action.onPress} accessibilityRole="button" accessibilityLabel={action.label} style={[styles.tile, createPressableBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
        <View style={styles.tileIconRow}>
          <AppIconBubble name={action.icon} size={40} iconSize={20} color={accentColor} backgroundColor={softColor}/>
          {action.badge && (<View style={[styles.badgeTag, createViewBackgroundColorStyle(accentColor)]}>
              <SafeText variant="tiny" style={styles.badgeText}>{action.badge}</SafeText>
            </View>)}
        </View>
        <SafeText variant="bodyStrong" color="primary" numberOfLines={2}>{action.label}</SafeText>
        {action.description && (<SafeText variant="caption" color="muted" numberOfLines={2}>{action.description}</SafeText>)}
      </Pressable>
    </Animated.View>);
}
export function QuickActionRail({ actions, columns = 2, tint, tintSoft }: QuickActionRailProps) {
    return (<View style={[styles.grid, columns === 3 && styles.grid3]}>
      {actions.map((action, i) => (<ActionTile key={action.id} action={action} index={i} {...includeWhenPresent("tint", tint)} {...includeWhenPresent("tintSoft", tintSoft)}/>))}
    </View>);
}

