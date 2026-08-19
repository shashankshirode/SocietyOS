import { useState } from "react";
import { View, ScrollView, TextInput, Pressable } from "react-native";
import { AppAlert } from "../../../../../ui/modal/AppAlert";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../../shared/components/SafeText";
import { useMessages } from "../../../../../shared/constants/useMessages";
import type { SosResponsePlanStackParamList } from "../../../../../app/navigation/navigation.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createTextInputBackgroundColorBorderColorColorStyle, createScrollViewBackgroundColorStyle, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6 } from "../../styles/screens/sos/EmergencyProfileScreen.styles";
type Props = NativeStackScreenProps<SosResponsePlanStackParamList, 'EmergencyProfile'>;
function ProfileField({ label, value, onChangeText, placeholder, colors, multiline = false }: {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
    placeholder: string;
    colors: ReturnType<typeof useAppTheme>['colors'];
    multiline?: boolean;
}) {
    return (<View style={styles.field}>
      <SafeText variant="caption" style={[styles.label, createSafeTextColorStyle2(colors.textSecondary)]}>
        {label}
      </SafeText>
      <TextInput style={[
            styles.input,
            multiline && styles.multiline,
            createTextInputBackgroundColorBorderColorColorStyle(colors.surface, colors.border, colors.textPrimary),
        ]} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.textSecondary} multiline={multiline} accessibilityLabel={label}/>
    </View>);
}
export function EmergencyProfileScreen({ navigation }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const profileMsg = messages.resident?.emergency?.sosProfile ?? {};
    const [primaryName, setPrimaryName] = useState('');
    const [primaryPhone, setPrimaryPhone] = useState('');
    const [secondaryName, setSecondaryName] = useState('');
    const [secondaryPhone, setSecondaryPhone] = useState('');
    const [accessInstructions, setAccessInstructions] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [preferredHospital, setPreferredHospital] = useState('');
    const [familyDoctor, setFamilyDoctor] = useState('');
    const [medicalEquipment, setMedicalEquipment] = useState('');
    const handleSave = () => {
        AppAlert.alert(String(localizedUiText.m_b5c120b316c2), String(localizedUiText.m_80abfb005ec2));
        navigation.goBack();
    };
    return (<ScrollView style={[styles.container, createScrollViewBackgroundColorStyle(colors.background)]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <SafeText variant="caption" style={createSafeTextColorStyle(colors.textSecondary)}>
        {profileMsg?.subtitle ?? localizedUiText.m_c2d7a6666eb6}
      </SafeText>

      
      <View style={[styles.notice, styles.viewBackgroundColorBorderColor]}>
        <Ionicons name="shield" size={16} color="#F59E0B"/>
        <View style={styles.noticeContent}>
          <SafeText variant="tiny" style={styles.safeTextColorFontWeight}>
            {profileMsg?.sensitiveDataNotice ?? localizedUiText.m_fbefb2e17345}
          </SafeText>
          <SafeText variant="tiny" style={styles.safeTextColor}>
            {profileMsg?.optionalNotice ?? localizedUiText.m_445bccc05ea0}
          </SafeText>
        </View>
      </View>

      
      <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle3(colors.textPrimary)]}>
        {profileMsg?.primaryContact ?? localizedUiText.m_0f2d8f45f9e5}
      </SafeText>
      <ProfileField label={localizedUiText.m_dcd1d5223f73} value={primaryName} onChangeText={setPrimaryName} placeholder={localizedUiText.m_2c6b2e253c01} colors={colors}/>
      <ProfileField label={localizedUiText.m_63dceb8800b2} value={primaryPhone} onChangeText={setPrimaryPhone} placeholder="+91 98765 43210" colors={colors}/>

      
      <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle4(colors.textPrimary)]}>
        {profileMsg?.secondaryContact ?? localizedUiText.m_5f4fae03c7ee}
      </SafeText>
      <ProfileField label={localizedUiText.m_dcd1d5223f73} value={secondaryName} onChangeText={setSecondaryName} placeholder={localizedUiText.m_95036716a4cc} colors={colors}/>
      <ProfileField label={localizedUiText.m_63dceb8800b2} value={secondaryPhone} onChangeText={setSecondaryPhone} placeholder="+91 98765 43211" colors={colors}/>

      
      <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle5(colors.textPrimary)]}>
        {profileMsg?.accessInstructions ?? localizedUiText.m_bc5e8c2106ac}
      </SafeText>
      <ProfileField label={localizedUiText.m_3fc43d32d22f} value={accessInstructions} onChangeText={setAccessInstructions} placeholder={localizedUiText.m_2aa39c201ae3} colors={colors} multiline/>

      
      <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle6(colors.textPrimary)]}>
        {profileMsg?.medicalInfo ?? localizedUiText.m_5bc98e33e99f}
      </SafeText>
      <ProfileField label={profileMsg?.bloodGroup ?? localizedUiText.m_0605ff87d7ed} value={bloodGroup} onChangeText={setBloodGroup} placeholder={localizedUiText.m_7df329806ad6} colors={colors}/>
      <ProfileField label={profileMsg?.preferredHospital ?? localizedUiText.m_7376d6a8becb} value={preferredHospital} onChangeText={setPreferredHospital} placeholder={localizedUiText.m_6be1990b0ba1} colors={colors}/>
      <ProfileField label={profileMsg?.familyDoctor ?? localizedUiText.m_6fc501f06ee8} value={familyDoctor} onChangeText={setFamilyDoctor} placeholder={localizedUiText.m_1d7a793639b2} colors={colors}/>
      <ProfileField label={profileMsg?.medicalEquipment ?? localizedUiText.m_421d981d397f} value={medicalEquipment} onChangeText={setMedicalEquipment} placeholder={localizedUiText.m_fd97986f1d15} colors={colors} multiline/>

      
      <Pressable onPress={handleSave} style={[styles.saveButton, styles.pressableBackgroundColor]} accessibilityRole="button">
        <SafeText variant="bodyStrong" style={styles.saveText}>{localizedUiText.m_a4212f1e2fb0}</SafeText>
      </Pressable>
    </ScrollView>);
}

