import { Text } from "react-native";
import { AppCard } from "../../../shared/cards/AppCard";
import { Colors } from "../../../shared/constants/colors";
import { styles, createTextColorStyle } from "../styles/components/HardwareMetricCard.styles";
interface MetricProps {
    label: string;
    value: string | number;
    subtext?: string;
    color?: string;
}
export function HardwareMetricCard({ label, value, subtext, color = Colors.primary }: MetricProps) {
    return (<AppCard style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, createTextColorStyle(color)]}>{value}</Text>
      {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
    </AppCard>);
}

