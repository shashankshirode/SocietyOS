import { useState, useCallback } from "react";
import { View, ScrollView, Pressable, TextInput } from "react-native";
import { AppAlert } from "../../../../../ui/modal/AppAlert";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useMessages } from "../../../../../shared/constants/useMessages";
import { useSosResidenceContext } from "../../hooks/useSosResidenceContext";
import { trustedContactInvitationRepository } from "../../data/sosEmergencyContact.repository";
import type { SosType } from "../../data/sosResponsePlan.types";
import { SOS_TYPE_DEFINITIONS } from "../../data/sosTypeDefinitions";
import type { SosResponsePlanStackParamList } from "../../../../../app/navigation/navigation.types";
import { includeWhenPresent } from "../../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createScrollViewBackgroundColorStyle, createTextInputBackgroundColorBorderColorColorStyle, createPressableBackgroundColorBorderColorStyle, createSafeTextColorStyle6, createPressableBackgroundColorBorderColorStyle2, createTextInputBackgroundColorBorderColorColorStyle2, createPressableOpacityStyle } from "../../styles/screens/sos/TrustedResidentSearchScreen.styles";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
type Props = NativeStackScreenProps<SosResponsePlanStackParamList, 'TrustedResidentSearch'>;
const MOCK_RESIDENTS = [
    { id: 'res-1', name: 'Meera Desai', flat: 'A-1206', tower: 'A Wing' },
    { id: 'res-2', name: 'Rohit Verma', flat: 'B-302', tower: 'B Wing' },
    { id: 'res-3', name: 'Anita Kumar', flat: 'C-101', tower: 'C Wing' },
    { id: 'res-4', name: 'Sanjay Patel', flat: 'A-801', tower: 'A Wing' },
    { id: 'res-5', name: 'Kavita Rao', flat: 'D-205', tower: 'D Wing' },
];
export function TrustedResidentSearchScreen({ navigation }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const context = useSosResidenceContext();
    const trustedMsg = messages.resident?.emergency?.sosTrusted;
    const [search, setSearch] = useState('');
    const [selectedResident, setSelectedResident] = useState<(typeof MOCK_RESIDENTS)[0] | null>(null);
    const [selectedTypes, setSelectedTypes] = useState<Set<SosType>>(new Set(['medical', 'generalEmergency']));
    const [reason, setReason] = useState('');
    const [isSending, setIsSending] = useState(false);
    const filteredResidents = MOCK_RESIDENTS.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.flat.toLowerCase().includes(search.toLowerCase()));
    const toggleType = useCallback((type: SosType) => {
        setSelectedTypes((prev) => {
            const next = new Set(prev);
            if (next.has(type))
                next.delete(type);
            else
                next.add(type);
            return next;
        });
    }, []);
    const handleSendInvitation = useCallback(async () => {
        if (!context || !selectedResident)
            return;
        if (selectedTypes.size === 0) {
            AppAlert.alert(String(localizedUiText.m_68e1ca575295), messages.resident?.emergency?.sosValidation?.sosTypeRequired ?? String(localizedUiText.m_d9665db8ca40));
            return;
        }
        setIsSending(true);
        try {
            await trustedContactInvitationRepository.sendInvitation(context, {
                recipientResidentId: selectedResident.id,
                sosTypesRequested: Array.from(selectedTypes),
                ...includeWhenPresent("reason", reason.trim() || undefined)
            });
            AppAlert.alert(trustedMsg?.inviteSent ?? String(localizedUiText.m_fa5dcca03424), formatUiLiteral(String(localizedUiText.m_032fbf3dffe5), [selectedResident.name]));
            navigation.goBack();
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_f60346e14430));
        }
        finally {
            setIsSending(false);
        }
    }, [context, localizedUiText, messages, navigation, reason, selectedResident, selectedTypes, trustedMsg]);
    return (<ScrollView style={[styles.container, createScrollViewBackgroundColorStyle(colors.background)]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={[styles.privacyNotice, styles.viewBackgroundColorBorderColor]}>
        <Ionicons name="shield" size={16} color="#8B5CF6"/>
        <SafeText variant="tiny" style={styles.safeTextColorFontWeightFlex}>
          {trustedMsg?.invitePrivacy ?? localizedUiText.m_a1f65a420ca5}
        </SafeText>
      </View>

      {!selectedResident && (<>
          <TextInput style={[styles.searchInput, createTextInputBackgroundColorBorderColorColorStyle(colors.surface, colors.border, colors.textPrimary)]} value={search} onChangeText={setSearch} placeholder={trustedMsg?.searchPlaceholder ?? localizedUiText.m_06418597b384} placeholderTextColor={colors.textSecondary} accessibilityLabel={localizedUiText.m_05994556c935}/>

          {filteredResidents.map((resident) => (<Pressable key={resident.id} onPress={() => setSelectedResident(resident)} style={[styles.residentCard, createPressableBackgroundColorBorderColorStyle(colors.surface, colors.border)]} accessibilityRole="button">
              <View style={[styles.residentAvatar, styles.viewBackgroundColor]}>
                <SafeText variant="caption" style={styles.safeTextColorFontWeight}>
                  {resident.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </SafeText>
              </View>
              <View style={styles.residentContent}>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)}>{resident.name}</SafeText>
                <SafeText variant="tiny" style={createSafeTextColorStyle2(colors.textSecondary)}>{resident.flat} · {resident.tower}</SafeText>
              </View>
              <Ionicons name="add-circle" size={22} color="#8B5CF6"/>
            </Pressable>))}
        </>)}

      {selectedResident && (<>
          <View style={[styles.selectedCard, styles.viewBackgroundColorBorderColor2]}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(colors.textPrimary)}>{selectedResident.name}</SafeText>
            <SafeText variant="caption" style={createSafeTextColorStyle4(colors.textSecondary)}>{selectedResident.flat} · {selectedResident.tower}</SafeText>
            <Pressable onPress={() => setSelectedResident(null)} style={styles.changeButton}>
              <SafeText variant="tiny" style={styles.safeTextColorFontWeight2}>{localizedUiText.m_c0bf75bd78bf}</SafeText>
            </Pressable>
          </View>

          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle6(colors.textPrimary)]}>
            {trustedMsg?.selectSosTypes ?? localizedUiText.m_c7a2bbb00137}
          </SafeText>
          <View style={styles.chipRow}>
            {SOS_TYPE_DEFINITIONS.map((def) => {
                const isSelected = selectedTypes.has(def.sosType);
                const typeTitle = messages.resident?.emergency?.sosSettings?.types?.[def.sosType]?.title ?? def.sosType;
                return (<Pressable key={def.sosType} onPress={() => toggleType(def.sosType)} style={[styles.chip, createPressableBackgroundColorBorderColorStyle2(isSelected ? def.color + '18' : colors.surface, isSelected ? def.color : colors.border)]}>
                  <Ionicons name={def.icon as keyof typeof Ionicons.glyphMap} size={14} color={isSelected ? def.color : colors.textSecondary}/>
                  <SafeText variant="tiny" style={createSafeTextColorStyle5(isSelected ? def.color : colors.textSecondary)}>{typeTitle}</SafeText>
                </Pressable>);
            })}
          </View>

          <TextInput style={[styles.searchInput, createTextInputBackgroundColorBorderColorColorStyle2(colors.surface, colors.border, colors.textPrimary)]} value={reason} onChangeText={setReason} placeholder={trustedMsg?.reasonPlaceholder ?? localizedUiText.m_0ef35962803f} placeholderTextColor={colors.textSecondary} multiline accessibilityLabel={localizedUiText.m_f81ab834de5f}/>

          <Pressable onPress={handleSendInvitation} disabled={isSending} style={[styles.sendButton, createPressableOpacityStyle(isSending ? 0.6 : 1)]} accessibilityRole="button">
            <Ionicons name="paper-plane" size={18} color="#FFFFFF"/>
            <SafeText variant="bodyStrong" style={styles.sendText}>
              {isSending ? localizedUiText.m_b8ed5279e897 : (trustedMsg?.sendInvitation ?? localizedUiText.m_d076aa0f0494)}
            </SafeText>
          </Pressable>
        </>)}
    </ScrollView>);
}
