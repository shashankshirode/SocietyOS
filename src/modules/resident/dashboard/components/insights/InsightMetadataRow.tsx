import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../../shared/constants/useMessages";
import { t } from "../../../household/components/householdComponentUtils";
import { styles, createViewBackgroundColorStyle, createSafeTextColorStyle, createViewBackgroundColorStyle2, createSafeTextColorStyle2 } from "../../styles/components/insights/InsightMetadataRow.styles";
export interface InsightMetadataRowProps {
    areaLabel?: string;
    freshnessLabel?: string;
}
export function InsightMetadataRow({ areaLabel, freshnessLabel }: InsightMetadataRowProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    if (!areaLabel && !freshnessLabel) {
        return null;
    }
    return (<View style={styles.container}>
      {areaLabel ? (<View style={[styles.item, createViewBackgroundColorStyle(colors.surfaceMuted)]}>
          <Ionicons name="location-outline" size={12} color={colors.textSecondary}/>
          <SafeText variant="tiny" style={[styles.text, createSafeTextColorStyle(colors.textSecondary)]} numberOfLines={1} ellipsizeMode="tail">
            {`${t(messages, 'resident.dashboard.insights.areaLabel')} ${areaLabel}`}
          </SafeText>
        </View>) : null}

      {freshnessLabel ? (<View style={[styles.item, createViewBackgroundColorStyle2(colors.surfaceMuted)]}>
          <Ionicons name="time-outline" size={12} color={colors.textSecondary}/>
          <SafeText variant="tiny" style={[styles.text, createSafeTextColorStyle2(colors.textSecondary)]} numberOfLines={1} ellipsizeMode="tail">
            {freshnessLabel}
          </SafeText>
        </View>) : null}
    </View>);
}
export default InsightMetadataRow;

