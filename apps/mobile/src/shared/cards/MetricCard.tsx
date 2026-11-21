import { StyleProp, Text, View, ViewStyle } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { AppCard } from "./AppCard";
import { AppIcon } from "../icons/AppIcon";
import { AppIconName } from "../icons/icon.types";
import { styles, createTextColorStyle, createViewBackgroundColorStyle, createTextColorStyle2, createTextColorStyle3 } from "./styles/MetricCard.styles";
export type MetricCardTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type MetricCardProps = {
    label: string;
    value: string | number;
    helperText?: string;
    iconName?: AppIconName;
    tone?: MetricCardTone;
    style?: StyleProp<ViewStyle>;
};
export function MetricCard({ label, value, helperText, iconName, tone = 'primary', style, }: MetricCardProps) {
    const { colors } = useAppTheme();
    const toneColors: Record<MetricCardTone, string> = {
        primary: colors.primary,
        success: colors.success,
        warning: colors.warning,
        danger: colors.danger,
        info: colors.info,
        neutral: colors.textSecondary,
    };
    const color = toneColors[tone];
    return (<AppCard style={[styles.card, style]}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, createTextColorStyle(colors.textSecondary)]} numberOfLines={2}>
          {label}
        </Text>
        {iconName ? (<View style={[styles.iconCircle, createViewBackgroundColorStyle(`${color}18`)]}>
            <AppIcon name={iconName} size={16} color={color}/>
          </View>) : null}
      </View>
      <Text style={[styles.value, createTextColorStyle2(color)]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
        {value}
      </Text>
      {helperText ? (<Text style={[styles.helperText, createTextColorStyle3(colors.textMuted)]} numberOfLines={2}>
          {helperText}
        </Text>) : null}
    </AppCard>);
}
export default MetricCard;

