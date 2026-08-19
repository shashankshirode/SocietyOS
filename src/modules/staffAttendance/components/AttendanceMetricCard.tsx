import { Text, View } from "react-native";
import { Colors } from "../../../shared/constants/colors";
import { styles, createViewBorderColorBackgroundColorStyle, createTextColorStyle } from "../styles/components/AttendanceMetricCard.styles";
interface AttendanceMetricCardProps {
    label: string;
    value: string | number;
    subtitle?: string;
    type?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}
export function AttendanceMetricCard({ label, value, subtitle, type = 'neutral' }: AttendanceMetricCardProps) {
    const getBorderColor = () => {
        switch (type) {
            case 'success': return Colors.success;
            case 'warning': return Colors.warning;
            case 'danger': return Colors.danger;
            case 'info': return Colors.info;
            default: return Colors.border;
        }
    };
    const getBgColor = () => {
        switch (type) {
            case 'success': return Colors.successLight;
            case 'warning': return Colors.warningLight;
            case 'danger': return Colors.dangerLight;
            case 'info': return Colors.infoLight;
            default: return Colors.white;
        }
    };
    return (<View style={[styles.card, createViewBorderColorBackgroundColorStyle(getBorderColor(), getBgColor())]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, createTextColorStyle(type === 'neutral' ? Colors.textPrimary : getBorderColor())]}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>);
}

