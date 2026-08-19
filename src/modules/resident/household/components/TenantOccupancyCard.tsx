import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "./householdComponentUtils";
import type { HouseholdSummary, HouseholdOccupancyStatus } from "../data/residentHousehold.types";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "../styles/components/TenantOccupancyCard.styles";
type TenantOccupancyCardProps = {
    summary: HouseholdSummary;
    onManageTenant?: () => void;
    onViewTenant?: () => void;
};
const occupancyIcons: Record<HouseholdOccupancyStatus, keyof typeof Ionicons.glyphMap> = {
    ownerOccupied: 'home-outline',
    tenantOccupied: 'person-outline',
    vacant: 'business-outline',
    mixed: 'people-outline',
    tenantOnboarding: 'sparkles-outline',
    moveOutInProgress: 'exit-outline',
    shortTermRental: 'time-outline',
};
export function TenantOccupancyCard({ summary, onManageTenant, onViewTenant }: TenantOccupancyCardProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const occupancyLabel = t(messages, `resident.household.occupancy.${summary.occupancyStatus}`);
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}> 
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, createViewBackgroundColorStyle(colors.primarySoft)]}> 
          <Ionicons name={occupancyIcons[summary.occupancyStatus]} size={18} color={colors.primary}/>
        </View>
        <View style={styles.headerText}>
          <SafeText variant="bodyStrong" color="primary">{t(messages, 'resident.household.tenant.title')}</SafeText>
          <SafeText variant="caption" color="secondary">{occupancyLabel}</SafeText>
        </View>
      </View>

      {summary.tenantSummary ? (<View style={styles.tenantBlock}>
          <SafeText variant="bodyStrong" color="primary">{summary.tenantSummary.name}</SafeText>
          <SafeText variant="caption" color="secondary">{`${t(messages, 'resident.household.tenant.moveIn')}: ${summary.tenantSummary.moveInLabel}`}</SafeText>
          <SafeText variant="caption" color="secondary">{`${t(messages, 'resident.household.tenant.verification')}: ${summary.tenantSummary.verificationLabel}`}</SafeText>
        </View>) : (<SafeText variant="caption" color="secondary">{t(messages, 'resident.household.tenant.emptyState')}</SafeText>)}

      <View style={styles.actionsRow}>
        {onViewTenant ? (<AppButton title={t(messages, 'resident.household.tenant.view')} onPress={onViewTenant} variant="outline" size="sm"/>) : null}
        {onManageTenant ? (<AppButton title={t(messages, 'resident.household.tenant.manage')} onPress={onManageTenant} variant="primary" size="md" accessibilityLabel={t(messages, 'resident.household.tenant.manage')}/>) : null}
      </View>
    </View>);
}

