import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { AppCard } from "../../../shared/cards/AppCard";
import type { ModuleAdoptionRow } from "../../../shared/types/platformAnalytics.types";
import { styles, createTextColorStyle } from "../styles/components/ModuleAdoptionCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface ModuleAdoptionCardProps {
    adoption: ModuleAdoptionRow;
}
export function ModuleAdoptionCard({ adoption }: ModuleAdoptionCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const getTrendIcon = () => {
        if (adoption.trendPlaceholder === 'UP')
            return 'trending-up';
        if (adoption.trendPlaceholder === 'DOWN')
            return 'trending-down';
        return 'remove';
    };
    const getTrendColor = () => {
        if (adoption.trendPlaceholder === 'UP')
            return Colors.success;
        if (adoption.trendPlaceholder === 'DOWN')
            return Colors.danger;
        return Colors.textMuted;
    };
    return (<AppCard style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{adoption.moduleName}</Text>
        <View style={styles.trendRow}>
          <Ionicons name={getTrendIcon()} size={16} color={getTrendColor()}/>
          <Text style={[styles.percentage, createTextColorStyle(getTrendColor())]}>
            {adoption.adoptionPercentage}%
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.col}>
          <Text style={styles.label}>{localizedUiText.m_92c1cdfdf4cb}</Text>
          <Text style={styles.value}>{adoption.enabledSocieties}{" " + localizedUiText.m_5fd744dc0753}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>{localizedUiText.m_92340695899b}</Text>
          <Text style={styles.value}>{adoption.activeSocieties}{" " + localizedUiText.m_5fd744dc0753}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>{localizedUiText.m_05b7906ca4ac}</Text>
          <Text style={styles.value}>{adoption.usageCount}</Text>
        </View>
      </View>
    </AppCard>);
}

