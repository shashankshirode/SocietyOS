import { StyleProp, Text, View, ViewStyle } from "react-native";
import { Colors } from "../theme";
import { styles } from "./styles/AppBadge.styles";
type AppBadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type AppBadgeProps = {
    label: string;
    tone?: AppBadgeTone;
    style?: StyleProp<ViewStyle>;
};
export function AppBadge({ label, tone = 'neutral', style }: AppBadgeProps) {
    return (<View style={[styles.badge, toneStyles[tone], style]}>
      <Text style={[styles.label, textStyles[tone]]} numberOfLines={1}>
        {label}
      </Text>
    </View>);
}
const toneStyles: Record<AppBadgeTone, ViewStyle> = {
    neutral: { backgroundColor: Colors.neutralSoft },
    primary: { backgroundColor: Colors.primarySoft },
    success: { backgroundColor: Colors.successSoft },
    warning: { backgroundColor: Colors.warningSoft },
    danger: { backgroundColor: Colors.dangerSoft },
    info: { backgroundColor: Colors.infoSoft },
};
const textStyles: Record<AppBadgeTone, {
    color: string;
}> = {
    neutral: { color: Colors.neutral },
    primary: { color: Colors.primary },
    success: { color: Colors.success },
    warning: { color: Colors.warning },
    danger: { color: Colors.danger },
    info: { color: Colors.info },
};
export default AppBadge;

