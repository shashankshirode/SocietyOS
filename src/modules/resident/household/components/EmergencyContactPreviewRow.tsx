import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "./householdComponentUtils";
import type { EmergencyContactSummary } from "../data/residentHousehold.types";
import { styles, createViewBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "../styles/components/EmergencyContactPreviewRow.styles";
type EmergencyContactPreviewRowProps = {
    contact: EmergencyContactSummary;
};
export function EmergencyContactPreviewRow({ contact }: EmergencyContactPreviewRowProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const initials = contact.name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    return (<View style={[styles.row, createViewBorderColorStyle(colors.border)]}> 
      <View style={[styles.avatar, createViewBackgroundColorStyle(colors.warningSoft)]}> 
        <SafeText variant="bodyStrong" color="warning">{initials}</SafeText>
      </View>
      <View style={styles.info}>
        <SafeText variant="bodyStrong" color="primary">{contact.name}</SafeText>
        <SafeText variant="caption" color="secondary">{contact.relationship}</SafeText>
        <View style={styles.metaRow}>
          <SafeText variant="tiny" color="secondary">{contact.verificationLabel}</SafeText>
          {contact.isPrimary ? (<View style={[styles.badge, createViewBackgroundColorStyle2(colors.primarySoft)]}> 
              <SafeText variant="tiny" color="primary">{t(messages, 'resident.household.emergency.primary')}</SafeText>
            </View>) : null}
        </View>
      </View>
      <Ionicons name="call-outline" size={16} color={colors.primary}/>
    </View>);
}

