import { useCallback } from "react";
import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { AppAlert } from "../../../../../ui/modal/AppAlert";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useMessages } from "../../../../../shared/constants/useMessages";
import { useSosResidenceContext } from "../../hooks/useSosResidenceContext";
import { useSosEmergencyContacts } from "../../hooks/useSosEmergencyContacts";
import { useSosPermissions } from "../../hooks/useSosPermissions";
import type { SosEmergencyContact } from "../../data/sosEmergencyContact.types";
import type { SosResponsePlanStackParamList } from "../../../../../app/navigation/navigation.types";
import { styles, createSafeTextColorStyle, createPressableBackgroundColorBorderColorOpacityStyle, createViewBackgroundColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle2, createScrollViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7 } from "../../styles/screens/sos/EmergencyContactsScreen.styles";
type Props = NativeStackScreenProps<SosResponsePlanStackParamList, 'EmergencyContacts'>;
const CATEGORY_COLORS: Record<string, string> = {
    familyMember: '#3B82F6',
    trustedResident: '#8B5CF6',
    externalContact: '#F97316',
    medicalProfessional: '#EF4444',
    serviceProvider: '#6B7280',
};
function ContactCard({ contact, onPress, onRemove, canManage, colors }: {
    contact: SosEmergencyContact;
    onPress: () => void;
    onRemove: () => void;
    canManage: boolean;
    colors: ReturnType<typeof useAppTheme>['colors'];
}) {
    const localizedUiText = useMessages().uiLiterals;
    const color = CATEGORY_COLORS[contact.category] ?? '#6B7280';
    const initials = contact.displayName.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase()).join('');
    return (<Pressable onPress={onPress} style={[styles.contactCard, createPressableBackgroundColorBorderColorOpacityStyle(colors.surface, colors.border, contact.active ? 1 : 0.5)]} accessibilityRole="button" accessibilityLabel={`${contact.displayName}, ${contact.relationship}. ${contact.verified ? localizedUiText.m_4f7838402f37 : localizedUiText.m_151339072593}`}>
      <View style={[styles.contactAvatar, createViewBackgroundColorStyle(color + '18')]}>
        <SafeText variant="caption" style={[styles.contactInitials, createSafeTextColorStyle2(color)]}>{initials}</SafeText>
      </View>
      <View style={styles.contactContent}>
        <SafeText variant="bodyStrong" style={[styles.contactName, createSafeTextColorStyle3(colors.textPrimary)]} numberOfLines={1}>
          {contact.displayName}
        </SafeText>
        <SafeText variant="tiny" style={createSafeTextColorStyle(colors.textSecondary)} numberOfLines={1}>
          {contact.relationship} · {contact.phoneMasked}
        </SafeText>
      </View>
      <View style={styles.contactBadges}>
        {contact.verified && (<Ionicons name="checkmark-circle" size={16} color="#10B981"/>)}
        {!contact.active && (<View style={[styles.inactiveBadge, styles.viewBackgroundColor]}>
            <SafeText variant="tiny" style={styles.safeTextColorFontWeight}>{localizedUiText.m_ac7c949f1211}</SafeText>
          </View>)}
        {contact.consentStatus === 'pending' && (<View style={[styles.pendingBadge, styles.viewBackgroundColor2]}>
            <SafeText variant="tiny" style={styles.safeTextColorFontWeight2}>{localizedUiText.m_331551b0de41}</SafeText>
          </View>)}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textSecondary}/>
    </Pressable>);
}
export function EmergencyContactsScreen({ navigation }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const context = useSosResidenceContext();
    const { contacts, isLoading, removeContact } = useSosEmergencyContacts(context);
    const { canManageContacts } = useSosPermissions();
    const contactMsg = messages.resident?.emergency?.sosContacts;
    const handleRemove = useCallback((contact: SosEmergencyContact) => {
        AppAlert.alert(contactMsg?.removeConfirmTitle ?? String(localizedUiText.m_51b075701e6d), contactMsg?.removeConfirmMessage ?? String(localizedUiText.m_197277c8ce26), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            { text: String(localizedUiText.m_c3812fc4acb8), style: 'destructive', onPress: () => removeContact(contact.id) },
        ]);
    }, [removeContact, contactMsg, localizedUiText]);
    if (isLoading) {
        return (<View style={[styles.centered, createViewBackgroundColorStyle2(colors.background)]}>
        <ActivityIndicator size="large" color={colors.textSecondary}/>
      </View>);
    }
    const activeContacts = contacts.filter((c) => c.active);
    const inactiveContacts = contacts.filter((c) => !c.active);
    return (<ScrollView style={[styles.container, createScrollViewBackgroundColorStyle(colors.background)]} contentContainerStyle={styles.contentContainer}>
      {canManageContacts && (<Pressable onPress={() => navigation.navigate('AddEmergencyContact')} style={[styles.addButton, styles.pressableBackgroundColor]} accessibilityRole="button" accessibilityLabel={contactMsg?.add ?? localizedUiText.m_0fb321a01a06}>
          <Ionicons name="add" size={20} color="#FFFFFF"/>
          <SafeText variant="bodyStrong" style={styles.addButtonText}>
            {contactMsg?.add ?? localizedUiText.m_0fb321a01a06}
          </SafeText>
        </Pressable>)}

      {contacts.length === 0 && (<View style={[styles.emptyCard, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
          <Ionicons name="people-outline" size={40} color={colors.textSecondary}/>
          <SafeText variant="bodyStrong" style={[styles.emptyTitle, createSafeTextColorStyle4(colors.textPrimary)]}>
            {contactMsg?.noContactsTitle ?? localizedUiText.m_8c702063c749}
          </SafeText>
          <SafeText variant="caption" style={[styles.emptyMessage, createSafeTextColorStyle5(colors.textSecondary)]}>
            {contactMsg?.noContactsMessage ?? localizedUiText.m_53c6d112404c}
          </SafeText>
          <SafeText variant="tiny" style={[styles.emptyRecommendation, styles.safeTextColor]}>
            {contactMsg?.noContactsRecommendation ?? localizedUiText.m_c010c0b5ce76}
          </SafeText>
        </View>)}

      {activeContacts.length > 0 && (<View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle6(colors.textPrimary)]}>
            {`${contactMsg?.active ?? localizedUiText.m_92340695899b} (${activeContacts.length})`}
          </SafeText>
          {activeContacts.map((contact) => (<ContactCard key={contact.id} contact={contact} onPress={() => navigation.navigate('EmergencyContactDetails', { contactId: contact.id })} onRemove={() => handleRemove(contact)} canManage={canManageContacts} colors={colors}/>))}
        </View>)}

      {inactiveContacts.length > 0 && (<View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle7(colors.textSecondary)]}>
            {`${contactMsg?.inactive ?? localizedUiText.m_ac7c949f1211} (${inactiveContacts.length})`}
          </SafeText>
          {inactiveContacts.map((contact) => (<ContactCard key={contact.id} contact={contact} onPress={() => navigation.navigate('EmergencyContactDetails', { contactId: contact.id })} onRemove={() => handleRemove(contact)} canManage={canManageContacts} colors={colors}/>))}
        </View>)}
    </ScrollView>);
}
