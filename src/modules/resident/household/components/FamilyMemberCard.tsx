import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusBadge, getKycStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import type { FamilyMember } from "../data/residentHousehold.types";
import { t } from "./householdComponentUtils";
import { ResidentDisplayName } from "../../../../ui/typography/ResidentDisplayName";
import { styles, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "../styles/components/FamilyMemberCard.styles";
type FamilyMemberCardProps = {
    member: FamilyMember;
    onPress: (member: FamilyMember) => void;
};
export function FamilyMemberCard({ member, onPress }: FamilyMemberCardProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const relationLabel = t(messages, `resident.family.relations.${member.relationToOwner}`);
    const accessLabel = t(messages, `resident.family.accessStatus.${member.accessStatus}`);
    return (<Pressable style={[styles.card, createPressableBackgroundColorBorderColorStyle(colors.surface, colors.border)]} onPress={() => onPress(member)} accessibilityRole="button" accessibilityLabel={t(messages, 'resident.accessibility.household.openFamilyMember')}>
      <View style={[styles.iconWrap, createViewBackgroundColorStyle(colors.primarySoft)]}>
        <Ionicons name={member.isMinor ? 'happy-outline' : 'person-outline'} size={20} color={colors.primary}/>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <ResidentDisplayName displayName={member.fullName} variant="bodyStrong" color="primary" style={styles.residentDisplayNameFlexShrink}/>
          {member.isEmergencyContact ? (<StatusBadge label={t(messages, 'resident.family.flags.emergencyContact')} type="danger"/>) : null}
        </View>
        <SafeText variant="caption" color="secondary">{relationLabel}</SafeText>
        <SafeText variant="tiny" color="muted">{member.phoneNumber || t(messages, 'resident.family.fields.phoneNotLinked')}</SafeText>
      </View>
      <StatusBadge label={accessLabel} type={getKycStatusBadgeType(member.accessStatus)}/>
    </Pressable>);
}

