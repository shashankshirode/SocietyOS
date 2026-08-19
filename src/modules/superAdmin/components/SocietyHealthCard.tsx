import { Text, View } from "react-native";
import { Colors } from "../../../shared/constants/colors";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import type { SocietyHealthRow } from "../../../shared/types/platformAnalytics.types";
import { styles, createViewBorderColorStyle, createTextColorStyle } from "../styles/components/SocietyHealthCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface SocietyHealthCardProps {
    health: SocietyHealthRow;
}
export function SocietyHealthCard({ health }: SocietyHealthCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const getScoreColor = () => {
        if (health.overallHealthScore >= 85)
            return Colors.success;
        if (health.overallHealthScore >= 70)
            return Colors.warning;
        return Colors.danger;
    };
    return (<AppCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleCol}>
          <Text style={styles.name}>{health.societyName}</Text>
          <Text style={styles.city}>{health.city}</Text>
        </View>
        <View style={[styles.scoreCircle, createViewBorderColorStyle(getScoreColor())]}>
          <Text style={[styles.scoreVal, createTextColorStyle(getScoreColor())]}>
            {health.overallHealthScore}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.label}>{localizedUiText.m_94232e323cb9}</Text>
          <StatusBadge status={health.riskLevel} moduleType="platform"/>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{localizedUiText.m_9a76950ed0b4}</Text>
          <Text style={styles.weakestText}>{health.weakestDimension}</Text>
        </View>
        {health.recommendedAction && (<View style={styles.actionBox}>
            <Text style={styles.actionText}>{localizedUiText.m_7d9fda4ea853}{health.recommendedAction}
            </Text>
          </View>)}
      </View>
    </AppCard>);
}

