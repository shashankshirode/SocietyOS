import { useEffect, useState, useCallback } from "react";
import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { AppAlert } from "../../../../../ui/modal/AppAlert";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useMessages } from "../../../../../shared/constants/useMessages";
import { useSosResidenceContext } from "../../hooks/useSosResidenceContext";
import { useSosPermissions } from "../../hooks/useSosPermissions";
import { sosEmergencyContactRepository } from "../../data/sosEmergencyContact.repository";
import { SOS_TYPE_DEFINITIONS } from "../../data/sosTypeDefinitions";
import type { SosEmergencyContact } from "../../data/sosEmergencyContact.types";
import type { SosResponsePlanStackParamList } from "../../../../../app/navigation/navigation.types";
import { formatResidentDate } from "../../../../../core/localization/dateTimeFormatters";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createScrollViewBackgroundColorStyle, createSafeTextColorStyle7, createViewBackgroundColorStyle3, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle8, createViewBackgroundColorBorderColorStyle2, createSafeTextColorStyle9 } from "../../styles/screens/sos/EmergencyContactDetailsScreen.styles";
type Props = NativeStackScreenProps<SosResponsePlanStackParamList, 'EmergencyContactDetails'>;
export function EmergencyContactDetailsScreen({ navigation, route }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const { contactId } = route.params;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const context = useSosResidenceContext();
    const { canManageContacts } = useSosPermissions();
    const [contact, setContact] = useState<SosEmergencyContact | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contactMsg = messages.resident?.emergency?.sosContacts;
    useEffect(() => {
        if (!context)
            return;
        setIsLoading(true);
        sosEmergencyContactRepository.getContact(context, contactId)
            .then((c) => setContact(c ?? null))
            .finally(() => setIsLoading(false));
    }, [context, contactId]);
    const handleRemove = useCallback(() => {
        if (!context)
            return;
        AppAlert.alert(contactMsg?.removeConfirmTitle ?? String(localizedUiText.m_51b075701e6d), contactMsg?.removeConfirmMessage ?? String(localizedUiText.m_197277c8ce26), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_c3812fc4acb8),
                style: 'destructive',
                onPress: async () => {
                    await sosEmergencyContactRepository.removeContact(context, contactId);
                    navigation.goBack();
                },
            },
        ]);
    }, [context, contactId, contactMsg, localizedUiText, navigation]);
    if (isLoading) {
        return <View style={[styles.centered, createViewBackgroundColorStyle(colors.background)]}><ActivityIndicator size="large" color={colors.textSecondary}/></View>;
    }
    if (!contact) {
        return (<View style={[styles.centered, createViewBackgroundColorStyle2(colors.background)]}>
        <SafeText variant="body" style={createSafeTextColorStyle(colors.textSecondary)}>{localizedUiText.m_cd1e1461c07f}</SafeText>
      </View>);
    }
    const initials = contact.displayName.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase()).join('');
    return (<ScrollView style={[styles.container, createScrollViewBackgroundColorStyle(colors.background)]} contentContainerStyle={styles.content}>
      
      <View style={styles.headerSection}>
        <View style={[styles.avatar, styles.viewBackgroundColor]}>
          <SafeText variant="bodyStrong" style={styles.safeTextColorFontSizeFontWeight}>{initials}</SafeText>
        </View>
        <SafeText variant="bodyStrong" style={[styles.name, createSafeTextColorStyle7(colors.textPrimary)]}>{contact.displayName}</SafeText>
        <SafeText variant="caption" style={createSafeTextColorStyle2(colors.textSecondary)}>{contact.relationship}</SafeText>

        <View style={styles.badgeRow}>
          {contact.verified && (<View style={[styles.badge, styles.viewBackgroundColor2]}>
              <Ionicons name="checkmark-circle" size={14} color="#10B981"/>
              <SafeText variant="tiny" style={styles.safeTextColorFontWeight}>{contactMsg?.verified ?? localizedUiText.m_4f7838402f37}</SafeText>
            </View>)}
          <View style={[styles.badge, createViewBackgroundColorStyle3(contact.active ? '#10B981' + '18' : '#6B7280' + '18')]}>
            <SafeText variant="tiny" style={createSafeTextColorStyle3(contact.active ? '#10B981' : '#6B7280')}>
              {contact.active ? (contactMsg?.active ?? localizedUiText.m_92340695899b) : (contactMsg?.inactive ?? localizedUiText.m_ac7c949f1211)}
            </SafeText>
          </View>
        </View>
      </View>

      
      <View style={[styles.detailCard, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
        <DetailRow icon="call" label={localizedUiText.m_63dceb8800b2} value={contact.phoneMasked} colors={colors}/>
        {contact.email && <DetailRow icon="mail" label={localizedUiText.m_969ccbd3cf63} value={contact.email} colors={colors}/>}
        <DetailRow icon="pricetag" label={localizedUiText.m_292c06f0045a} value={contact.category} colors={colors}/>
        <DetailRow icon="layers" label={localizedUiText.m_d60dbba07922} value={`#${contact.priority}`} colors={colors}/>
      </View>

      <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle8(colors.textPrimary)]}>
        {contactMsg?.fieldAvailableFor ?? localizedUiText.m_755d278ba35c}
      </SafeText>
      <View style={styles.sosTypeRow}>
        {SOS_TYPE_DEFINITIONS.map((def) => {
            const active = contact.availableForSosTypes.includes(def.sosType);
            const typeTitle = messages.resident?.emergency?.sosSettings?.types?.[def.sosType]?.title ?? def.sosType;
            return (<View key={def.sosType} style={[styles.sosChip, createViewBackgroundColorBorderColorStyle2(active ? def.color + '18' : colors.surface, active ? def.color : colors.border)]}>
              <Ionicons name={def.icon as keyof typeof Ionicons.glyphMap} size={12} color={active ? def.color : colors.textSecondary}/>
              <SafeText variant="tiny" style={createSafeTextColorStyle4(active ? def.color : colors.textSecondary)}>{typeTitle}</SafeText>
            </View>);
        })}
      </View>

      {canManageContacts && (<Pressable onPress={handleRemove} style={[styles.removeButton, styles.pressableBorderColor]} accessibilityRole="button">
          <Ionicons name="trash" size={18} color="#EF4444"/>
          <SafeText variant="caption" style={styles.safeTextColorFontWeight2}>{localizedUiText.m_51b075701e6d}</SafeText>
        </Pressable>)}

      <SafeText variant="tiny" style={createSafeTextColorStyle5(colors.textSecondary)}>{localizedUiText.m_6b02e0d363a4}{formatResidentDate(contact.createdAt)}{" " + localizedUiText.m_525dce7521c5 + " "}{formatResidentDate(contact.updatedAt)}
      </SafeText>
    </ScrollView>);
}
function DetailRow({ icon, label, value, colors }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    colors: ReturnType<typeof useAppTheme>['colors'];
}) {
    return (<View style={styles.detailRow}>
      <Ionicons name={icon} size={16} color={colors.textSecondary}/>
      <SafeText variant="caption" style={[styles.detailLabel, createSafeTextColorStyle9(colors.textSecondary)]}>{label}</SafeText>
      <SafeText variant="body" style={createSafeTextColorStyle6(colors.textPrimary)}>{value}</SafeText>
    </View>);
}
