import { View, ViewStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle, createAnimatedViewBorderRightColorStyle } from "./styles/StatRow.styles";
export interface StatItem {
    label: string;
    value: string | number;
    change?: string;
    changeTone?: 'up' | 'down' | 'neutral';
}
interface StatRowProps {
    title?: string;
    stats: StatItem[];
    style?: ViewStyle;
}
export function StatRow({ title, stats, style }: StatRowProps) {
    const { colors } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border), style]}>
      {title && <SafeText variant="bodyStrong" color="secondary" style={styles.title}>{title}</SafeText>}
      <View style={styles.row}>
        {stats.map((stat, i) => (<Animated.View key={stat.label} entering={FadeInDown.delay(i * 60).duration(300)} style={[styles.statCell, i < stats.length - 1 && createAnimatedViewBorderRightColorStyle(colors.border)]}>
            <SafeText variant="h2" color="primary" style={styles.value}>{String(stat.value)}</SafeText>
            <SafeText variant="caption" color="muted" numberOfLines={1}>{stat.label}</SafeText>
            {stat.change && (<SafeText variant="tiny" style={createSafeTextColorStyle(stat.changeTone === 'up' ? colors.success : stat.changeTone === 'down' ? colors.danger : colors.textMuted)}>
                {stat.changeTone === 'up' ? '↑ ' : stat.changeTone === 'down' ? '↓ ' : ''}{stat.change}
              </SafeText>)}
          </Animated.View>))}
      </View>
    </View>);
}

