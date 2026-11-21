import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "./householdComponentUtils";
import type { HouseholdSummary } from "../data/residentHousehold.types";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3 } from "../styles/components/HouseholdIdentityCard.styles";
type HouseholdIdentityCardProps = {
    summary: HouseholdSummary;
};
export function HouseholdIdentityCard({ summary }: HouseholdIdentityCardProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const occupancyLabel = t(messages, `resident.household.occupancy.${summary.occupancyStatus}`);
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}> 
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, createViewBackgroundColorStyle(colors.primarySoft)]}> 
          <Ionicons name="home-outline" size={18} color={colors.primary}/>
        </View>
        <View style={styles.headerText}>
          <SafeText variant="bodyStrong" color="primary">{summary.residenceLabel}</SafeText>
          <SafeText variant="caption" color="secondary">{summary.societyName}</SafeText>
        </View>
      </View>

      <View style={styles.identityGrid}>
        <View style={styles.identityItem}>
          <SafeText variant="caption" color="muted">{t(messages, 'resident.household.identity.unit')}</SafeText>
          <SafeText variant="bodyStrong" color="primary">{summary.unitLabel}</SafeText>
        </View>
        <View style={styles.identityItem}>
          <SafeText variant="caption" color="muted">{t(messages, 'resident.household.identity.status')}</SafeText>
          <SafeText variant="bodyStrong" color="primary">{occupancyLabel}</SafeText>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={[styles.metaPill, createViewBackgroundColorStyle2(colors.backgroundSoft)]}> 
          <SafeText variant="tiny" color="secondary">{`${summary.familyMemberCount} ${t(messages, 'resident.household.identity.members')}`}</SafeText>
        </View>
        <View style={[styles.metaPill, createViewBackgroundColorStyle3(colors.backgroundSoft)]}> 
          <SafeText variant="tiny" color="secondary">{summary.residenceContext}</SafeText>
        </View>
      </View>
    </View>);
}

