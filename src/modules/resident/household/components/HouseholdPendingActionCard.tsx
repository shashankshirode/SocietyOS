import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "./householdComponentUtils";
import type { HouseholdPendingAction } from "../data/residentHousehold.types";
import { styles, createViewBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3 } from "../styles/components/HouseholdPendingActionCard.styles";
type HouseholdPendingActionCardProps = {
    action: HouseholdPendingAction;
};
export function HouseholdPendingActionCard({ action }: HouseholdPendingActionCardProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const severityColor = action.severity === 'critical' ? colors.danger : action.severity === 'high' ? colors.warning : colors.primary;
    return (<View style={[styles.card, createViewBorderColorStyle(colors.border)]}> 
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, createViewBackgroundColorStyle(`${severityColor}20`)]}> 
          <Ionicons name="alert-circle-outline" size={18} color={severityColor}/>
        </View>
        <View style={styles.headerText}>
          <SafeText variant="bodyStrong" color="primary">{action.title}</SafeText>
          <SafeText variant="caption" color="secondary">{action.description}</SafeText>
        </View>
      </View>
      <View style={styles.metaRow}>
        <View style={[styles.badge, createViewBackgroundColorStyle2(colors.backgroundSoft)]}> 
          <SafeText variant="tiny" color="secondary">{t(messages, `resident.household.pending.severity.${action.severity}`)}</SafeText>
        </View>
        {action.deadline ? (<View style={[styles.badge, createViewBackgroundColorStyle3(colors.backgroundSoft)]}> 
            <SafeText variant="tiny" color="secondary">{action.deadline}</SafeText>
          </View>) : null}
      </View>
      <AppButton title={action.actionLabel} onPress={action.onPress} variant="outline" size="sm"/>
    </View>);
}

