import { Text, View } from "react-native";
import { AppCard } from "../cards/AppCard";
import { AppIconBubble } from "../icons/AppIconBubble";
import type { AppIconName } from "../icons/icon.types";
import { useAppTheme } from "../theme/useAppTheme";
import { SlideUpView } from "./SlideUpView";
import { styles, createTextColorStyle, createTextColorStyle2, createTextColorStyle3 } from "./styles/AnimatedMetricCard.styles";
type AnimatedMetricCardProps = {
    label: string;
    value: string | number;
    icon?: AppIconName;
    detail?: string;
    delay?: number;
};
export function AnimatedMetricCard({ label, value, icon = 'info', detail, delay = 0 }: AnimatedMetricCardProps) {
    const { colors } = useAppTheme();
    return (<SlideUpView delay={delay} style={styles.container}>
      <AppCard variant="elevated" style={styles.card}>
        <View style={styles.row}>
          <View style={styles.copy}>
            <Text style={[styles.value, createTextColorStyle(colors.textPrimary)]}>{value}</Text>
            <Text style={[styles.label, createTextColorStyle2(colors.textSecondary)]}>{label}</Text>
            {detail ? <Text style={[styles.detail, createTextColorStyle3(colors.textMuted)]}>{detail}</Text> : null}
          </View>
          <AppIconBubble name={icon} size={44} iconSize={21}/>
        </View>
      </AppCard>
    </SlideUpView>);
}

