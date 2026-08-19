import { useState, useCallback } from "react";
import { View, ScrollView, Pressable, TextInput } from "react-native";
import { AppAlert } from "../../../../../ui/modal/AppAlert";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useMessages } from "../../../../../shared/constants/useMessages";
import { useSosResidenceContext } from "../../hooks/useSosResidenceContext";
import { useSosEmergencyContacts } from "../../hooks/useSosEmergencyContacts";
import type { EmergencyContactCategory, EmergencyContactRelationshipType } from "../../data/sosEmergencyContact.types";
import type { SosType } from "../../data/sosResponsePlan.types";
import { ALL_SOS_TYPES, SOS_TYPE_DEFINITIONS } from "../../data/sosTypeDefinitions";
import type { SosResponsePlanStackParamList } from "../../../../../app/navigation/navigation.types";
import { includeWhenPresent } from "../../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createScrollViewBackgroundColorStyle, createSafeTextColorStyle4, createTextInputBackgroundColorBorderColorColorStyle, createSafeTextColorStyle5, createTextInputBackgroundColorBorderColorColorStyle2, createSafeTextColorStyle6, createTextInputBackgroundColorBorderColorColorStyle3, createSafeTextColorStyle7, createPressableBackgroundColorBorderColorStyle, createSafeTextColorStyle8, createPressableBackgroundColorBorderColorStyle2, createSafeTextColorStyle9, createPressableBackgroundColorBorderColorStyle3, createSafeTextColorStyle10, createTextInputBackgroundColorBorderColorColorStyle4, createPressableOpacityStyle } from "../../styles/screens/sos/AddEmergencyContactScreen.styles";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<SosResponsePlanStackParamList, 'AddEmergencyContact'>;
const CATEGORIES: {
    value: EmergencyContactCategory;
    label: string;
}[] = [
    { value: 'familyMember', get label() {
            return getActiveUiLiteral("m_bd2d677b2ed4");
        } },
    { value: 'externalContact', get label() {
            return getActiveUiLiteral("m_acd8f6644016");
        } },
    { value: 'medicalProfessional', get label() {
            return getActiveUiLiteral("m_24669ff48290");
        } },
    { value: 'serviceProvider', get label() {
            return getActiveUiLiteral("m_1fdbbfbed725");
        } },
];
const RELATIONSHIPS: {
    value: EmergencyContactRelationshipType;
    label: string;
}[] = [
    { value: 'spouse', get label() {
            return getActiveUiLiteral("m_f8930c3632d9");
        } },
    { value: 'parent', get label() {
            return getActiveUiLiteral("m_5f7953f7c9b6");
        } },
    { value: 'child', get label() {
            return getActiveUiLiteral("m_8053321281f5");
        } },
    { value: 'sibling', get label() {
            return getActiveUiLiteral("m_6c09e23e4807");
        } },
    { value: 'friend', get label() {
            return getActiveUiLiteral("m_acd8f6644016");
        } },
    { value: 'familyDoctor', get label() {
            return getActiveUiLiteral("m_6fc501f06ee8");
        } },
    { value: 'caretaker', get label() {
            return getActiveUiLiteral("m_04066ab4aea2");
        } },
    { value: 'neighbour', get label() {
            return getActiveUiLiteral("m_860af946e6d5");
        } },
    { value: 'other', get label() {
            return getActiveUiLiteral("m_f97e9da0e3b8");
        } },
];
export function AddEmergencyContactScreen({ navigation }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const context = useSosResidenceContext();
    const { addContact, isSubmitting } = useSosEmergencyContacts(context);
    const contactMsg = messages.resident?.emergency?.sosContacts;
    const validationMsg = messages.resident?.emergency?.sosValidation;
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState<EmergencyContactCategory>('familyMember');
    const [relationship, setRelationship] = useState<EmergencyContactRelationshipType>('spouse');
    const [selectedSosTypes, setSelectedSosTypes] = useState<Set<SosType>>(new Set(ALL_SOS_TYPES));
    const [notes, setNotes] = useState('');
    const toggleSosType = useCallback((type: SosType) => {
        setSelectedSosTypes((prev) => {
            const next = new Set(prev);
            if (next.has(type))
                next.delete(type);
            else
                next.add(type);
            return next;
        });
    }, []);
    const validate = useCallback((): string | null => {
        if (!name.trim())
            return validationMsg?.nameRequired ?? getActiveUiLiteral("m_604fd1b2e29c");
        if (!phone.trim() && !email.trim())
            return validationMsg?.contactMethodRequired ?? getActiveUiLiteral("m_3f1711eab169");
        if (selectedSosTypes.size === 0)
            return validationMsg?.sosTypeRequired ?? getActiveUiLiteral("m_d9665db8ca40");
        return null;
    }, [name, phone, email, selectedSosTypes, validationMsg]);
    const handleSave = useCallback(async () => {
        const error = validate();
        if (error) {
            AppAlert.alert(String(localizedUiText.m_68e1ca575295), error);
            return;
        }
        try {
            await addContact({
                displayName: name.trim(),
                category,
                relationship,
                phoneNumber: phone.trim(),
                ...includeWhenPresent("email", email.trim() || undefined),
                preferredChannels: ['push'],
                priority: 1,
                availableForSosTypes: Array.from(selectedSosTypes),
                ...includeWhenPresent("notes", notes.trim() || undefined)
            });
            navigation.goBack();
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_26939ea60ac7));
        }
    }, [name, phone, email, category, relationship, selectedSosTypes, notes, addContact, validate, navigation, localizedUiText]);
    return (<ScrollView style={[styles.container, createScrollViewBackgroundColorStyle(colors.background)]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      
      <View style={styles.field}>
        <SafeText variant="caption" style={[styles.label, createSafeTextColorStyle4(colors.textSecondary)]}>
          {contactMsg?.fieldName ?? localizedUiText.m_8e00cdf71fa7} *
        </SafeText>
        <TextInput style={[styles.input, createTextInputBackgroundColorBorderColorColorStyle(colors.surface, colors.border, colors.textPrimary)]} value={name} onChangeText={setName} placeholder={localizedUiText.m_f6d0605ea39e} placeholderTextColor={colors.textSecondary} accessibilityLabel={localizedUiText.m_f13a64ba2fea}/>
      </View>

      
      <View style={styles.field}>
        <SafeText variant="caption" style={[styles.label, createSafeTextColorStyle5(colors.textSecondary)]}>
          {contactMsg?.fieldPhone ?? localizedUiText.m_72dba9aeed89}
        </SafeText>
        <TextInput style={[styles.input, createTextInputBackgroundColorBorderColorColorStyle2(colors.surface, colors.border, colors.textPrimary)]} value={phone} onChangeText={setPhone} placeholder="+91 98765 43210" placeholderTextColor={colors.textSecondary} keyboardType="phone-pad" accessibilityLabel={localizedUiText.m_306f1bb20677}/>
      </View>

      
      <View style={styles.field}>
        <SafeText variant="caption" style={[styles.label, createSafeTextColorStyle6(colors.textSecondary)]}>
          {contactMsg?.fieldEmail ?? localizedUiText.m_09bf25ef3083}
        </SafeText>
        <TextInput style={[styles.input, createTextInputBackgroundColorBorderColorColorStyle3(colors.surface, colors.border, colors.textPrimary)]} value={email} onChangeText={setEmail} placeholder={localizedUiText.m_6bdb7e961d54} placeholderTextColor={colors.textSecondary} keyboardType="email-address" autoCapitalize="none" accessibilityLabel={localizedUiText.m_f2488fd4ef4a}/>
      </View>

      
      <View style={styles.field}>
        <SafeText variant="caption" style={[styles.label, createSafeTextColorStyle7(colors.textSecondary)]}>
          {contactMsg?.fieldCategory ?? localizedUiText.m_292c06f0045a}
        </SafeText>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => (<Pressable key={cat.value} onPress={() => setCategory(cat.value)} style={[
                styles.chip,
                createPressableBackgroundColorBorderColorStyle(category === cat.value ? '#3B82F6' + '18' : colors.surface, category === cat.value ? '#3B82F6' : colors.border),
            ]}>
              <SafeText variant="tiny" style={createSafeTextColorStyle(category === cat.value ? '#3B82F6' : colors.textSecondary)}>
                {cat.label}
              </SafeText>
            </Pressable>))}
        </View>
      </View>

      
      <View style={styles.field}>
        <SafeText variant="caption" style={[styles.label, createSafeTextColorStyle8(colors.textSecondary)]}>
          {contactMsg?.fieldRelationship ?? localizedUiText.m_25490a10d071}
        </SafeText>
        <View style={styles.chipRow}>
          {RELATIONSHIPS.map((rel) => (<Pressable key={rel.value} onPress={() => setRelationship(rel.value)} style={[
                styles.chip,
                createPressableBackgroundColorBorderColorStyle2(relationship === rel.value ? '#8B5CF6' + '18' : colors.surface, relationship === rel.value ? '#8B5CF6' : colors.border),
            ]}>
              <SafeText variant="tiny" style={createSafeTextColorStyle2(relationship === rel.value ? '#8B5CF6' : colors.textSecondary)}>
                {rel.label}
              </SafeText>
            </Pressable>))}
        </View>
      </View>

      
      <View style={styles.field}>
        <SafeText variant="caption" style={[styles.label, createSafeTextColorStyle9(colors.textSecondary)]}>
          {contactMsg?.fieldAvailableFor ?? localizedUiText.m_755d278ba35c}
        </SafeText>
        <View style={styles.chipRow}>
          {SOS_TYPE_DEFINITIONS.map((def) => {
            const isSelected = selectedSosTypes.has(def.sosType);
            return (<Pressable key={def.sosType} onPress={() => toggleSosType(def.sosType)} style={[
                    styles.chip,
                    createPressableBackgroundColorBorderColorStyle3(isSelected ? def.color + '18' : colors.surface, isSelected ? def.color : colors.border),
                ]}>
                <Ionicons name={def.icon as keyof typeof Ionicons.glyphMap} size={12} color={isSelected ? def.color : colors.textSecondary}/>
                <SafeText variant="tiny" style={createSafeTextColorStyle3(isSelected ? def.color : colors.textSecondary)}>
                  {messages.resident?.emergency?.sosSettings?.types?.[def.sosType]?.title ?? def.sosType}
                </SafeText>
              </Pressable>);
        })}
        </View>
      </View>

      
      <View style={styles.field}>
        <SafeText variant="caption" style={[styles.label, createSafeTextColorStyle10(colors.textSecondary)]}>
          {contactMsg?.fieldNotes ?? localizedUiText.m_8a7525b1492f}
        </SafeText>
        <TextInput style={[styles.input, styles.multilineInput, createTextInputBackgroundColorBorderColorColorStyle4(colors.surface, colors.border, colors.textPrimary)]} value={notes} onChangeText={setNotes} placeholder={localizedUiText.m_80550eca6304} placeholderTextColor={colors.textSecondary} multiline numberOfLines={3} accessibilityLabel={localizedUiText.m_8a7525b1492f}/>
      </View>

      
      <Pressable onPress={handleSave} disabled={isSubmitting} style={[styles.saveButton, createPressableOpacityStyle(isSubmitting ? 0.6 : 1)]} accessibilityRole="button" accessibilityLabel={localizedUiText.m_bf3d18baad3e}>
        <SafeText variant="bodyStrong" style={styles.saveButtonText}>
          {isSubmitting ? localizedUiText.m_23e39291d613 : localizedUiText.m_53aa95169c55}
        </SafeText>
      </Pressable>
    </ScrollView>);
}

