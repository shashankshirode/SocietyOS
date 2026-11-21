import { Text, View, ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { AppCard } from "../../../shared/cards/AppCard";
import { styles, createTextColorStyle } from "../styles/components/PlatformMetricCard.styles";
interface PlatformMetricCardProps {
    label: string;
    value: string | number;
    icon: keyof typeof Ionicons.glyphMap;
    trend?: string;
    trendType?: 'up' | 'down' | 'neutral';
    style?: ViewStyle;
}
export function PlatformMetricCard({ label, value, icon, trend, trendType = 'neutral', style }: PlatformMetricCardProps) {
    const getTrendColor = () => {
        if (trendType === 'up')
            return Colors.success;
        if (trendType === 'down')
            return Colors.danger;
        return Colors.textMuted;
    };
    return (<AppCard style={[styles.card, style]}>
      <View style={styles.header}>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={20} color={Colors.primary}/>
        </View>
      </View>
      <Text style={styles.value}>{value}</Text>
      {trend && (<View style={styles.trendRow}>
          <Ionicons name={trendType === 'up' ? 'trending-up' : trendType === 'down' ? 'trending-down' : 'remove'} size={16} color={getTrendColor()}/>
          <Text style={[styles.trendText, createTextColorStyle(getTrendColor())]}>{trend}</Text>
        </View>)}
    </AppCard>);
}

