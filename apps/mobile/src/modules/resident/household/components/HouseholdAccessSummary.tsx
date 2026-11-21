import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "./householdComponentUtils";
import type { HouseholdSummary } from "../data/residentHousehold.types";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "../styles/components/HouseholdAccessSummary.styles";
type HouseholdAccessSummaryProps = {
    summary: HouseholdSummary;
};
export function HouseholdAccessSummary({ summary }: HouseholdAccessSummaryProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}> 
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, createViewBackgroundColorStyle(colors.primarySoft)]}> 
          <Ionicons name="key-outline" size={18} color={colors.primary}/>
        </View>
        <View style={styles.headerText}>
          <SafeText variant="bodyStrong" color="primary">{t(messages, 'resident.household.access.title')}</SafeText>
          <SafeText variant="caption" color="secondary">{`${summary.accessSummary.activeAccessCount} ${t(messages, 'resident.household.access.active')}`}</SafeText>
        </View>
      </View>
      <View style={styles.list}>
        {summary.accessSummary.permissions.map((permission) => (<View key={permission.label} style={styles.item}> 
            <SafeText variant="caption" color="secondary">{permission.label}</SafeText>
            <SafeText variant="bodyStrong" color="primary">{permission.value}</SafeText>
          </View>))}
      </View>
    </View>);
}

