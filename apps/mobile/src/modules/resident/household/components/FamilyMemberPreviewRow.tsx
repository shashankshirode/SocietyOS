import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "./householdComponentUtils";
import type { FamilyMemberSummary } from "../data/residentHousehold.types";
import { styles, createPressableBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3 } from "../styles/components/FamilyMemberPreviewRow.styles";
type FamilyMemberPreviewRowProps = {
    member: FamilyMemberSummary;
    onPress?: () => void;
};
export function FamilyMemberPreviewRow({ member, onPress }: FamilyMemberPreviewRowProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const initials = member.fullName.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    return (<Pressable onPress={onPress} style={[styles.row, createPressableBorderColorStyle(colors.border)]}> 
      <View style={[styles.avatar, createViewBackgroundColorStyle(colors.primarySoft)]}> 
        <SafeText variant="bodyStrong" color="primary">{initials}</SafeText>
      </View>
      <View style={styles.info}>
        <SafeText variant="bodyStrong" color="primary">{member.fullName}</SafeText>
        <SafeText variant="caption" color="secondary">{`${member.relationship} · ${member.statusLabel}`}</SafeText>
        <View style={styles.badgesRow}>
          {member.isEmergencyContact ? (<View style={[styles.badge, createViewBackgroundColorStyle2(colors.warningSoft)]}> 
              <SafeText variant="tiny" color="warning">{t(messages, 'resident.household.family.emergencyBadge')}</SafeText>
            </View>) : null}
          <View style={[styles.badge, createViewBackgroundColorStyle3(colors.backgroundSoft)]}> 
            <SafeText variant="tiny" color="secondary">{member.accessLabel}</SafeText>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary}/>
    </Pressable>);
}

