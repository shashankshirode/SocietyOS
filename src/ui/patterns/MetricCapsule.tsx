import { View, ViewStyle } from "react-native";
import Animated, { FadeInRight, FadeInDown } from "react-native-reanimated";
import { SafeText } from "../../shared/components/SafeText";
import { AppIconBubble } from "../../shared/icons/AppIconBubble";
import type { AppIconName } from "../../shared/icons/icon.types";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createAnimatedViewBackgroundColorBorderColorStyle } from "./styles/MetricCapsule.styles";
interface MetricCapsuleProps {
    icon: AppIconName;
    label: string;
    value: string | number;
    detail?: string;
    tint?: string;
    tintSoft?: string;
    index?: number;
    style?: ViewStyle;
}
export function MetricCapsule({ icon, label, value, detail, tint, tintSoft, index = 0, style }: MetricCapsuleProps) {
    const { colors } = useAppTheme();
    const accentColor = tint ?? colors.primary;
    const softColor = tintSoft ?? colors.primarySoft;
    return (<Animated.View entering={FadeInRight.delay(index * 80).duration(400).springify()} style={[styles.capsule, createAnimatedViewBackgroundColorBorderColorStyle(colors.surface, colors.border), style]}>
      <AppIconBubble name={icon} size={36} iconSize={18} color={accentColor} backgroundColor={softColor}/>
      <View style={styles.capsuleBody}>
        <SafeText variant="h3" color="primary" numberOfLines={1}>{String(value)}</SafeText>
        <SafeText variant="caption" color="secondary" numberOfLines={1}>{label}</SafeText>
        {detail ? <SafeText variant="tiny" color="muted" numberOfLines={1}>{detail}</SafeText> : null}
      </View>
    </Animated.View>);
}
interface HeroMetricsProps {
    metrics: Omit<MetricCapsuleProps, 'index'>[];
}
export function HeroMetrics({ metrics }: HeroMetricsProps) {
    return (<Animated.View entering={FadeInDown.delay(200).duration(400).springify()} style={styles.metricsRow}>
      {metrics.map((m, i) => (<MetricCapsule key={i} {...m} index={i} style={styles.metricItem}/>))}
    </Animated.View>);
}

